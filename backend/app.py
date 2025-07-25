from fastapi import FastAPI, HTTPException,UploadFile,File,Form
from fastapi.responses import StreamingResponse
from models import Musica
from mutagen import File as MutagenFile
from uuid import UUID
from io import BytesIO
from contextlib import asynccontextmanager
from tortoise import Tortoise
from config import TORTOISE_CONFIG

@asynccontextmanager
async def lifespan(app:FastAPI):
    await Tortoise.init(config=TORTOISE_CONFIG)
    await Tortoise.generate_schemas()  
    yield
    await Tortoise.close_connections()

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def read_root():  
    return {"message": "Rota raíz da aplicação"}

@app.post("/musica")
async def create_musica(titulo: str = Form(...),artista: str = Form(...), audio: UploadFile = File(...), imagem_capa: UploadFile = File(...)):
    audio_bytes = await audio.read()
    imagem_capa_bytes = await imagem_capa.read()
    audio_buffer = BytesIO(audio_bytes)
    audio_buffer.name = audio.filename
    info = MutagenFile(audio_buffer)
    if not info or not hasattr(info, "info"):
        raise HTTPException(400, "Formato de áudio não suportado")
    duracao_segundos = info.info.length  # float em segundos
    musica = await Musica.create(
        titulo=titulo,
        artista=artista,
        duracao=duracao_segundos,
        audio=audio_bytes,
        imagem_capa=imagem_capa_bytes
    )
    return musica.to_dict()

app.get("/musica/{musica_id}")
async def get_musica(musica_id: UUID):
    musica = await Musica.get(id=musica_id)
    if not musica:
        raise HTTPException(status_code=404, detail="Música não encontrada")
    return musica.to_dict()

@app.get("/musica/{musica_id}/imagem_capa")
async def get_musica_imagem_capa(musica_id: UUID):
    musica = await Musica.get(id=musica_id)
    if not musica:
        raise HTTPException(status_code=404, detail="Música não encontrada")
    return StreamingResponse(BytesIO(musica.imagem_capa), media_type="image/jpeg")

@app.get("/musica/{musica_id}/audio_data")
async def get_musica_audio_data(musica_id: UUID):
    musica = await Musica.get(id=musica_id)
    if not musica:
        raise HTTPException(status_code=404, detail="Música não encontrada")
    return StreamingResponse(BytesIO(musica.audio), media_type="audio/mpeg")

from fastapi import FastAPI, HTTPException,UploadFile,File,Form
from fastapi.responses import StreamingResponse
from models import Musica
from mutagen import File as MutagenFile
from uuid import UUID
from io import BytesIO
from contextlib import asynccontextmanager
from tortoise import Tortoise
from config import TORTOISE_CONFIG
import httpx

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

@app.get("/lista_musicas")
async def get_musicas():
    musicas = await Musica.all()
    return [musica.id for musica in musicas]

app.get("/musica/{musica_id}")
async def get_musica(musica_id: UUID):
    musica = await Musica.get_or_none(id=musica_id)
    if not musica:
        raise HTTPException(status_code=404, detail="Música não encontrada")
    return musica.to_dict()

@app.get("/musica/{musica_id}/imagem_capa")
async def get_musica_imagem_capa(musica_id: UUID):
    musica = await Musica.get_or_none(id=musica_id)
    if not musica:
        raise HTTPException(status_code=404, detail="Música não encontrada")
    return StreamingResponse(BytesIO(musica.imagem_capa), media_type="image/jpeg")

@app.get("/musica/{musica_id}/audio_data")
async def get_musica_audio_data(musica_id: UUID):
    musica = await Musica.get_or_none(id=musica_id)
    if not musica:
        raise HTTPException(status_code=404, detail="Música não encontrada")
    return StreamingResponse(BytesIO(musica.audio), media_type="audio/mpeg")

@app.get("/musica/{musica_id}/letra")
async def get_musica_letra(musica_id: UUID):
    musica = await Musica.get_or_none(id=musica_id)
    if not musica:
        raise HTTPException(status_code=404, detail="Música não encontrada")
    titulo_formatado = musica.titulo.replace(" ", "%20")
    key = '515b97b70d2edaa68b1cf63d47826967'
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://api.musixmatch.com/ws/1.1/track.search?q_track={titulo_formatado}&q_artist={musica.artista}&apikey={key}")
        response.raise_for_status()
        track_id = response.json()['message']['body']['track_list'][0]['track']['track_id']
        response = await client.get(f"http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id={track_id}&apikey={key}")
        response.raise_for_status()
        letra = response.json()['message']['body']['lyrics']['lyrics_body']
    return letra
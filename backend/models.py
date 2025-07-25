from tortoise.models import Model
from tortoise import fields
import uuid

class Musica(Model):
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    titulo = fields.CharField(max_length=255)
    artista = fields.CharField(max_length=255)
    duracao = fields.FloatField()
    audio = fields.BinaryField()
    imagem_capa = fields.BinaryField()

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "artista": self.artista,
            "duracao": self.duracao,
        }


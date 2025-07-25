export interface IMusica {
    id: string;
    artista: string;
    titulo: string;
    imagem_url: string;
    audio_bytes: string;
    letra?: string;
}

export default function AlbumContainer({ musica }: { musica: IMusica | null }) {
    return (
        <div className="flex items-center justify-center text-white w-1/2 pr-8">
            <div className="flex-grow flex gap-6 flex-col max-w-md">
                <div className="relative group">
                    <img
                        src={musica?.imagem_url}
                        alt="Capa do álbum"
                        className="rounded-xl shadow-2xl w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute -inset-4 bg-black/30 rounded-xl blur-xl -z-10"></div>
                </div>
                <div className="flex flex-col items-start space-y-2">
                    <span className="text-3xl font-bold tracking-tight">{musica?.titulo}</span>
                    <span className="text-white/70 text-lg font-medium">{musica?.artista}</span>

                </div>
            </div>
        </div>

    )
}
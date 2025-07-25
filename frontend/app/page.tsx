'use client'
import FooterReproducao from "./components/FooterReproducao";
import { BackgroundImage, BlackBlur } from "./components/Background";
import AlbumContainer, { IMusica } from "./components/AlbumContainer";
import { useEffect, useState } from "react";
import LetraContainer from "./components/LetraContainer";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { usePlaylist } from "./hooks/usePlaylist";
import { MusicaService } from "./services/musicaService";

export default function Home() {
  const audioPlayer = useAudioPlayer();
  const playlist = usePlaylist();
  const [listaIds, setListaIds] = useState<string[]>([]);

  useEffect(() => {
    MusicaService.buscarIds().then(ids => {
      if (ids) {
        setListaIds(ids);
        playlist.carregarPlaylist(ids);
      }
    });
  }, []);

  useEffect(() => {
    if (playlist.musicaAtual?.audio_bytes) {
      audioPlayer.loadAudioFromBytes(playlist.musicaAtual.audio_bytes);
    }
  }, [playlist.musicaAtual]);

  return (
    <section className="flex items-center justify-center h-full bg-black">
      <div
        className="flex flex-col min-w-[90%] min-h-[90%] shadow-2xl items-center rounded-2xl bg-blur-sm relative overflow-hidden"
      >
        <BackgroundImage imgSrc={playlist.musicaAtual?.imagem_url || "/seujorge.jpg"} />
        <BlackBlur />
        
        {playlist.loading ? (
          <div className="flex items-center justify-center flex-grow text-white">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          </div>
        ) : playlist.error ? (
          <div className="flex items-center justify-center flex-grow text-red-400">
            <p>Erro ao carregar música: {playlist.error}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-grow w-full h-full relative z-10 p-8">
              <AlbumContainer musica={playlist.musicaAtual} />
              <LetraContainer letra={playlist.musicaAtual?.letra} />
            </div>
            <FooterReproducao 
              audioPlayer={audioPlayer}
              onNext={playlist.proximaMusica}
              onPrevious={playlist.musicaAnterior}
            />
          </>
        )}
      </div>
    </section>
  );
}

import { useState, useCallback } from 'react';
import { IMusica } from '../components/AlbumContainer';
import { MusicaService } from '../services/musicaService';

interface UsePlaylistReturn {
  playlist: IMusica[];
  musicaAtual: IMusica | null;
  indiceAtual: number;
  loading: boolean;
  error: string | null;
  carregarPlaylist: (ids: string[]) => Promise<void>;
  carregarMusica: (id: string) => Promise<void>;
  proximaMusica: () => void;
  musicaAnterior: () => void;
}

export const usePlaylist = (): UsePlaylistReturn => {
  const [playlist, setPlaylist] = useState<IMusica[]>([]);
  const [musicaAtual, setMusicaAtual] = useState<IMusica | null>(null);
  const [indiceAtual, setIndiceAtual] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarPlaylist = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const musicasCarregadas: IMusica[] = [];
      
      // Carregar músicas em paralelo para melhor performance
      const promises = ids.map(id => MusicaService.buscarMusica(id));
      const resultados = await Promise.allSettled(promises);
      
      resultados.forEach((resultado, index) => {
        if (resultado.status === 'fulfilled' && resultado.value) {
          musicasCarregadas.push(resultado.value as IMusica);
        } else {
          console.warn(`Erro ao carregar música com ID ${ids[index]}:`, resultado);
        }
      });

      setPlaylist(musicasCarregadas);
      
      // Definir primeira música como atual se existir
      if (musicasCarregadas.length > 0) {
        setMusicaAtual(musicasCarregadas[0]);
        setIndiceAtual(0);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar playlist';
      setError(errorMessage);
      console.error('Erro ao carregar playlist:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarMusica = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const musica = await MusicaService.buscarMusica(id);
      if (musica) {
        setMusicaAtual(musica as IMusica);
        
        const indice = playlist.findIndex(m => m.id === id);
        if (indice !== -1) {
          setIndiceAtual(indice);
        } else {
          setPlaylist(prev => [...prev, musica as IMusica]);
          setIndiceAtual(playlist.length);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar música';
      setError(errorMessage);
      console.error('Erro ao carregar música:', err);
    } finally {
      setLoading(false);
    }
  }, [playlist]);

  const proximaMusica = useCallback(() => {
    if (playlist.length === 0) return;
    
    const proximoIndice = (indiceAtual + 1) % playlist.length;
    setIndiceAtual(proximoIndice);
    setMusicaAtual(playlist[proximoIndice]);
  }, [playlist, indiceAtual]);

  const musicaAnterior = useCallback(() => {
    if (playlist.length === 0) return;
    
    const indiceAnterior = indiceAtual === 0 ? playlist.length - 1 : indiceAtual - 1;
    setIndiceAtual(indiceAnterior);
    setMusicaAtual(playlist[indiceAnterior]);
  }, [playlist, indiceAtual]);


  return {
    playlist,
    musicaAtual,
    indiceAtual,
    loading,
    error,
    carregarPlaylist,
    carregarMusica,
    proximaMusica,
    musicaAnterior,
  };
};

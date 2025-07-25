interface IMusicaAPI {
  id: string;
  artista: string;
  titulo: string;
  imagem_url: string;
  audio_bytes: string; // base64 encoded
  letra?: string;
}

export class MusicaService {
  private static baseURL = 'http://localhost:8000';

  static async buscarIds(): Promise<string[] | null> {
    try {
        const response = await fetch(`${this.baseURL}/musicas/ids`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar IDs: ${response.status}`);
        }
        const ids: string[] = await response.json();
        return ids;
    }
    catch(error){
        console.error('Erro ao buscar IDs:', error);
        return null;
    }
  }

  static async buscarMusica(id: string): Promise<IMusicaAPI | null> {
    try {
      const response = await fetch(`${this.baseURL}/musica/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar música: ${response.status}`);
      }

      const musica: IMusicaAPI = await response.json();
      return musica;
    } catch (error) {
      console.error('Erro ao buscar música:', error);
      return null;
    }
  }

  static async buscarMusicas(): Promise<IMusicaAPI[]> {
    try {
      const response = await fetch(`${this.baseURL}/musicas`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar músicas: ${response.status}`);
      }

      const musicas: IMusicaAPI[] = await response.json();
      return musicas;
    } catch (error) {
      console.error('Erro ao buscar músicas:', error);
      return [];
    }
  }

  static async buscarAudioBytes(id: string): Promise<ArrayBuffer | null> {
    try {
      const response = await fetch(`${this.baseURL}/musica/${id}/audio`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar áudio: ${response.status}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Erro ao buscar áudio:', error);
      return null;
    }
  }

  static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}

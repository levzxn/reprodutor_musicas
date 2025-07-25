import { useState, useRef, useEffect } from 'react';

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  loadAudioFromBytes: (audioBytes: string | ArrayBuffer, mimeType?: string) => void;
  formatTime: (seconds: number) => string;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const createAudioFromBytes = (audioBytes: string | ArrayBuffer, mimeType: string = 'audio/mpeg'): string => {
    try {
      let blob: Blob

      if (typeof audioBytes === 'string') {
        // Se os bytes estão em base64
        const binaryString = atob(audioBytes)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        blob = new Blob([bytes], { type: mimeType })
      } else {
        // Se os bytes são ArrayBuffer
        blob = new Blob([audioBytes], { type: mimeType })
      }
      
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error('Erro ao converter bytes para áudio:', error)
      return ''
    }
  }

  const loadAudioFromBytes = (audioBytes: string | ArrayBuffer, mimeType?: string) => {
    if (!audioBytes || (typeof audioBytes === 'string' && audioBytes.length === 0)) return

    
    // Limpar URL anterior se existir
    if (audioRef.current?.src && audioRef.current.src.startsWith('blob:')) {
      URL.revokeObjectURL(audioRef.current.src)
    }

    const audioUrl = createAudioFromBytes(audioBytes, mimeType)
    
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    
    audioRef.current.src = audioUrl
    audioRef.current.volume = volume
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const play = async () => {
    if (!audioRef.current) return
    
    try {
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error)
    }
  }

  const pause = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }
  }

  const seek = (time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    togglePlay,
    setVolume,
    seek,
    loadAudioFromBytes,
    formatTime,
  }
}

import { FaBackwardStep, FaCirclePlay, FaCirclePause, FaForwardStep, FaVolumeHigh } from "react-icons/fa6";

interface AudioPlayer {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  formatTime: (seconds: number) => string;
}

interface FooterReproducaoProps {
  audioPlayer: AudioPlayer;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function FooterReproducao({ audioPlayer, onNext, onPrevious }: FooterReproducaoProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    setVolume,
    seek,
    formatTime,
  } = audioPlayer;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    seek(newTime)
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    setVolume(percent)
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const volumePercent = volume * 100
    return (
        <footer className="w-full py-6 px-8 relative z-10 bg-black/30 backdrop-blur-md border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
                <div className="w-1/4"></div>

                <div className="flex flex-col items-center gap-3 w-2/4">
                    <div className="flex gap-6 justify-center items-center">
                        <FaBackwardStep
                            size={20}
                            className={`cursor-pointer hover:scale-110 transition-all duration-200 ${
                                onPrevious ? 'text-white/60 hover:text-white' : 'text-white/30 cursor-not-allowed'
                            }`}
                            onClick={onPrevious}
                        />
                        <div className="relative" onClick={togglePlay}>
                            {isPlaying ? (
                                <FaCirclePause
                                    size={48}
                                    className="text-white cursor-pointer hover:scale-110 transition-all duration-200 drop-shadow-lg"
                                />
                            ) : (
                                <FaCirclePlay
                                    size={48}
                                    className="text-white cursor-pointer hover:scale-110 transition-all duration-200 drop-shadow-lg"
                                />
                            )}
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-lg -z-10"></div>
                        </div>
                        <FaForwardStep
                            size={20}
                            className={`cursor-pointer hover:scale-110 transition-all duration-200 ${
                                onNext ? 'text-white/60 hover:text-white' : 'text-white/30 cursor-not-allowed'
                            }`}
                            onClick={onNext}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-1/4 justify-end">
                    <FaVolumeHigh size={18} className="text-white/60" />
                    <div 
                        className="w-28 bg-white/20 rounded-full h-1.5 relative cursor-pointer group backdrop-blur-sm"
                        onClick={handleVolumeClick}
                    >
                        <div 
                            className="bg-white h-full rounded-full transition-all duration-300 relative group-hover:bg-green-400"
                            style={{ width: `${volumePercent}%` }}
                        >
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-white/80">
                <span className="font-mono text-xs">{formatTime(currentTime)}</span>
                <div 
                    className="flex-grow bg-white/20 rounded-full h-1.5 relative cursor-pointer hover:h-2 transition-all duration-200 group backdrop-blur-sm"
                    onClick={handleProgressClick}
                >
                    <div 
                        className="bg-white h-full rounded-full transition-all duration-300 relative group-hover:bg-green-400"
                        style={{ width: `${progressPercent}%` }}
                    >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"></div>
                    </div>
                </div>
                <span className="font-mono text-xs">{formatTime(duration)}</span>
            </div>
        </footer>
    )

}
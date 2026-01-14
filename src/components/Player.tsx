import React, { useState, useRef, useEffect } from "react";
import { PlayIcon, PauseIcon, VolumeUpIcon, HistoryIcon } from "./icons";

const STREAM_URL = import.meta.env.VITE_STREAM_URL || "https://stream.zeno.fm/qnozhn4xig7uv";

interface PlayerProps {
  onToggleHistory: () => void;
  metadata: { artist: string; title: string; albumArt: string };
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const Player: React.FC<PlayerProps> = ({
  onToggleHistory,
  metadata,
  isPlaying,
  onTogglePlay,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const setupAudioContext = () => {
    if (audioRef.current && !audioContextRef.current) {
      try {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioRef.current);

        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        sourceRef.current = source;
      } catch (error) {
        console.error("Error creating audio source:", error);
      }
    }
  };

  const drawVisualizer = () => {
    if (
      !analyserRef.current ||
      !canvasRef.current ||
      !dataArrayRef.current ||
      !isPlaying
    )
      return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d")!;
    const bufferLength = analyserRef.current.frequencyBinCount;

    analyserRef.current.getByteTimeDomainData(
      dataArrayRef.current as Uint8Array<ArrayBuffer>
    );
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2 * (window.devicePixelRatio || 1);
    canvasCtx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    canvasCtx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArrayRef.current[i] / 128.0;
      const y = (v * canvas.height) / 2;
      i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
    animationFrameId.current = requestAnimationFrame(drawVisualizer);
  };

  useEffect(() => {
    if (isPlaying) {
      setupAudioContext();
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
      audioRef.current?.play().catch(() => onTogglePlay());
      animationFrameId.current = requestAnimationFrame(drawVisualizer);
    } else {
      audioRef.current?.pause();
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    }
    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [isPlaying]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  return (
    <div className="w-full h-full items-center flex justify-center">
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 z-[-1] w-full h-full opacity-40"
      />
      <div
        className={`fixed flex bottom-0 left-0 right-0 text-white border-t border-white/5 z-1000 transition-all duration-300
          ${
            isExpanded
              ? "h-screen flex-col justify-end p-4 sm:p-6 md:p-8 cursor-default bg-[#0a0a0a]"
              : "h-16 sm:h-20 flex-row items-center justify-between p-2 sm:p-2.5 sm:px-5 gap-2 sm:gap-5 cursor-pointer bg-[#0f0f0f] hover:bg-[#151515]"
          }`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <audio
          ref={audioRef}
          src={STREAM_URL}
          crossOrigin="anonymous"
          onWaiting={() => isPlaying && setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
        />
        {isExpanded && (
          <button
            className="self-end absolute top-4 right-4 sm:top-5 sm:right-6 md:right-10 cursor-pointer p-2 rounded hover:bg-white/5 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
          >
            <img
              src="https://www.svgrepo.com/show/521469/arrow-down.svg"
              width={24}
              alt="Minimize"
              className="invert opacity-70 hover:opacity-100 transition-opacity"
            />
          </button>
        )}

        <div
          className={`flex w-full h-full items-center ${
            isExpanded
              ? "flex-col justify-center sm:flex-col max-w-md mx-auto"
              : "flex-row-reverse md:flex-row justify-between"
          }`}
        >
          {metadata.title.length > 0 && metadata.artist.length > 0 && (
            <div
              className={`flex w-full md:w-auto items-center gap-2 sm:gap-4 shrink min-w-0 ${
                isExpanded ? "flex-col order-1 mt-4 sm:mt-6 md:mt-0" : "order-2 flex-4 md:flex-initial"
              }`}
            >
              <img
                className={`object-cover transition-all duration-300 ${metadata.albumArt.endsWith(".svg") && "invert"} ${
                  isExpanded
                    ? `w-48 h-48 sm:w-64 sm:h-64 md:max-w-xs md:max-h-xs rounded-full mb-4 sm:mb-5 animate-[spin_20s_linear_infinite] ${
                        metadata.albumArt.includes("music-1005.svg") &&
                        "grayscale"
                      }`
                    : "w-10 h-10 sm:w-[50px] sm:h-[50px] rounded hover:opacity-90"
                }`}
                src={metadata.albumArt}
                alt="Album art"
                draggable={false}
              />
              <div
                className={`flex flex-col overflow-hidden ${
                  isExpanded ? "mb-3 sm:mb-4 items-center text-center px-4" : ""
                }`}
              >
                <p
                  className={`font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white ${
                    isExpanded ? "text-xl sm:text-2xl" : "text-xs sm:text-sm"
                  }`}
                >
                  {metadata.title}
                </p>
                <p
                  className={`whitespace-nowrap overflow-hidden text-ellipsis text-gray-400 ${
                    isExpanded
                      ? "text-base sm:text-lg mt-1"
                      : "text-[10px] sm:text-xs"
                  }`}
                >
                  {metadata.artist}
                </p>
              </div>
            </div>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center cursor-default ${
              isExpanded
                ? "flex-col order-2 w-full max-w-xs mx-auto gap-4 sm:gap-6"
                : "order-1 gap-2 sm:gap-4 flex-1 md:flex-initial"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-4">
              {isLoading ? (
                <div
                  className={`rounded-full flex items-center justify-center ${
                    isExpanded
                      ? "w-16 h-16 sm:w-20 sm:h-20 bg-white/10"
                      : "w-8 h-8 sm:w-10 sm:h-10"
                  }`}
                >
                  <div
                    className={`animate-spin rounded-full border-2 border-white border-t-transparent ${
                      isExpanded
                        ? "w-8 h-8 sm:w-10 sm:h-10"
                        : "w-5 h-5 sm:w-6 sm:h-6"
                    }`}
                  />
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePlay();
                  }}
                  className={`bg-none border-none rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isExpanded
                      ? "w-16 h-16 sm:w-20 sm:h-20 bg-white text-black hover:bg-gray-100"
                      : "w-8 h-8 sm:w-10 sm:h-10 hover:bg-white/10"
                  }`}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
              )}
              {!isExpanded && (
                <button
                  onClick={onToggleHistory}
                  className="text-white hover:text-gray-300 transition-colors p-1.5 sm:p-2 rounded hover:bg-white/5"
                >
                  <HistoryIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>
            <div
              className={`flex items-center gap-2 sm:gap-2.5 ${
                isExpanded ? "w-full mt-2 sm:mt-4" : "hidden md:flex"
              }`}
            >
              <VolumeUpIcon />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-white/20 rounded-full outline-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;

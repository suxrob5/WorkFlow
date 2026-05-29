interface Props {
  stopCamera: () => void;
  capturePhoto: () => void;
  currentLocation: { latitude: number; longitude: number } | null;
  locationLoading: boolean;
  cameraError: string | null;
}

const AcCamCaptureScreen: React.FC<Props> = ({
  stopCamera,
  capturePhoto,
  currentLocation,
  locationLoading,
  cameraError,
}) => {
  return (
    /* Active Camera Capture Frame Screen */
    <div className="space-y-6 flex flex-col items-center animate-fadeIn">
      <div className="flex justify-between items-center w-full max-w-md">
        <span className="flex items-center gap-2 text-xs font-bold text-red-500 dark:text-red-400 tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          Камера в эфире
        </span>
        <button
          onClick={stopCamera}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors"
        >
          Отмена
        </button>
      </div>

      <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black flex items-center justify-center shadow-2xl">
        {cameraError ? (
          <p className="text-xs text-red-400 px-6 leading-relaxed">
            {cameraError}
          </p>
        ) : (
          <video
            id="home-camera"
            className="w-full h-full object-cover transform -scale-x-100"
            playsInline
            muted
          />
        )}

        {/* GPS Badge loading indicator overlay */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-[11px] text-slate-300 flex items-center gap-2 font-mono">
          <span
            className={`w-2 h-2 rounded-full ${currentLocation ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}
          />
          {locationLoading
            ? "Определение GPS..."
            : currentLocation
              ? `GPS: ${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}`
              : "Ожидание спутников..."}
        </div>
      </div>

      {!cameraError && (
        <button
          onClick={capturePhoto}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition active:scale-[0.98] flex items-center gap-2 cursor-pointer shadow-lg dark:shadow-white/15"
        >
          <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
          Сделать снимок
        </button>
      )}
    </div>
  );
};

export default AcCamCaptureScreen;

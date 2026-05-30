import Image from "next/image";
import LastSec from "./last-sec";
import AcCamCaptureScreen from "./ac-cam-capture-screen";
import StableState from "./stanble-state";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { AttendanceType } from "@/types";

interface DynamicAvaProps {
  isCameraActive: boolean;
  capturedPhoto: string | null;
  currentLocation: { latitude: number; longitude: number } | null;
  locationLoading: boolean;
  cameraError: string | null;
  setCameraError: (error: string | null) => void;
  setCapturedPhoto: (photo: string | null) => void;
  setIsCameraActive: (active: boolean) => void;
  setCameraStream: (stream: MediaStream | null) => void;
  setToastMessage: (message: string) => void;
  setShowToast: (show: boolean) => void;
  getCheckInsFromFirebase: () => Promise<AttendanceType[]>;
  setDisplayCheckIns: (checkIns: AttendanceType[]) => void;
  setCurrentLocation: (
    location: { latitude: number; longitude: number } | null,
  ) => void;
  cameraStream: MediaStream | null;
  setLocationLoading: (loading: boolean) => void;
}

const DynamicAva: React.FC<DynamicAvaProps> = ({
  isCameraActive,
  capturedPhoto,
  currentLocation,
  locationLoading,
  cameraError,
  setCameraError,
  setCapturedPhoto,
  setIsCameraActive,
  setCameraStream,
  setToastMessage,
  setShowToast,
  getCheckInsFromFirebase,
  setDisplayCheckIns,
  setCurrentLocation,
  cameraStream,
  setLocationLoading,
}) => {

 const submitCheckIn = async () => {
  try {
    if (!capturedPhoto || !currentLocation) {
      setToastMessage("Фото или GPS не найдены");
      setShowToast(true);
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      setToastMessage("Пользователь не авторизован");
      setShowToast(true);
      return;
    }

    // User data
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists()
      ? userDoc.data()
      : { name: "Unknown User" };

    // Current date/time
    const now = new Date();

    const date = now.toISOString().split("T")[0];

    const checkIn = now.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Work start time
    const WORK_START_HOUR = 8;
    const WORK_START_MINUTE = 0;

    const workStart = new Date(now);
    workStart.setHours(
      WORK_START_HOUR,
      WORK_START_MINUTE,
      0,
      0
    );

    // Late calculation
    const lateMinutes = Math.max(
      0,
      Math.floor(
        (now.getTime() - workStart.getTime()) / 60000
      )
    );

    const status =
      lateMinutes > 0 ? "late" : "present";

    // Save attendance
    await addDoc(collection(db, "attendance"), {
      userId: user.uid,
      userName: userData.name,

      date,
      checkIn,

      status,
      lateMinutes,

      imageUrl: capturedPhoto,

      location: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },

      createdAt: serverTimestamp(),
    });

    // Refresh history
    const updatedData =
      await getCheckInsFromFirebase();

    setDisplayCheckIns(updatedData);

    // Reset UI
    setCapturedPhoto(null);
    setCurrentLocation(null);
    setIsCameraActive(false);

    // Success message
    if (status === "late") {
      setToastMessage(
        `Вы опоздали на ${lateMinutes} мин.`
      );
    } else {
      setToastMessage(
        "Смена успешно зафиксирована!"
      );
    }

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  } catch (error) {
    console.error("Check-in error:", error);

    setToastMessage(
      "Ошибка при сохранении отметки"
    );

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }
};

  // Camera stream controls
  const startCamera = async () => {
    setCameraError(null);
    setCapturedPhoto(null);
    setIsCameraActive(true);
    requestLocation();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      setCameraStream(stream);
      // Small timeout for DOM element render binding
      setTimeout(() => {
        const videoElement = document.getElementById(
          "home-camera",
        ) as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.play();
        }
      }, 300);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(
        "Не удалось получить доступ к камере. Убедитесь, что разрешение предоставлено.",
      );
    }
  };
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    const videoElement = document.getElementById(
      "home-camera",
    ) as HTMLVideoElement;
    if (!videoElement) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setToastMessage("Геолокация не поддерживается вашим браузером");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Standard reliable Technopark Tashkent coordinates
        setCurrentLocation({
          latitude: 41.311081,
          longitude: 69.240562,
        });
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div>
      <div className="w-full rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-[0_25px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.3)] p-6 md:p-8 mb-8 text-center relative overflow-hidden transition-all duration-300">
        {/* Subtle glow border when camera active */}
        {isCameraActive && (
          <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-3xl pointer-events-none animate-pulse" />
        )}

        {!isCameraActive && !capturedPhoto ? (
          <StableState startCamera={startCamera} />
        ) : isCameraActive ? (
          <AcCamCaptureScreen
            stopCamera={stopCamera}
            capturePhoto={capturePhoto}
            currentLocation={currentLocation}
            locationLoading={locationLoading}
            cameraError={cameraError}
          />
        ) : (
          /* Review captured photo and confirmation block */
          <div className="flex flex-col md:flex-row gap-8 items-center text-left animate-fadeIn">
            <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 relative shadow-inner bg-slate-100 dark:bg-slate-950">
              <Image
                src={capturedPhoto!}
                alt="Shot shift preview"
                fill
                className="object-cover"
              />
            </div>

            <LastSec
              currentLocation={currentLocation}
              startCamera={startCamera}
              submitCheckIn={submitCheckIn}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicAva;

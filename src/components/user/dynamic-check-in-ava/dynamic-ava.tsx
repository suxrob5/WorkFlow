import { CheckIn } from "@/app/(root)/page";
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
  getCheckInsFromFirebase: () => Promise<CheckIn[]>;
  setDisplayCheckIns: (checkIns: CheckIn[]) => void;
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
  // const pushData = async (checkIn: CheckIn) => {
  //   return await addDoc(collection(db, "user-data"), {
  //     checkIn,
  //     createdAt: serverTimestamp(),
  //   });
  // };
  const submitCheckIn = async () => {
    if (!capturedPhoto || !currentLocation) return;

    // const newCheckIn: CheckIn = {
    //   id: "CI-" + Math.floor(Math.random() * 90000 + 10000),
    //   image: capturedPhoto,
    //   location: currentLocation,
    //   timestamp: new Date().toLocaleString("ru-RU"),
    // };
    const user = auth.currentUser;

    await addDoc(collection(db, "attendance"), {
      userId: user?.uid,
      image: capturedPhoto,
      location: currentLocation,
      timestamp: new Date().toLocaleString("ru-RU"),
    });

    const userDoc = await getDoc(doc(db, "users", user!.uid));
    console.log(userDoc);

    // await pushData(newCheckIn);

    // Fetch fresh data from Firebase
    const updatedData = await getCheckInsFromFirebase();
    setDisplayCheckIns(updatedData);

    setCapturedPhoto(null);
    setCurrentLocation(null);
    setIsCameraActive(false);

    setToastMessage("Смена успешно зафиксирована!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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

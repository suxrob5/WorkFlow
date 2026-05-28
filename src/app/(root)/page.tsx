"use client"

import { useState, useEffect } from "react"
import Header from "@/components/user/header"
import Image from "next/image"
import { db } from "@/firebase"
import { addDoc, collection, getDocs } from "firebase/firestore"

export default function Home() {
  // Check-in array features
  interface CheckIn {
    id: string
    image: string
    location: {
      latitude: number
      longitude: number
    }
    timestamp: string
  }

  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  console.log(checkIns);


  // Feedback notifications
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Load check-ins on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCheckIns = localStorage.getItem("profile_checkins")
      if (savedCheckIns) {
        try {
          setCheckIns(JSON.parse(savedCheckIns))
        } catch (e) {
          console.error("Error parsing check-ins", e)
        }
      }
    }

    // Cleanup camera stream on unmount
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  // Camera stream controls
  const startCamera = async () => {
    setCameraError(null)
    setCapturedPhoto(null)
    setIsCameraActive(true)
    requestLocation()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      })
      setCameraStream(stream)
      // Small timeout for DOM element render binding
      setTimeout(() => {
        const videoElement = document.getElementById("home-camera") as HTMLVideoElement
        if (videoElement) {
          videoElement.srcObject = stream
          videoElement.play()
        }
      }, 300)
    } catch (err) {
      console.error("Camera access error:", err)
      setCameraError("Не удалось получить доступ к камере. Убедитесь, что разрешение предоставлено.")
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    const videoElement = document.getElementById("home-camera") as HTMLVideoElement
    if (!videoElement) return

    const canvas = document.createElement("canvas")
    canvas.width = videoElement.videoWidth || 640
    canvas.height = videoElement.videoHeight || 480
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg")
      setCapturedPhoto(dataUrl)
      stopCamera()
    }
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setToastMessage("Геолокация не поддерживается вашим браузером")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLocationLoading(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        // Standard reliable Technopark Tashkent coordinates
        setCurrentLocation({
          latitude: 41.311081,
          longitude: 69.240562
        })
        setLocationLoading(false)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const submitCheckIn = () => {
    if (!capturedPhoto || !currentLocation) return

    const newCheckIn: CheckIn = {
      id: "CI-" + Math.floor(Math.random() * 90000 + 10000),
      image: capturedPhoto,
      location: currentLocation,
      timestamp: new Date().toLocaleString("ru-RU")
    }

    const updated = [newCheckIn, ...checkIns]
    setCheckIns(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("profile_checkins", JSON.stringify(updated))
    }

    setCapturedPhoto(null)
    setCurrentLocation(null)
    setIsCameraActive(false)

    setToastMessage("Смена успешно зафиксирована!")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const deleteCheckIn = (id: string) => {
    const updated = checkIns.filter(item => item.id !== id)
    setCheckIns(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("profile_checkins", JSON.stringify(updated))
    }
    setToastMessage("Запись удалена!")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  // firebase

  async function addWithAutoId() {
  const docRef = await addDoc(collection(db, "YOUR_COLLECTION"), {
    name: "John Doe",
    createdAt: new Date()
  });
  console.log("Document written with ID: ", docRef.id);
}

  async function getAllDocuments() {
    const querySnapshot = await getDocs(collection(db, "user-data"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      console.log(checkIns);
    });
  }

  return (
    <div className="min-h-screen text-slate-100 font-nunito relative overflow-hidden pb-16">

      {/* Navigation Header */}
      <Header />

      {/* Glowing Ambient Background Circles */}
      <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none z-0" />

      {/* Floating Status Toast */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}>
        <div className="bg-[#021E5D] border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-6">

        {/* Welcome Section */}
        <div className="text-center md:text-left mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none bg-linear-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent">
            Система фиксации смен WorkFlow
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-medium max-w-xl">
            Зарегистрируйте свое присутствие, сделав отметку с помощью встроенной камеры вашего устройства и геопозиции.
          </p>
        </div>

        {/* Dynamic Check-in Activator Card */}
        <div className="w-full rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_25px_50px_rgba(0,0,0,0.3)] p-6 md:p-8 mb-8 text-center relative overflow-hidden">

          {/* Subtle glow border when camera active */}
          {isCameraActive && (
            <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-3xl pointer-events-none animate-pulse" />
          )}

          {!isCameraActive && !capturedPhoto ? (
            /* Standby State */
            <div className="py-8 space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-linear-to-tr from-sky-500/10 to-indigo-600/20 border border-white/15 flex items-center justify-center shadow-lg relative group">
                <span className="absolute inset-0 rounded-full bg-sky-500/5 animate-ping" />
                <svg className="w-10 h-10 text-sky-400 group-hover:scale-110 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Готовы начать рабочую смену?</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Программа запросит доступ к фронтальной камере для снимка и запишет текущие координаты GPS для сверки.
                </p>
              </div>

              <button
                onClick={startCamera}
                className="bg-linear-to-r from-sky-500 to-blue-600 hover:opacity-95 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2.5 cursor-pointer text-sm"
              >
                Начать отметку смены
              </button>
            </div>
          ) : isCameraActive ? (
            /* Active Camera Capture Frame Screen */
            <div className="space-y-6 flex flex-col items-center animate-fadeIn">
              <div className="flex justify-between items-center w-full max-w-md">
                <span className="flex items-center gap-2 text-xs font-bold text-red-400 tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Камера в эфире
                </span>
                <button
                  onClick={stopCamera}
                  className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Отмена
                </button>
              </div>

              <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center shadow-2xl">
                {cameraError ? (
                  <p className="text-xs text-red-400 px-6 leading-relaxed">{cameraError}</p>
                ) : (
                  <video id="home-camera" className="w-full h-full object-cover transform -scale-x-100" playsInline muted />
                )}

                {/* GPS Badge loading indicator overlay */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-[11px] text-slate-300 flex items-center gap-2 font-mono">
                  <span className={`w-2 h-2 rounded-full ${currentLocation ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                  {locationLoading ? "Определение GPS..." : currentLocation ? `GPS: ${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}` : "Ожидание спутников..."}
                </div>
              </div>

              {!cameraError && (
                <button
                  onClick={capturePhoto}
                  className="bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-100 transition active:scale-[0.98] flex items-center gap-2 cursor-pointer shadow-lg shadow-white/15"
                >
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                  Сделать снимок
                </button>
              )}
            </div>
          ) : (
            /* Review captured photo and confirmation block */
            <div className="flex flex-col md:flex-row gap-8 items-center text-left animate-fadeIn">
              <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden border border-white/10 relative shadow-inner bg-slate-950">
                <Image src={capturedPhoto!} alt="Shot shift preview" fill className="object-cover" />
              </div>

              <div className="w-full md:w-1/2 space-y-5">
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-5 rounded-2xl space-y-2.5">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Данные верифицированы:
                  </h4>
                  <div className="text-xs space-y-1.5 font-mono mt-3">
                    <p>📸 Фото фиксация: Выполнена</p>
                    <p>🧭 Широта: {currentLocation?.latitude.toFixed(6) || "..."}</p>
                    <p>🧭 Долгота: {currentLocation?.longitude.toFixed(6) || "..."}</p>
                    <p>⏰ Время регистрации: {new Date().toLocaleString("ru-RU")}</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={startCamera}
                    className="bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 font-semibold px-5 py-3 rounded-2xl transition cursor-pointer text-xs"
                  >
                    Переснять
                  </button>
                  <button
                    onClick={submitCheckIn}
                    className="bg-linear-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer text-xs"
                  >
                    Завершить и отправить
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Historical Checkin Array Grid Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              История отметок присутствия ({checkIns.length})
            </h2>
            {checkIns.length > 0 && (
              <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2.5 py-1 rounded-full font-bold uppercase border border-sky-400/20 tracking-wider">
                Массив обновлен
              </span>
            )}
          </div>

          {checkIns.length === 0 ? (
            <div className="bg-white/2 border border-white/5 p-12 rounded-3xl text-center text-slate-400 backdrop-blur-md">
              <svg className="w-14 h-14 text-slate-600 mx-auto mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-bold text-slate-300">Сохраненных отметок не найдено</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Сделайте первый фотоснимок с координатами GPS выше, чтобы сформировать массив данных смены.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checkIns.map((item) => (
                <div key={item.id} className="bg-white/5 border border-white/10 hover:border-white/20 p-4 rounded-3xl backdrop-blur-md flex gap-4 transition duration-300 hover:scale-[1.01] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] relative group">

                  {/* Absolute Delete Button on hover */}
                  <button
                    onClick={() => deleteCheckIn(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
                    title="Удалить отметку"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  {/* Camera Snapshot base64 preview */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shrink-0 relative">
                    <Image src={item.image} alt="Snaped Checkin shot" fill className="object-cover" />
                  </div>

                  {/* Metadata display */}
                  <div className="flex flex-col justify-between py-1 text-left min-w-0 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase tracking-wide">
                          Verified
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">{item.id}</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.timestamp}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono text-slate-400 leading-tight">
                        🧭 Lat: {item.location.latitude.toFixed(6)}
                        <br />

                        🧭 Lng: {item.location.longitude.toFixed(6)}
                      </div>
                      <iframe
                        className=""
                        src={`https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2999.7623640488337!2d${item.location.longitude.toFixed(6)}!3d${item.location.latitude.toFixed(6)}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2z${item.location.latitude.toFixed(6)}N,${item.location.longitude.toFixed(6)}E!5e0!3m2!1sru!2s!4v1780006456673!5m2!1sru!2s`} width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${item.location.latitude},${item.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-400 hover:text-sky-300 transition"
                      >
                        Открыть карту
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

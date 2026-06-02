"use client";

import { useState, useEffect } from "react";
import Header from "@/components/user/header";
import { auth, db } from "@/firebase";
import WelcomeSec from "@/components/user/welcome-sec";
import DynamicAva from "@/components/user/dynamic-check-in-ava/dynamic-ava";
import DisplayCheckIns from "@/components/user/display-check-ins";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { AttendanceType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [checkingRole, setCheckingRole] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [displayCheckIns, setDisplayCheckIns] = useState<AttendanceType[]>([]);

  // Feedback notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const checkUserRole = async () => {
      if (loading) return;

      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : null;

        if (role === "admin") {
          router.push("/dashboard");
          return;
        }

        setCheckingRole(false);
      } catch (error) {
        console.error("Error checking user role:", error);
        setCheckingRole(false);
      }
    };

    checkUserRole();
  }, [user, loading, router]);

  // Check-in array features

  // Load check-ins from Firestore on mount
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const data = await getCheckInsFromFirebase();
      setDisplayCheckIns(data);
    };

    loadData();
  }, [user]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const deleteCheckIn = async (docId: string) => {
    await deleteDoc(doc(db, "attendance", docId));

    // Fetch fresh data from Firebase
    const updatedData = await getCheckInsFromFirebase();
    setDisplayCheckIns(updatedData);

    setToastMessage("Запись удалена!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // firebase

  async function getCheckInsFromFirebase(): Promise<AttendanceType[]> {
    if (!auth.currentUser) return [];

    const q = query(
      collection(db, "attendance"),
      where("userId", "==", auth.currentUser.uid),
    );

    const snapshot = await getDocs(q);
    const firestoreCheckIns: AttendanceType[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      firestoreCheckIns.push({
        id: doc.id,
        userId: data.userId,
        userName: data.userName || "Unknown",
        date: data.date || data.timestamp || "",
        checkIn: data.checkIn || "",
        checkOut: data.checkOut,
        checkOutImageUrl: data.checkOutImageUrl,
        checkOutLocation: data.checkOutLocation,
        earlyLeaveMinutes: data.earlyLeaveMinutes || 0,
        overtimeMinutes: data.overtimeMinutes || 0,
        workedMinutes: data.workedMinutes || 0,
        status: data.status || "present",
        lateMinutes: data.lateMinutes || 0,
        imageUrl: data.imageUrl || data.image || "",
        location: data.location,
        createdAt: data.createdAt,
      });
    });

    return firestoreCheckIns.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? new Date(a.date).getTime();
      const bTime = b.createdAt?.toMillis?.() ?? new Date(b.date).getTime();
      return bTime - aTime;
    });
  }

  const today = new Date().toISOString().split("T")[0];
  const activeCheckIn =
    displayCheckIns.find((item) => item.date === today && !item.checkOut) ??
    null;

  if (loading || checkingRole || !user) {
    return null;
  }

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 font-nunito relative overflow-hidden pb-16 transition-colors duration-300">
      {/* Navigation Header */}
      <Header />

      {/* Glowing Ambient Background Circles */}
      <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none z-0" />

      {/* Floating Status Toast */}
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}
      >
        <div className="bg-white dark:bg-[#021E5D] border border-slate-200/60 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-6 py-4 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-6">
        {/* Welcome Section */}
        <WelcomeSec />

        {/* Dynamic Check-in Activator Card */}
        <DynamicAva
          isCameraActive={isCameraActive}
          capturedPhoto={capturedPhoto}
          currentLocation={currentLocation}
          locationLoading={locationLoading}
          cameraError={cameraError}
          setCameraError={setCameraError}
          setCapturedPhoto={setCapturedPhoto}
          setIsCameraActive={setIsCameraActive}
          setCameraStream={setCameraStream}
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
          getCheckInsFromFirebase={getCheckInsFromFirebase}
          setDisplayCheckIns={setDisplayCheckIns}
          setCurrentLocation={setCurrentLocation}
          cameraStream={cameraStream}
          setLocationLoading={setLocationLoading}
          activeCheckInId={activeCheckIn?.id ?? null}
          activeCheckIn={activeCheckIn}
          isCheckingOut={Boolean(activeCheckIn)}
        />
        {/* Historical Checkin Array Grid Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10 transition-colors">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              История отметок присутствия ({displayCheckIns.length})
            </h2>
            {displayCheckIns.length > 0 && (
              <span className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-full font-bold uppercase border border-sky-400/20 tracking-wider">
                Массив обновлен
              </span>
            )}
          </div>
          {/* DisplayCheckIns */}
          <DisplayCheckIns
            displayCheckIns={displayCheckIns}
            deleteCheckIn={deleteCheckIn}
          />
        </div>
      </main>
    </div>
  );
}

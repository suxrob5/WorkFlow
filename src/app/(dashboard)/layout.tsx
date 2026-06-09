"use client";

import Loading from "@/components/loading";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (loading) return;

      if (!user) {
        router.push("/");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : null;

        if (role === "admin") {
          setIsAdmin(true);
          return;
        }

        router.push("/");
      } catch (error) {
        console.error("Error checking admin role:", error);
        router.push("/");
      } finally {
        setCheckingRole(false);
      }
    };

    checkAdminRole();
  }, [loading, router, user]);

  if (loading || checkingRole) {
    return <Loading pageName="панели управления..." />;
  }
  if (!user) {
    return null;
  }

  return children;
};

export default DashboardLayout;

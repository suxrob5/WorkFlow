"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname() || "/";
    const isActive = (path: string) =>
        pathname === path || pathname.startsWith(path + "/");

    const [avatarUrl, setAvatarUrl] = useState("https://randomuser.me/api/portraits/men/1.jpg")

    // Dynamic header avatar sync!
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedAvatar = localStorage.getItem("profile_avatar")
            if (savedAvatar) {
                setAvatarUrl(savedAvatar)
            }
            
            // Listen for storage changes in case of multi-tab sync
            const handleStorageChange = () => {
                const updatedAvatar = localStorage.getItem("profile_avatar")
                if (updatedAvatar) setAvatarUrl(updatedAvatar)
            }
            window.addEventListener("storage", handleStorageChange)
            
            // Custom event in case update happens in the same tab/window
            window.addEventListener("profileUpdate", handleStorageChange)

            return () => {
                window.removeEventListener("storage", handleStorageChange)
                window.removeEventListener("profileUpdate", handleStorageChange)
            }
        }
    }, [])

    return (
        <div className=" bg-[#011E5D]/95 text-white backdrop-blur-sm border-b border-white/10 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.5)]">

            <div className="mx-auto flex max-w-400 items-center justify-between gap-6 px-4 py-4 text-[17px] md:px-6">

                <div className="flex items-center gap-3">
                    <Image
                        src="/main-logo.png"
                        alt="Logo"
                        width={42}
                        height={42}
                        className="rounded-2xl border border-white/10 bg-white/5 p-1 transition duration-300 hover:scale-[1.03]"
                    />
                    <h1 className="text-2xl font-semibold tracking-tight">WorkFlow</h1>

                </div>
                <div>
                    <Link
                        href="/profile"
                        className={`inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-1 text-sm font-medium text-white transition duration-200 ${isActive("/profile") ? "bg-white/10" : "bg-white/5 hover:border-white/30 hover:bg-white/15 hover:text-slate-100"}`}
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-sky-500/40 overflow-hidden relative">
                            <Image src={avatarUrl} alt="User Avatar" fill className="rounded-full object-cover" />
                        </span>
                        <span>Profile</span>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default Header
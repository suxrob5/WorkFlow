import { getUsers } from "@/firebase/db"
import { useEffect, useState } from "react";

const ProfileStats = () => {
    const [users, setUsers] = useState<any>(null);

    useEffect(() => {
        const getUserSize = async () => {
            const totalUsers = await getUsers();
            setUsers(totalUsers)
        }

        getUserSize()
    }, [])
    console.log(users);

    


    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-md">
                <span className="text-2xl md:text-3xl font-extrabold text-amber-500 tracking-tight">
                    {/* {users.size} */}
                </span>
                <span className="text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase">
                    Сотрудники
                </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-md">
                <span className="text-2xl md:text-3xl font-extrabold text-rose-600 tracking-tight">
                    12
                </span>
                <span className="text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase">
                    Активные смены
                </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-md">
                <span className="text-2xl md:text-3xl font-extrabold text-teal-600 tracking-tight">
                    Online
                </span>
                <span className="text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase">
                    Система
                </span>
            </div>
        </div>
    )
}

export default ProfileStats

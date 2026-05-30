"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getEmployeesFromFirestore, seedDatabaseIfEmpty } from "@/firebase/db";

type User = {
  id: string | number;
  name: string;
  lastName?: string;
  email?: string;
  position?: string;
  time?: string;
  avatar?: string;
};

const PAGE_SIZE = 4;

const Users = () => {
  const [source, setSource] = useState<User[]>([]);
  const [filter, setFilter] = useState("");
  const [dept, setDept] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSource, setFetchingSource] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch employees from Firestore on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setFetchingSource(true);
        // Ensure seeding
        await seedDatabaseIfEmpty();
        const liveEmployees = await getEmployeesFromFirestore();
        setSource(liveEmployees);
      } catch (error) {
        console.error("Error fetching live employees:", error);
      } finally {
        setFetchingSource(false);
      }
    };
    fetchEmployees();
  }, []);

  const filtered = useMemo(() => {
    return source.filter((u) => {
      const q = filter.trim().toLowerCase();
      const inName = q
        ? `${u.name} ${u.lastName || ""}`.toLowerCase().includes(q)
        : true;
      const inDept = dept
        ? (u.position || "").toLowerCase() === dept.toLowerCase()
        : true;
      return inName && inDept;
    });
  }, [source, filter, dept]);

  useEffect(() => {
    // reset when filter or dept changes
    setPage(1);
    setItems([]);
    setHasMore(true);
  }, [filter, dept]);

  useEffect(() => {
    if (fetchingSource) return;

    let mounted = true;
    const load = async () => {
      setLoading(true);
      // simulate minor network delay
      await new Promise((r) => setTimeout(r, 400));
      if (!mounted) return;
      const start = (page - 1) * PAGE_SIZE;
      const next = filtered.slice(start, start + PAGE_SIZE);
      setItems((prev) => [...prev, ...next]);
      setHasMore(start + PAGE_SIZE < filtered.length);
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [page, filtered, fetchingSource]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          hasMore &&
          !fetchingSource
        ) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 },
    );
    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [loading, hasMore, fetchingSource]);

  // derive departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    source.forEach((u) => set.add((u.position || "").trim()));
    return Array.from(set).filter(Boolean);
  }, [source]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Список сотрудников
        </h2>

        <div className="flex items-center gap-2">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Поиск по имени..."
            className="rounded-md bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-sky-400"
          />

          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="rounded-md bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none"
          >
            <option
              value=""
              className="text-slate-900 bg-white dark:bg-[#021236] dark:text-white"
            >
              All departments
            </option>
            {departments.map((d) => (
              <option
                key={d}
                value={d}
                className="text-slate-900 bg-white dark:bg-[#021236] dark:text-white"
              >
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="space-y-3">
        {fetchingSource ? (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-300 animate-pulse">
            Loading employees database…
          </div>
        ) : items && items.length > 0 ? (
          items.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 rounded-lg bg-white/40 dark:bg-white/3 border border-slate-100 dark:border-transparent p-3 shadow-sm transition hover:shadow-md hover:bg-white/60 dark:hover:bg-white/5"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar || `/main-logo.png`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-white/10 object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {user.name} {user.lastName}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {user.position || "Сотрудник"}
                  </div>
                </div>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-300">
                {user.email || "—"}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-300">
            No users found.
          </p>
        )}

        <div ref={sentinelRef} />

        {loading && !fetchingSource && (
          <div className="py-4 text-center text-sm text-slate-500 dark:text-slate-300">
            Loading…
          </div>
        )}

        {!hasMore && !loading && !fetchingSource && items.length > 0 && (
          <div className="py-4 text-center text-sm text-slate-500 dark:text-slate-300">
            No more users
          </div>
        )}
      </section>
    </div>
  );
};

export default Users;

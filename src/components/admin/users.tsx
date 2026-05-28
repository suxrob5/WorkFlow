"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { users as allUsers } from "@/data/user";

type User = {
  id: number;
  name: string;
  lastName?: string;
  email?: string;
  position?: string;
  time?: string;
  avatar?: string;
};

const PAGE_SIZE = 4;

const Users = () => {
  const [filter, setFilter] = useState("");
  const [dept, setDept] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // normalize source users
  const source: User[] = useMemo(
    () =>
      allUsers.map((u) => ({
        id: u.id,
        name: u.name,
        lastName: u.lastName,
        email: u.email,
        position: (u as any).position || (u as any).time || "",
        avatar: u.avatar,
      })),
    [],
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    return source.filter((u) => {
      const q = filter.trim().toLowerCase();
      const inName = q
        ? `${u.name} ${u.lastName}`.toLowerCase().includes(q)
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
    let mounted = true;
    const load = async () => {
      setLoading(true);
      // simulate network delay
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
  }, [page, filtered]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 },
    );
    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [loading, hasMore]);

  // derive departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    source.forEach((u) => set.add((u.position || "").trim()));
    return Array.from(set).filter(Boolean);
  }, [source]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-white">Список сотрудников</h2>

        <div className="flex items-center gap-2">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Поиск по имени..."
            className="rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-sky-400"
          />

          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d} className="text-black">
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="space-y-3">
        {items && items.length > 0 ? (
          items.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 rounded-lg bg-white/3 p-3 shadow-sm transition hover:shadow-md hover:bg-white/5"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar || `/main-logo.png`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-white/10 object-cover"
                />
                <div>
                  <div className="text-sm font-medium text-white">
                    {user.name} {user.lastName}
                  </div>
                  <div className="text-sm text-slate-300">
                    {user.position || "Сотрудник"}
                  </div>
                </div>
              </div>

              <div className="text-sm text-slate-300">{user.email || "—"}</div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-300">No users found.</p>
        )}

        <div ref={sentinelRef} />

        {loading && (
          <div className="py-4 text-center text-sm text-slate-300">
            Loading…
          </div>
        )}

        {!hasMore && !loading && items.length > 0 && (
          <div className="py-4 text-center text-sm text-slate-300">
            No more users
          </div>
        )}
      </section>
    </div>
  );
};

export default Users;

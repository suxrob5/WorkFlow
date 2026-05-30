const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc, writeBatch } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCJippIMXTncZSfxqwTtzTkSPBHXoR8mhg",
  authDomain: "workflow-2f3d5.firebaseapp.com",
  projectId: "workflow-2f3d5",
  storageBucket: "workflow-2f3d5.firebasestorage.app",
  messagingSenderId: "578814345330",
  appId: "1:578814345330:web:aefe7078e33ca87787c2eb",
  measurementId: "G-J613096JQJ",
};

// Initial beautiful mock datasets
const DASHBOARD_STATS = [
  {
    label: "Всего сотрудников",
    value: "350",
    delta: "+12",
    deltaLabel: "за месяц",
    color: "from-sky-500 to-blue-600",
    glow: "shadow-sky-500/25",
  },
  {
    label: "На смене сегодня",
    value: "286",
    delta: "81.7%",
    deltaLabel: "явка",
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/25",
  },
  {
    label: "Отсутствуют",
    value: "64",
    delta: "-5",
    deltaLabel: "vs вчера",
    color: "from-rose-500 to-red-600",
    glow: "shadow-rose-500/25",
  },
  {
    label: "Эффективность",
    value: "94%",
    delta: "+2.1%",
    deltaLabel: "vs прошлый мес.",
    color: "from-violet-500 to-indigo-600",
    glow: "shadow-violet-500/25",
  },
];

const SCHEDULE_SUMMARY = [
  { label: "Активных смен",   value: "12",  sub: "В этом месяце", icon: "🗓️", color: "from-sky-500 to-blue-600"      },
  { label: "Утренних смен",   value: "5",   sub: "08:00 – 16:00",  icon: "🌅", color: "from-amber-500 to-orange-500"  },
  { label: "Ночных смен",     value: "3",   sub: "22:00 – 06:00",  icon: "🌙", color: "from-indigo-500 to-violet-600" },
  { label: "Сверхурочных ч.", value: "147", sub: "За этот месяц",  icon: "⚡", color: "from-rose-500 to-pink-600"    },
];

const SHIFTS = [
  { id: 1, employee: "Алексей Петров",   dept: "Разработка",    shift: "Утро (08:00–16:00)",  days: ["Пн","Вт","Ср","Чт","Пт"], status: "active"   },
  { id: 2, employee: "Мария Иванова",    dept: "Менеджмент",    shift: "День (10:00–18:00)",  days: ["Пн","Вт","Чт","Пт"],        status: "active"   },
  { id: 3, employee: "Дмитрий Козлов",   dept: "DevOps",        shift: "Ночь (22:00–06:00)",  days: ["Пн","Ср","Пт"],             status: "active"   },
  { id: 4, employee: "Анна Сидорова",    dept: "Дизайн",        shift: "Утро (08:00–16:00)",  days: ["Вт","Ср","Чт","Пт"],        status: "vacation" },
  { id: 5, employee: "Иван Новиков",     dept: "Тестирование",  shift: "День (10:00–18:00)",  days: ["Пн","Вт","Ср","Чт","Пт"], status: "active"   },
  { id: 6, employee: "Ольга Федорова",   dept: "Разработка",    shift: "Вечер (14:00–22:00)", days: ["Ср","Чт","Пт","Сб"],        status: "sick"     },
  { id: 7, employee: "Сергей Михайлов",  dept: "Менеджмент",    shift: "День (10:00–18:00)",  days: ["Пн","Вт","Ср"],             status: "active"   },
  { id: 8, employee: "Татьяна Волкова",  dept: "Дизайн",        shift: "Утро (08:00–16:00)",  days: ["Пн","Вт","Ср","Чт","Пт"], status: "active"   },
  { id: 9, employee: "Роман Беляев",     dept: "DevOps",        shift: "День (10:00–18:00)",  days: ["Пн","Вт","Ср","Чт"],        status: "active"   },
  { id:10, employee: "Екатерина Попова", dept: "Тестирование",  shift: "Утро (08:00–16:00)",  days: ["Вт","Ср","Чт","Пт"],        status: "vacation" },
];

const BAR_CHART_DATA = {
  labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  datasets: [
    {
      label: "Присутствовали",
      data: [42, 38, 45, 50, 47, 20, 10],
      backgroundColor: "rgba(56, 189, 248, 0.8)",
      borderColor: "rgba(56, 189, 248, 1)",
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    },
    {
      label: "Отсутствовали",
      data: [8, 12, 5, 0, 3, 30, 40],
      backgroundColor: "rgba(239, 68, 68, 0.6)",
      borderColor: "rgba(239, 68, 68, 1)",
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
};

const LINE_CHART_DATA = {
  labels: ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],
  datasets: [
    {
      label: "Рабочие часы",
      data: [168, 152, 176, 165, 180, 172, 188, 175, 160, 170, 158, 165],
      borderColor: "rgba(56, 189, 248, 1)",
      backgroundColor: "rgba(56, 189, 248, 0.1)",
      pointBackgroundColor: "rgba(56, 189, 248, 1)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 8,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
    {
      label: "Сверхурочные",
      data: [12, 8, 15, 10, 20, 14, 25, 18, 9, 13, 7, 11],
      borderColor: "rgba(167, 139, 250, 1)",
      backgroundColor: "rgba(167, 139, 250, 0.1)",
      pointBackgroundColor: "rgba(167, 139, 250, 1)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 8,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
  ],
};

const DOUGHNUT_CHART_DATA = {
  labels: ["Разработчики", "Менеджеры", "Дизайнеры", "Тестировщики", "DevOps"],
  datasets: [
    {
      label: "Сотрудники",
      data: [35, 20, 18, 15, 12],
      backgroundColor: [
        "rgba(56, 189, 248, 0.85)",
        "rgba(99, 102, 241, 0.85)",
        "rgba(16, 185, 129, 0.85)",
        "rgba(245, 158, 11, 0.85)",
        "rgba(239, 68, 68, 0.85)",
      ],
      borderColor: "rgba(1,18,54,1)",
      borderWidth: 3,
      hoverOffset: 10,
    },
  ],
};

const PIE_CHART_DATA = {
  labels: ["ПРИШЛИ", "НЕ ПРИШЛИ"],
  datasets: [
    {
      label: "Сотрудники",
      data: [286, 64],
      backgroundColor: [
        "rgba(56, 189, 248, 0.85)",
        "rgba(239, 68, 68, 0.75)",
      ],
      borderColor: "rgba(1,18,54,1)",
      borderWidth: 3,
      hoverOffset: 12,
    },
  ],
};

const mockUsers = [
  { id: 1, name: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+1 555-123-4567", time: "Engineering", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+1 555-123-4567", time: "Engineering", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 3, name: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+1 555-123-4567", time: "Engineering", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 4, name: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+1 555-123-4567", time: "Engineering", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 5, name: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+1 555-123-4567", time: "Engineering", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 6, name: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+1 555-123-4567", time: "Engineering", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 7, name: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+1 555-123-4567", time: "Engineering", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
];

const seed = async () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log("Connecting to Firestore with projectId:", firebaseConfig.projectId);

  try {
    // 1. Stats
    console.log("Seeding dashboard stats...");
    await setDoc(doc(db, "dashboard_data", "stats"), { items: DASHBOARD_STATS });
    console.log("✅ Stats seeded!");

    // 2. Schedule summary
    console.log("Seeding schedule summaries...");
    await setDoc(doc(db, "dashboard_data", "schedule_summary"), { items: SCHEDULE_SUMMARY });
    console.log("✅ Schedule summaries seeded!");

    // 3. Charts
    console.log("Seeding chart datasets...");
    await setDoc(doc(db, "dashboard_data", "charts"), {
      bar: BAR_CHART_DATA,
      line: LINE_CHART_DATA,
      doughnut: DOUGHNUT_CHART_DATA,
      pie: PIE_CHART_DATA,
    });
    console.log("✅ Charts seeded!");

    // 4. Shifts
    console.log("Seeding individual shifts...");
    const shiftsBatch = writeBatch(db);
    const shiftsCol = collection(db, "shifts");
    SHIFTS.forEach((shift) => {
      shiftsBatch.set(doc(shiftsCol, `shift_${shift.id}`), shift);
    });
    await shiftsBatch.commit();
    console.log("✅ Shifts collection seeded!");

    // 5. Users
    console.log("Seeding mock employees...");
    const usersBatch = writeBatch(db);
    const usersCol = collection(db, "users");
    mockUsers.forEach((u) => {
      usersBatch.set(doc(usersCol, `user_${u.id}`), {
        name: u.name,
        lastName: u.lastName || "",
        email: u.email || "",
        phone: u.phone || "",
        position: u.time || "Engineering",
        avatarUrl: u.avatar || "/user-logo.png",
        role: "user",
        createdAt: new Date().toISOString(),
      });
    });
    await usersBatch.commit();
    console.log("✅ Users/employees collection seeded!");

    console.log("\n🎉 ALL DATA HAS BEEN SUCCESSFULLY SEEDED DIRECTLY TO FIREBASE!");
  } catch (error) {
    console.error("\n❌ Error seeding Firebase:", error.message);
    if (error.code) console.error("Error Code:", error.code);
  }
};

seed();

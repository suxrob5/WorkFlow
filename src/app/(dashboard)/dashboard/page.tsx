import PieChart from "@/components/chart/pie-chart";
import Header from "@/components/header";
import Users from "@/components/users";

const Dashboard = () => {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-10">
          <section className="md:col-span-3 rounded-2xl bg-white/5 border border-white/10 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Сотрудники
            </h2>
            <PieChart />
          </section>

          <section className="md:col-span-7 rounded-2xl bg-white/5 border border-white/10 p-6 shadow-lg">
            {/* <h2 className="mb-4 text-lg font-semibold text-white">
              Список сотрудников
            </h2> */}
            <Users />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

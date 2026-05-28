import Header from "@/components/header";
import UsersList from "@/components/users";

const Users = () => {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <section className="rounded-2xl bg-white/5 border border-white/10 p-6 shadow-lg">
          <UsersList />
        </section>
      </main>
    </div>
  );
};

export default Users;

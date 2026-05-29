import Header from '@/components/admin/header';
import UsersList from '@/components/admin/users';

const Users = () => {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <section className="rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-6 shadow-md dark:shadow-lg backdrop-blur-xl transition-all duration-300">
          <UsersList />
        </section>
      </main>
    </div>
  );
};

export default Users;

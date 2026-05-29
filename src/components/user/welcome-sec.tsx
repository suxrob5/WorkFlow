const WelcomeSec = () => {
  return (
    <div className="text-center md:text-left mb-8 space-y-2">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 dark:from-white dark:via-slate-100 dark:to-sky-200 bg-clip-text text-transparent transition-all duration-300">
        Система фиксации смен WorkFlow
      </h1>
      <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium max-w-xl">
        Зарегистрируйте свое присутствие, сделав отметку с помощью встроенной
        камеры вашего устройства и геопозиции.
      </p>
    </div>
  );
};

export default WelcomeSec;

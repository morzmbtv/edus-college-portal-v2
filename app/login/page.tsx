"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpenCheck, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => router.push("/dashboard"), 650);
  }

  return (
    <main className="min-h-screen bg-canvas p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1400px] overflow-hidden rounded-[28px] bg-white shadow-card lg:grid-cols-[1.03fr_.97fr]">
        <section className="relative hidden overflow-hidden bg-[#123269] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full border border-white/10" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-primary"><BookOpenCheck size={25} /></span>
            <span className="text-xl font-extrabold tracking-tight">EDUS</span>
          </div>
          <div className="relative max-w-xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[.18em] text-blue-200">Колледж начинается с порядка</p>
            <h1 className="text-[46px] font-bold leading-[1.12] tracking-[-.035em]">Управляйте учебным процессом в одном пространстве</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-blue-100/80">Расписание, успеваемость, посещаемость и документы — наглядно и всегда под рукой.</p>
            <div className="mt-10 flex items-center gap-3 text-sm text-blue-100"><ShieldCheck size={19} /><span>Демонстрационная версия · данные защищены</span></div>
          </div>
          <p className="relative text-xs text-blue-200/70">© 2026 EDUS. Цифровая среда для колледжей Казахстана</p>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-20">
          <div className="w-full max-w-[430px] animate-rise">
            <div className="mb-10 flex items-center gap-3 lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white"><BookOpenCheck size={23} /></span><span className="text-xl font-extrabold">EDUS</span></div>
            <p className="text-sm font-semibold text-primary">Добро пожаловать</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-.03em]">Вход в систему</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Введите данные вашей учётной записи. Для демо подойдут любые значения.</p>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block text-sm font-semibold text-slate-700">Логин
                <input required defaultValue="director@college.kz" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-50" placeholder="example@college.kz" />
              </label>
              <label className="block text-sm font-semibold text-slate-700">Пароль
                <span className="relative mt-2 block"><input required defaultValue="123456" type={showPassword ? "text" : "password"} className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-12 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-50" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
                </span>
              </label>
              <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-slate-600"><input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />Запомнить меня</label><button type="button" className="font-semibold text-primary hover:underline">Забыли пароль?</button></div>
              <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-70">{loading ? "Входим…" : "Войти в портал"}<ArrowRight size={18} /></button>
            </form>
            <p className="mt-8 text-center text-xs leading-5 text-slate-400">Это демо-макет. Введённые данные никуда не отправляются.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

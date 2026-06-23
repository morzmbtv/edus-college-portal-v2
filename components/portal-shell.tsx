"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckSquare2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  ShieldCheck,
  TimerReset,
  Users,
  X,
} from "lucide-react";
import { roleRoutes, roles, useRole, type Role } from "@/components/role-context";
import { DashboardTasks } from "@/components/dashboard-tasks";
import { DirectorComplianceWidget } from "@/components/director-compliance-widget";

const nav = [
  ["/dashboard", "Обзор", LayoutDashboard],
  ["/college", "Колледж", Building2],
  ["/tasks", "Задачи", CheckSquare2],
  ["/ai-risks", "AI Центр рисков", BrainCircuit],
  ["/compliance", "Проверки и соответствие", ShieldCheck],
  ["/students", "Студенты", GraduationCap],
  ["/teachers", "Преподаватели", Users],
  ["/staff", "Сотрудники", BriefcaseBusiness],
  ["/schedule", "Расписание", CalendarDays],
  ["/performance", "Успеваемость", BarChart3],
  ["/attendance", "Face ID и доступ", ClipboardCheck],
  ["/timesheet", "Табель", TimerReset],
  ["/documents", "Документооборот", FileText],
  ["/communications", "Коммуникации", MessageSquareText],
  ["/settings", "Настройки", Settings],
] as const;

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);

  const sidebar = (
    <>
      <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shadow-lg shadow-blue-200"><BookOpenCheck size={23} /></span>
        <div className="min-w-0">
          <p className="text-lg font-extrabold tracking-tight">EDUS</p>
          <p className="truncate text-[10px] font-semibold uppercase tracking-[.13em] text-slate-400">Портал колледжа</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {nav.map(([href, label, Icon]) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          const available = roleRoutes[role].includes(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              title={available ? label : `Раздел не основной для роли «${role}»`}
              className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition ${active ? "bg-blue-50 text-primary" : available ? "text-slate-500 hover:bg-slate-50 hover:text-slate-900" : "text-slate-300 opacity-55 hover:bg-slate-50 hover:opacity-90"}`}
            >
              <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
              <span className="min-w-0 truncate">{label}</span>
              {active ? <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> : null}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-bold text-slate-700">Демо-версия</p>
        <p className="mt-1 text-[11px] leading-4 text-slate-400">Данные обновлены сегодня в 09:42</p>
      </div>
      <Link href="/login" className="m-3 mt-0 flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600">
        <LogOut size={18} />Выйти
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-slate-200/80 bg-white lg:flex">{sidebar}</aside>
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Закрыть меню" className="absolute inset-0 bg-slate-900/30" onClick={() => setMenuOpen(false)} />
          <aside className="relative flex h-full w-[280px] flex-col bg-white shadow-2xl">
            {sidebar}
            <button onClick={() => setMenuOpen(false)} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-slate-500"><X size={20} /></button>
          </aside>
        </div>
      ) : null}
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/70 bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button aria-label="Открыть меню" onClick={() => setMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"><Menu size={21} /></button>
            <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-slate-400 sm:flex sm:w-64 xl:w-80">
              <Search size={17} />
              <input className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400" placeholder="Найти студента, документ…" />
            </div>
            <button onClick={() => setSearchOpen(!searchOpen)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 sm:hidden"><Search size={19} /></button>
          </div>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <label className="relative flex h-10 min-w-0 items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-2.5 text-primary sm:px-3">
              <span className="hidden text-[10px] font-bold text-blue-500 sm:inline">Режим:</span>
              <select value={role} onChange={(event) => setRole(event.target.value as Role)} className="max-w-[140px] appearance-none truncate bg-transparent pr-5 text-[11px] font-extrabold outline-none">
                <option disabled>Выберите роль</option>
                {roles.map((item) => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5" />
            </label>
            <button onClick={() => setNotifications(!notifications)} className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
              <Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </button>
            <div className="hidden h-8 w-px bg-slate-200 xl:block" />
            <button className="hidden items-center gap-3 xl:flex">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E8EEFF] text-sm font-extrabold text-primary">АС</span>
              <span className="text-left"><span className="block text-xs font-bold">Айгуль Садыкова</span><span className="mt-0.5 block text-[10px] text-slate-400">{role}</span></span>
            </button>
          </div>
          {searchOpen ? (
            <div className="absolute inset-x-4 top-[82px] flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-card sm:hidden">
              <Search size={17} className="text-slate-400" /><input autoFocus className="w-full text-sm outline-none" placeholder="Поиск по порталу…" />
            </div>
          ) : null}
          {notifications ? (
            <div className="absolute right-4 top-[68px] w-[310px] rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between"><p className="text-sm font-bold">Уведомления</p><button onClick={() => setNotifications(false)}><X size={16} className="text-slate-400" /></button></div>
              <div className="rounded-xl bg-blue-50 p-3 text-xs leading-5 text-slate-600"><b className="text-slate-800">Новый отчёт готов</b><br />Сводка по Face ID и доступу сформирована.</div>
              <div className="mt-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-slate-600"><b className="text-slate-800">Заявка на отсутствие</b><br />Преподаватель отправил запрос из мобильного приложения.</div>
            </div>
          ) : null}
        </header>
        <main className="px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <div className="mx-auto mb-5 flex max-w-[1600px] items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-2.5 text-[11px] text-blue-700">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="min-w-0">Вы просматриваете данные в роли <b>{role}</b></span>
            <span className="ml-auto hidden text-blue-400 sm:inline">Демонстрационный режим</span>
          </div>
          {pathname === "/dashboard" ? <DashboardTasks /> : null}
          {pathname === "/dashboard" && role === "Директор" ? <DirectorComplianceWidget /> : null}
          {children}
        </main>
      </div>
    </div>
  );
}

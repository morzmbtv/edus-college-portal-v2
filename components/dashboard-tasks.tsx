"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ArrowRight, Check, Clock3, Smartphone, Sparkles, TimerReset } from "lucide-react";
import { useRole } from "@/components/role-context";

const roleTask: Record<string, string> = {
  "Директор": "Согласовать приказ и проверить риск-группы",
  "Завуч": "Проверить академические задолженности",
  "Куратор": "Связаться с родителями студента",
  "Преподаватель": "Закрыть оценки по предмету",
  "Психолог": "Провести беседу со студентом",
  "Кадровик": "Проверить срок трудового договора",
  "Канцелярия": "Зарегистрировать входящее письмо",
};

export function DashboardTasks() {
  const { role } = useRole();
  const [aiCreated, setAiCreated] = useState(false);
  const [absenceDone, setAbsenceDone] = useState(false);

  function pulse(setter: (value: boolean) => void) {
    setter(true);
    window.setTimeout(() => setter(false), 2200);
  }

  return (
    <section className="mx-auto mb-5 grid max-w-[1600px] gap-4 xl:grid-cols-4">
      <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div><h2 className="text-xs font-extrabold">Мои задачи</h2><p className="mt-1 text-[9px] text-slate-400">Поручения для роли «{role}»</p></div>
          <Link href="/tasks" className="text-[9px] font-bold text-primary">Все задачи</Link>
        </div>
        <Link href="/tasks" className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 p-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-primary"><Clock3 size={13} /></span>
          <span className="min-w-0 flex-1 truncate text-[9px] font-bold text-slate-600">{roleTask[role] ?? "Проверить задачи"}</span>
          <ArrowRight size={12} className="text-slate-300" />
        </Link>
      </article>

      <article className="rounded-2xl border border-red-100 bg-white p-4 shadow-card">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 text-red-600"><AlertTriangle size={15} /></span>
          <div><h2 className="text-xs font-extrabold">Просроченные поручения</h2><p className="mt-0.5 text-[9px] text-slate-400">Требуют внимания</p></div>
          <b className="ml-auto text-lg text-red-600">1</b>
        </div>
        <Link href="/tasks" className="mt-3 block rounded-xl bg-red-50/60 p-2.5">
          <p className="truncate text-[9px] font-bold text-slate-700">Проверить академическую задолженность</p>
          <p className="mt-1 text-[8px] text-red-500">Срок: 20.06.2026</p>
        </Link>
      </article>

      <article className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4 shadow-card">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-100 text-cyan-700"><Smartphone size={15} /></span>
          <div><h2 className="text-xs font-extrabold">Заявки на отсутствие</h2><p className="mt-0.5 text-[9px] text-slate-400">Источник: мобильное приложение</p></div>
          <b className="ml-auto text-lg text-cyan-700">4</b>
        </div>
        <p className="mt-3 text-[10px] leading-4 text-slate-600">Преподаватель отпросился с 14:00 до 17:00, ещё 3 заявки ждут решения.</p>
        <Link href="/timesheet" onClick={() => pulse(setAbsenceDone)} className={`mt-3 flex h-8 items-center justify-center gap-2 rounded-lg px-3 text-[9px] font-bold text-white ${absenceDone ? "bg-emerald-600" : "bg-cyan-600"}`}>
          {absenceDone ? <><Check size={13} />Открыто</> : <>Рассмотреть заявки</>}
        </Link>
      </article>

      <article className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4 shadow-card">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-100 text-violet-700"><TimerReset size={15} /></span>
          <div><h2 className="text-xs font-extrabold">Отклонения по табелю</h2><p className="mt-0.5 text-[9px] text-slate-400">Face ID + заявки</p></div>
        </div>
        <p className="mt-3 text-[10px] leading-4 text-slate-600">42 опоздания, 11 ранних уходов, 5 расхождений между Face ID и заявками.</p>
        <button onClick={() => pulse(setAiCreated)} className={`mt-3 flex h-8 items-center gap-2 rounded-lg px-3 text-[9px] font-bold text-white ${aiCreated ? "bg-emerald-600" : "bg-violet-600"}`}>
          {aiCreated ? <><Check size={13} />Задача создана</> : <><Sparkles size={13} />Создать задачу</>}
        </button>
      </article>
    </section>
  );
}

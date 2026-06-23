"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowLeft,
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FilePlus2,
  FileText,
  GraduationCap,
  HeartPulse,
  History,
  Mail,
  MessageCircle,
  Pencil,
  ShieldAlert,
  Star,
  TimerReset,
  Upload,
  UserRound,
  X,
} from "lucide-react";

type PersonnelKind = "teacher" | "staff";
type TeacherTab =
  | "overview"
  | "personal"
  | "education"
  | "training"
  | "certificates"
  | "workload"
  | "disciplines"
  | "documents"
  | "kpi"
  | "attendance"
  | "tasks"
  | "communications"
  | "audit"
  | "archive";
type StaffTab = "overview" | "personal" | "documents" | "contract" | "instruction" | "attestations" | "medical" | "safety" | "tasks" | "audit" | "archive";

const teacher = {
  id: "TCH-2026-001",
  name: "Гульмира Касенова",
  iin: "760418402118",
  birthDate: "18.04.1976",
  age: "50 лет",
  phone: "+7 701 210 44 18",
  email: "g.kassenova@college.kz",
  address: "г. Алматы, ул. Толе би 89",
  position: "Преподаватель информатики",
  department: "Информационные технологии",
  experience: "18 лет",
  education: "КазНУ им. аль-Фараби, магистр информационных систем",
  category: "Педагог-исследователь",
  workload: "24 ч/нед",
  students: "126",
  rating: "4,8",
  documents: "31",
  training: "5 курсов",
  certificates: "8 сертификатов",
  status: "Активен",
  employment: "Основное место работы",
};

const employee = {
  id: "EMP-2026-001",
  name: "Елена Ким",
  iin: "850611402817",
  birthDate: "11.06.1985",
  age: "41 год",
  phone: "+7 707 540 22 19",
  email: "e.kim@college.kz",
  address: "г. Алматы, мкр. Самал-2, 41",
  position: "Заведующий канцелярией",
  department: "Канцелярия",
  experience: "11 лет",
  education: "Алматинский колледж делопроизводства",
  category: "Административный сотрудник",
  contract: "ТД-2024-118 · до 31.12.2026",
  documents: "28",
  status: "Активен",
  employment: "Полная занятость",
};

const teacherTabs: { key: TeacherTab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Общая информация", icon: Activity },
  { key: "personal", label: "Личные данные", icon: UserRound },
  { key: "education", label: "Образование", icon: GraduationCap },
  { key: "training", label: "Повышение квалификации", icon: BookOpenCheck },
  { key: "certificates", label: "Сертификаты", icon: Award },
  { key: "workload", label: "Нагрузка", icon: TimerReset },
  { key: "disciplines", label: "Дисциплины", icon: ClipboardCheck },
  { key: "documents", label: "Документы", icon: FileText },
  { key: "kpi", label: "KPI и показатели", icon: Star },
  { key: "attendance", label: "Рабочее время", icon: CalendarDays },
  { key: "tasks", label: "Задачи", icon: CheckCircle2 },
  { key: "communications", label: "Коммуникации", icon: MessageCircle },
  { key: "audit", label: "История действий", icon: History },
  { key: "archive", label: "Архив", icon: Archive },
];

const staffTabs: { key: StaffTab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Общая информация", icon: Activity },
  { key: "personal", label: "Личные данные", icon: UserRound },
  { key: "documents", label: "Кадровые документы", icon: FileText },
  { key: "contract", label: "Трудовой договор", icon: BriefcaseBusiness },
  { key: "instruction", label: "Должностная инструкция", icon: FileCheck2 },
  { key: "attestations", label: "Аттестации", icon: Award },
  { key: "medical", label: "Медосмотры", icon: HeartPulse },
  { key: "safety", label: "Обучение по ТБ", icon: ShieldAlert },
  { key: "tasks", label: "Задачи", icon: CheckCircle2 },
  { key: "audit", label: "История действий", icon: History },
  { key: "archive", label: "Архив", icon: Archive },
];

const teacherDocuments = [
  ["Удостоверение личности", "Личные документы", "DOC-2024-118", "18.08.2024", "Бессрочно", "Проверен"],
  ["Диплом магистра", "Образование", "DIP-2004-882", "22.06.2004", "Бессрочно", "Проверен"],
  ["Трудовой договор", "Кадровые", "ТД-2024-097", "01.09.2024", "31.08.2027", "Проверен"],
  ["Сертификат Cisco Instructor", "Сертификаты", "CISCO-2025-04", "12.07.2025", "12.07.2026", "Требует внимания"],
  ["Медицинский осмотр", "Медицинские", "MED-2026-019", "10.01.2026", "10.01.2027", "Проверен"],
  ["Справка о несудимости", "Кадровые", "E-GOV-2026-221", "04.02.2026", "04.08.2026", "Проверен"],
];

const staffDocuments = [
  ["Удостоверение личности", "Личные документы", "DOC-2024-211", "11.06.2024", "Бессрочно", "Проверен"],
  ["Трудовой договор", "Кадровые", "ТД-2024-118", "01.01.2024", "31.12.2026", "Проверен"],
  ["Должностная инструкция", "Кадровые", "DI-2024-044", "01.01.2024", "31.12.2026", "Проверен"],
  ["Медицинский осмотр", "Медицинские", "MED-2025-178", "05.07.2025", "05.07.2026", "Истекает"],
  ["Обучение по ТБ", "Охрана труда", "TB-2025-098", "20.09.2025", "20.09.2026", "Проверен"],
  ["Аттестационный лист", "Аттестации", "ATT-2026-015", "15.03.2026", "15.03.2029", "Проверен"],
];

const trainingRows = [
  ["15.03.2026", "Методика преподавания ИИ-инструментов", "72 часа", "НАО Talap", "Завершён"],
  ["12.07.2025", "Cisco Instructor Update", "40 часов", "Cisco Academy", "Сертификат истекает"],
  ["18.11.2024", "Критериальное оценивание", "36 часов", "Өрлеу", "Завершён"],
  ["21.05.2024", "Цифровая педагогика", "72 часа", "EDUS Academy", "Завершён"],
];

const certificateRows = [
  ["Cisco Instructor", "CISCO-2025-04", "12.07.2025", "12.07.2026", "Истекает через 18 дней"],
  ["Python Advanced", "PY-2025-091", "18.09.2025", "18.09.2027", "Действует"],
  ["Методист WorldSkills", "WSK-2024-144", "02.05.2024", "02.05.2027", "Действует"],
];

const workloadRows = [
  ["ИС-23-1", "Базы данных", "6 ч/нед", "28 студентов", "Практика + лекции"],
  ["ИС-23-2", "Программирование", "8 ч/нед", "26 студентов", "Лабораторные"],
  ["ИС-24-1", "Информатика", "6 ч/нед", "31 студент", "Лекции"],
  ["ИС-22-1", "Курсовое проектирование", "4 ч/нед", "18 студентов", "Руководство"],
];

const kpiTrend = [
  { month: "Янв", kpi: 86, rating: 4.6 },
  { month: "Фев", kpi: 88, rating: 4.7 },
  { month: "Мар", kpi: 91, rating: 4.8 },
  { month: "Апр", kpi: 89, rating: 4.7 },
  { month: "Май", kpi: 93, rating: 4.8 },
  { month: "Июн", kpi: 92, rating: 4.8 },
];

const attendanceRows = [
  ["22.06.2026", "08:02", "Главный вход", "17:16", "Главный вход", "8 ч 54 мин", "Норма"],
  ["21.06.2026", "07:58", "Корпус А", "16:45", "Корпус А", "8 ч 47 мин", "Норма"],
  ["20.06.2026", "08:19", "Главный вход", "17:05", "Библиотека", "8 ч 46 мин", "Опоздание"],
  ["19.06.2026", "08:04", "Корпус А", "16:50", "Корпус А", "8 ч 46 мин", "Норма"],
];

const taskRows = [
  ["ЗД-2026-0131", "Закрыть итоговые оценки", "Высокий", "В работе", "25.06.2026"],
  ["ЗД-2026-0155", "Обновить сертификат Cisco", "Критический", "Новая", "10.07.2026"],
  ["ЗД-2026-0162", "Подготовить отчёт по группе ИС-23-1", "Средний", "Ожидает проверки", "28.06.2026"],
];

const staffTaskRows = [
  ["ЗД-2026-0171", "Проверить журнал регистрации входящих", "Высокий", "В работе", "24.06.2026"],
  ["ЗД-2026-0180", "Обновить медосмотр", "Критический", "Новая", "05.07.2026"],
  ["ЗД-2026-0184", "Подготовить архив приказов", "Средний", "Новая", "30.06.2026"],
];

const communications = [
  ["20.06.2026", "Завуч", "Портал", "Нагрузка на следующий семестр", "Ответ отправлен"],
  ["18.06.2026", "Куратор ИС-23-1", "Личная встреча", "Студент группы риска", "Исполнено"],
  ["12.06.2026", "HR", "Email", "Сроки сертификатов", "На контроле"],
];

const staffCommunications = [
  ["22.06.2026", "Директор", "Портал", "Регистрация письма Управления образования", "Исполнено"],
  ["19.06.2026", "Кадровик", "Email", "Медосмотр и личное дело", "На контроле"],
  ["12.06.2026", "Завуч", "Телефон", "Передача приказа в архив", "Исполнено"],
];

const audit = [
  ["Айгуль Садыкова", "Обновила статус досье", "22.06.2026, 09:20", "Кадры", "Проверка комплектности"],
  ["Мадина Сейтова", "Добавила документ", "19.06.2026, 12:41", "Документы", "Сертификат / медосмотр"],
  ["EDUS", "Создал предупреждение", "18.06.2026, 08:00", "Контроль сроков", "Истекающий документ"],
];

function clsx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-sm font-extrabold ring-1", className)}>{children}</span>;
}

function StatCard({ label, value, tone = "blue" }: { label: string; value: string; tone?: "blue" | "orange" | "emerald" | "red" | "slate" }) {
  const tones = {
    blue: "from-blue-50 to-white text-blue-700",
    orange: "from-orange-50 to-white text-orange-700",
    emerald: "from-emerald-50 to-white text-emerald-700",
    red: "from-red-50 to-white text-red-700",
    slate: "from-slate-50 to-white text-slate-700",
  };
  return (
    <article className={clsx("rounded-3xl border border-slate-100 bg-gradient-to-br p-5 shadow-card", tones[tone])}>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
    </article>
  );
}

function InfoGrid({ rows }: { rows: [string, string][] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-1.5 text-base font-extrabold text-slate-950">{value}</p>
        </div>
      ))}
    </div>
  );
}

function SimpleTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[940px]">
        <thead>
          <tr className="bg-slate-50/90">
            {columns.map((column) => (
              <th key={column} className="px-5 py-4 text-left text-sm font-extrabold uppercase tracking-wide text-slate-500">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`} className="border-t border-slate-100 hover:bg-blue-50/25">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="px-5 py-4 text-sm leading-6 text-slate-600">
                  {cellIndex === 0 ? <b className="text-slate-950">{cell}</b> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DemoModal({ title, onClose, onSave }: { title: string; onClose: () => void; onSave: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="w-full max-w-2xl rounded-[2rem] bg-white p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-base text-slate-500">Демо-действие: данные сохраняются только локально.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500">
            <X size={20} />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {["Название", "Ответственный", "Срок", "Комментарий"].map((field) => (
            <label key={field} className={clsx("text-sm font-extrabold text-slate-600", field === "Комментарий" ? "sm:col-span-2" : "")}>
              {field}
              {field === "Комментарий" ? (
                <textarea className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-blue-300" />
              ) : (
                <input className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-base outline-none focus:border-blue-300" />
              )}
            </label>
          ))}
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="h-12 rounded-2xl border border-slate-200 px-5 text-base font-extrabold text-slate-600">
            Отмена
          </button>
          <button className="h-12 rounded-2xl bg-primary px-6 text-base font-extrabold text-white">Сохранить</button>
        </div>
      </form>
    </div>
  );
}

export function PersonnelDossier({ kind }: { kind: PersonnelKind }) {
  const params = useParams<{ id?: string }>();
  const isStaff = kind === "staff";
  const person = isStaff ? employee : teacher;
  const [teacherTab, setTeacherTab] = useState<TeacherTab>("overview");
  const [staffTab, setStaffTab] = useState<StaffTab>("overview");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState("");
  const active = isStaff ? staffTab : teacherTab;
  const tabs = isStaff ? staffTabs : teacherTabs;
  const documents = isStaff ? staffDocuments : teacherDocuments;

  const warnings = useMemo(
    () =>
      isStaff
        ? ["Истекает медосмотр через 12 дней", "Истекает договор через 6 месяцев", "Требуется повторное обучение по ТБ"]
        : ["Истекает сертификат Cisco через 18 дней", "Требуется повышение квалификации по AI-инструментам", "Проверить нагрузку на следующий семестр"],
    [isStaff],
  );

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function saveModal() {
    const text = modal || "Изменение";
    setModal("");
    notify(`${text}: сохранено в демо-режиме`);
  }

  return (
    <div className="mx-auto max-w-[1700px] overflow-x-hidden animate-rise">
      <div className="mb-6">
        <Link href={isStaff ? "/staff" : "/teachers"} className="inline-flex items-center gap-2 text-base font-extrabold text-slate-500 transition hover:text-primary">
          <ArrowLeft size={18} />
          {isStaff ? "Назад к списку сотрудников" : "Назад к списку преподавателей"}
        </Link>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-card">
        <div className={clsx("relative p-6 text-white sm:p-8", isStaff ? "bg-gradient-to-br from-slate-800 via-slate-700 to-blue-600" : "bg-gradient-to-br from-blue-600 via-indigo-500 to-sky-400")}>
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid h-28 w-28 shrink-0 place-items-center rounded-[2rem] border border-white/30 bg-white/20 text-4xl font-black shadow-xl backdrop-blur">
                {initials(person.name)}
              </div>
              <div>
                <p className="text-base font-bold text-blue-100">{isStaff ? "Цифровое досье сотрудника" : "Цифровое досье преподавателя"} · {params?.id ?? person.id}</p>
                <h1 className="mt-2 text-4xl font-black tracking-tight text-white drop-shadow-sm sm:text-5xl">{person.name}</h1>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge className="bg-white/20 text-white ring-white/30">{person.position}</Badge>
                  <Badge className="bg-white/20 text-white ring-white/30">{person.department}</Badge>
                  <Badge className="bg-emerald-400/20 text-white ring-emerald-100/40">{person.status}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:min-w-[460px]">
              {isStaff
                ? [
                    ["Стаж", person.experience],
                    ["Документы", person.documents],
                    ["Договор", "2026"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
                      <p className="text-sm font-bold text-blue-100">{label}</p>
                      <p className="mt-2 text-2xl font-black">{value}</p>
                    </div>
                  ))
                : [
                    ["Нагрузка", teacher.workload],
                    ["Студенты", teacher.students],
                    ["Рейтинг", teacher.rating],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
                      <p className="text-sm font-bold text-blue-100">{label}</p>
                      <p className="mt-2 text-2xl font-black">{value}</p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-5">
          {([
            ["Редактировать", Pencil],
            ["Добавить документ", FilePlus2],
            ["Назначить задачу", CheckCircle2],
            ["Написать сообщение", Mail],
            ["Загрузить файл", Upload],
            ["В архив", Archive],
          ] as const).map(([label, Icon]) => (
            <button key={String(label)} onClick={() => setModal(String(label))} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-blue-50 px-4 text-base font-extrabold text-primary hover:bg-blue-100">
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-7 grid gap-7 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
          <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-blue-100 to-sky-50 text-2xl font-black text-primary">{initials(person.name)}</div>
              <div>
                <h2 className="text-xl font-black text-slate-950">{person.name}</h2>
                <p className="mt-1 text-base font-bold text-slate-500">ИИН {person.iin}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {(isStaff
                ? [
                    ["Должность", person.position],
                    ["Отдел", person.department],
                    ["Стаж", person.experience],
                    ["Документы", person.documents],
                    ["Договор", "до 2026"],
                    ["Статус", person.status],
                  ]
                : [
                    ["Должность", person.position],
                    ["Отделение", person.department],
                    ["Стаж", person.experience],
                    ["Категория", teacher.category],
                    ["Нагрузка", teacher.workload],
                    ["Рейтинг", teacher.rating],
                    ["Студенты", teacher.students],
                    ["Документы", teacher.documents],
                  ]
              ).map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">{label}</p>
                  <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-amber-100 bg-amber-50 p-6 shadow-card">
            <h2 className="flex items-center gap-3 text-xl font-black text-amber-900">
              <AlertTriangle size={22} />
              Предупреждения
            </h2>
            <div className="mt-4 space-y-3">
              {warnings.map((warning) => (
                <button key={warning} onClick={() => notify(warning)} className="w-full rounded-2xl bg-white p-4 text-left text-base font-extrabold text-amber-800 shadow-sm">
                  {warning}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <main className="min-w-0">
          <nav className="overflow-x-auto rounded-[2rem] border border-slate-100 bg-white p-3 shadow-card">
            <div className="flex min-w-max gap-2">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => (isStaff ? setStaffTab(key as StaffTab) : setTeacherTab(key as TeacherTab))}
                  className={clsx(
                    "inline-flex h-12 items-center gap-2 rounded-2xl px-4 text-base font-extrabold transition",
                    active === key ? "bg-primary text-white shadow-lg shadow-blue-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </nav>

          <div className="mt-7">
            {active === "overview" ? (
              <div className="space-y-7">
                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {isStaff ? (
                    <>
                      <StatCard label="Кадровые документы" value={employee.documents} />
                      <StatCard label="Договор действует" value="2026" tone="emerald" />
                      <StatCard label="Медосмотр" value="12 дн" tone="orange" />
                      <StatCard label="Задачи" value="3" tone="red" />
                    </>
                  ) : (
                    <>
                      <StatCard label="Нагрузка" value={teacher.workload} />
                      <StatCard label="Студенты" value={teacher.students} tone="emerald" />
                      <StatCard label="Рейтинг" value={teacher.rating} tone="orange" />
                      <StatCard label="Документы" value={teacher.documents} tone="slate" />
                    </>
                  )}
                </section>
                <section className="grid gap-7 xl:grid-cols-[1.1fr_.9fr]">
                  <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                    <h2 className="text-2xl font-black text-slate-950">Профиль</h2>
                    <p className="mt-2 text-base leading-7 text-slate-500">
                      {isStaff
                        ? "Единое кадровое дело сотрудника: договор, инструкция, медосмотры, аттестации, обучение по ТБ, задачи и история изменений."
                        : "Единое цифровое досье преподавателя: квалификация, нагрузка, дисциплины, документы, KPI, рабочее время и коммуникации."}
                    </p>
                    <div className="mt-6">
                      <InfoGrid
                        rows={[
                          ["Должность", person.position],
                          [isStaff ? "Отдел" : "Отделение", person.department],
                          ["Стаж", person.experience],
                          ["Образование", person.education],
                          ["Категория", person.category],
                          ["Занятость", person.employment],
                        ]}
                      />
                    </div>
                  </article>
                  <article className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-card">
                    <h2 className="text-2xl font-black text-slate-950">Контроль сроков</h2>
                    <div className="mt-5 space-y-3">
                      {warnings.map((warning) => (
                        <div key={warning} className="flex items-center gap-3 rounded-2xl bg-white p-4 text-base font-extrabold text-slate-700">
                          <AlertTriangle size={18} className="text-orange-600" />
                          {warning}
                        </div>
                      ))}
                    </div>
                  </article>
                </section>
              </div>
            ) : null}

            {active === "personal" ? (
              <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                <h2 className="text-2xl font-black text-slate-950">Личные данные</h2>
                <div className="mt-6">
                  <InfoGrid
                    rows={[
                      ["ФИО", person.name],
                      ["ИИН", person.iin],
                      ["Дата рождения", person.birthDate],
                      ["Возраст", person.age],
                      ["Телефон", person.phone],
                      ["Email", person.email],
                      ["Адрес", person.address],
                      ["Должность", person.position],
                      [isStaff ? "Отдел" : "Отделение", person.department],
                      ["Статус", person.status],
                    ]}
                  />
                </div>
              </section>
            ) : null}

            {active === "education" ? (
              <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                <h2 className="text-2xl font-black text-slate-950">Образование</h2>
                <SimpleTable columns={["Год", "Организация", "Специальность", "Степень", "Документ"]} rows={[["1998–2004", "КазНУ им. аль-Фараби", "Информационные системы", "Магистр", "Диплом проверен"], ["2021", "EDUS Academy", "Цифровая педагогика", "Курс", "Сертификат"], ["2025", "Cisco Academy", "Сетевые технологии", "Instructor", "Сертификат"]]} />
              </section>
            ) : null}

            {active === "training" ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                <SimpleTable columns={["Дата", "Курс", "Объем", "Организация", "Статус"]} rows={trainingRows} />
              </article>
            ) : null}

            {active === "certificates" ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                <SimpleTable columns={["Сертификат", "Номер", "Дата выдачи", "Срок действия", "Статус"]} rows={certificateRows} />
              </article>
            ) : null}

            {active === "workload" || active === "disciplines" ? (
              <div className="space-y-6">
                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="Всего часов" value="24" />
                  <StatCard label="Группы" value="4" tone="emerald" />
                  <StatCard label="Студенты" value="126" tone="orange" />
                  <StatCard label="Перегрузка" value="Нет" tone="slate" />
                </section>
                <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                  <SimpleTable columns={["Группа", "Дисциплина", "Нагрузка", "Студенты", "Формат"]} rows={workloadRows} />
                </article>
              </div>
            ) : null}

            {active === "documents" ? (
              <div className="space-y-6">
                <section className="grid gap-4 xl:grid-cols-3">
                  {warnings.map((warning) => (
                    <div key={warning} className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-base font-extrabold text-amber-800">
                      <AlertTriangle size={20} />
                      {warning}
                    </div>
                  ))}
                </section>
                <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                  <SimpleTable columns={["Название", "Категория", "Номер", "Дата выдачи", "Срок действия", "Статус"]} rows={documents} />
                </article>
              </div>
            ) : null}

            {active === "kpi" ? (
              <div className="grid gap-6 xl:grid-cols-[1fr_430px]">
                <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                  <h2 className="text-2xl font-black text-slate-950">KPI и показатели</h2>
                  <div className="mt-5 h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={kpiTrend}>
                        <CartesianGrid vertical={false} stroke="#EEF2F7" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13 }} />
                        <Tooltip />
                        <Line dataKey="kpi" name="KPI" stroke="#2563EB" strokeWidth={3} />
                        <Line dataKey="rating" name="Рейтинг" stroke="#F97316" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </article>
                <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                  <h2 className="text-2xl font-black text-slate-950">Показатели</h2>
                  <div className="mt-5 space-y-4">
                    {["Успеваемость групп: 87%", "Закрытие журнала: 96%", "Методическая активность: высокая", "Отзывы студентов: 4,8/5"].map((item) => (
                      <div key={item} className="rounded-2xl bg-slate-50 p-4 text-base font-extrabold text-slate-700">{item}</div>
                    ))}
                  </div>
                </article>
              </div>
            ) : null}

            {active === "attendance" ? (
              <div className="space-y-6">
                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="Сегодня" value="Норма" tone="emerald" />
                  <StatCard label="За неделю" value="42 ч" />
                  <StatCard label="Опоздания" value="1" tone="orange" />
                  <StatCard label="Средний вход" value="08:06" tone="slate" />
                </section>
                <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                  <SimpleTable columns={["Дата", "Вход", "Терминал входа", "Выход", "Терминал выхода", "Длительность", "Статус"]} rows={attendanceRows} />
                </article>
              </div>
            ) : null}

            {active === "tasks" ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                <SimpleTable columns={["№", "Задача", "Приоритет", "Статус", "Срок"]} rows={isStaff ? staffTaskRows : taskRows} />
              </article>
            ) : null}

            {active === "communications" ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                <SimpleTable columns={["Дата", "Инициатор", "Канал", "Тема", "Статус"]} rows={isStaff ? staffCommunications : communications} />
              </article>
            ) : null}

            {active === "contract" ? (
              <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                <h2 className="text-2xl font-black text-slate-950">Трудовой договор</h2>
                <div className="mt-6">
                  <InfoGrid rows={[["Номер", "ТД-2024-118"], ["Дата начала", "01.01.2024"], ["Срок действия", "31.12.2026"], ["Тип", "Срочный"], ["Ставка", "1,0"], ["Статус", "Действует"]]} />
                </div>
              </section>
            ) : null}

            {active === "instruction" ? (
              <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                <h2 className="text-2xl font-black text-slate-950">Должностная инструкция</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">Ответственность за регистрацию входящих/исходящих документов, контроль исполнения поручений, архивирование приказов и ведение журнала канцелярии.</p>
                <div className="mt-6">
                  <SimpleTable columns={["Раздел", "Описание", "Статус"]} rows={[["Обязанности", "Регистрация, контроль, архив", "Подписано"], ["Ответственность", "Сроки и корректность реестров", "Подписано"], ["Права доступа", "Документооборот, архив, задачи", "Активно"]]} />
                </div>
              </section>
            ) : null}

            {active === "attestations" ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                <SimpleTable columns={["Дата", "Тип", "Результат", "Следующая дата", "Ответственный"]} rows={[["15.03.2026", "Плановая аттестация", "Соответствует", "15.03.2029", "HR"], ["10.02.2025", "Оценка компетенций", "92%", "10.02.2027", "Директор"]]} />
              </article>
            ) : null}

            {active === "medical" ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                <SimpleTable columns={["Документ", "Дата", "Срок действия", "Статус", "Комментарий"]} rows={[["Медицинский осмотр", "05.07.2025", "05.07.2026", "Истекает", "Нужно обновить"], ["Санитарная книжка", "05.07.2025", "05.07.2026", "Истекает", "На контроле"]]} />
              </article>
            ) : null}

            {active === "safety" ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                <SimpleTable columns={["Курс", "Дата", "Срок действия", "Результат", "Статус"]} rows={[["Вводный инструктаж", "20.09.2025", "20.09.2026", "Зачёт", "Действует"], ["Пожарная безопасность", "18.10.2025", "18.10.2026", "Зачёт", "Действует"], ["Охрана труда", "12.01.2024", "12.01.2026", "Зачёт", "Требуется обновление"]]} />
              </article>
            ) : null}

            {active === "audit" ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                <SimpleTable columns={["Кто изменил", "Что изменил", "Дата и время", "Модуль", "Комментарий"]} rows={audit} />
              </article>
            ) : null}

            {active === "archive" ? (
              <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
                <article className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-card">
                  <h2 className="text-2xl font-black text-slate-950">Архив досье</h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    Статус: <b>{person.status}</b>. После увольнения или завершения срока хранения кадровые документы передаются в электронный архив колледжа.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                      ["Архивные документы", "14"],
                      ["Срок хранения", "75 лет"],
                      ["Последняя выгрузка", "22.06.2026"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-slate-50 p-5">
                        <p className="text-sm font-bold text-slate-500">{label}</p>
                        <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
                      </div>
                    ))}
                  </div>
                </article>
                <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                  <Archive size={28} className="text-slate-400" />
                  <h2 className="mt-5 text-2xl font-black text-slate-950">Архивные действия</h2>
                  <button onClick={() => notify("Архивная копия подготовлена")} className="mt-5 h-12 w-full rounded-2xl bg-slate-900 text-base font-extrabold text-white">
                    Сформировать архивную копию
                  </button>
                </article>
              </section>
            ) : null}
          </div>
        </main>
      </div>

      {modal ? <DemoModal title={modal} onClose={() => setModal("")} onSave={saveModal} /> : null}
      {toast ? (
        <div className="fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-base font-extrabold text-white shadow-2xl">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500">
            <Check size={18} />
          </span>
          {toast}
        </div>
      ) : null}
    </div>
  );
}

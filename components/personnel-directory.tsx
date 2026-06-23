"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Check,
  ClipboardList,
  Download,
  FileText,
  Filter,
  GraduationCap,
  Plus,
  Search,
  Star,
  UsersRound,
  X,
} from "lucide-react";

type DirectoryKind = "teachers" | "staff";

const teachers = [
  {
    id: "TCH-2026-001",
    name: "Гульмира Касенова",
    iin: "760418402118",
    position: "Преподаватель информатики",
    department: "Информационные технологии",
    experience: "18 лет",
    education: "КазНУ, магистр ИТ",
    category: "Педагог-исследователь",
    workload: "24 ч/нед",
    students: "126",
    rating: "4,8",
    documents: "31",
    status: "Активен",
    warning: "Сертификат Cisco истекает через 18 дней",
  },
  {
    id: "TCH-2026-002",
    name: "Аслан Беков",
    iin: "830917301984",
    position: "Преподаватель электротехники",
    department: "Энергетика",
    experience: "12 лет",
    education: "Satbayev University",
    category: "Педагог-эксперт",
    workload: "20 ч/нед",
    students: "84",
    rating: "4,5",
    documents: "27",
    status: "Активен",
    warning: "Требуется повышение квалификации",
  },
  {
    id: "TCH-2026-003",
    name: "Марина Соколова",
    iin: "790203402155",
    position: "Преподаватель бухучёта",
    department: "Экономика и учет",
    experience: "9 лет",
    education: "Нархоз, бакалавр",
    category: "Педагог-модератор",
    workload: "22 ч/нед",
    students: "98",
    rating: "4,6",
    documents: "24",
    status: "Активен",
    warning: "Медосмотр истекает через 24 дня",
  },
  {
    id: "TCH-2026-004",
    name: "Ерлан Нургалиев",
    iin: "740812301933",
    position: "Преподаватель физкультуры",
    department: "Воспитательный отдел",
    experience: "15 лет",
    education: "КазАСТ",
    category: "Педагог-эксперт",
    workload: "18 ч/нед",
    students: "210",
    rating: "4,7",
    documents: "22",
    status: "Активен",
    warning: "Документы в порядке",
  },
];

const staff = [
  {
    id: "EMP-2026-001",
    name: "Елена Ким",
    iin: "850611402817",
    position: "Заведующий канцелярией",
    department: "Канцелярия",
    experience: "11 лет",
    education: "Колледж делопроизводства",
    category: "Сотрудник",
    contract: "до 31.12.2026",
    documents: "28",
    status: "Активен",
    warning: "Истекает медосмотр через 12 дней",
  },
  {
    id: "EMP-2026-002",
    name: "Данияр Оспанов",
    iin: "880305301477",
    position: "IT-специалист",
    department: "IT/цифровизация",
    experience: "7 лет",
    education: "AITU",
    category: "Сотрудник",
    contract: "до 30.09.2026",
    documents: "25",
    status: "Активен",
    warning: "Истекает договор через 45 дней",
  },
  {
    id: "EMP-2026-003",
    name: "Мадина Сейтова",
    iin: "900221402114",
    position: "HR-менеджер",
    department: "Отдел кадров",
    experience: "8 лет",
    education: "КазНУ, управление персоналом",
    category: "Сотрудник",
    contract: "бессрочный",
    documents: "33",
    status: "Активен",
    warning: "Требуется обучение по ТБ",
  },
  {
    id: "EMP-2026-004",
    name: "Руслан Алиев",
    iin: "821119301721",
    position: "Инженер по охране труда",
    department: "Охрана труда",
    experience: "14 лет",
    education: "КазАТК",
    category: "Сотрудник",
    contract: "до 15.02.2027",
    documents: "29",
    status: "Активен",
    warning: "Аттестация через 30 дней",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-primary">
          <Icon size={22} />
        </span>
        <p className="text-3xl font-black text-slate-950">{value}</p>
      </div>
      <p className="mt-4 text-base font-bold text-slate-500">{label}</p>
    </article>
  );
}

export function PersonnelDirectory({ kind }: { kind: DirectoryKind }) {
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(false);
  const isStaff = kind === "staff";
  const items = isStaff ? staff : teachers;

  const visible = useMemo(
    () => items.filter((item) => Object.values(item).join(" ").toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  return (
    <div className="mx-auto max-w-[1600px] overflow-x-hidden animate-rise">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">{isStaff ? "Сотрудники" : "Преподаватели"}</h1>
          <p className="mt-2 max-w-3xl text-base leading-7 text-slate-500">
            {isStaff
              ? "Цифровые кадровые дела сотрудников: договоры, медосмотры, аттестации, обучение по ТБ и контроль сроков."
              : "Цифровые досье преподавателей: квалификация, нагрузка, дисциплины, KPI, документы и контроль сертификатов."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={isStaff ? "/teachers" : "/staff"}
            className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-base font-extrabold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            {isStaff ? <GraduationCap size={18} /> : <BriefcaseBusiness size={18} />}
            {isStaff ? "Открыть преподавателей" : "Открыть сотрудников"}
          </Link>
          <button onClick={() => setModal(true)} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-5 text-base font-extrabold text-white shadow-lg shadow-blue-100">
            <Plus size={18} />
            {isStaff ? "Добавить сотрудника" : "Добавить преподавателя"}
          </button>
        </div>
      </div>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={isStaff ? "Всего сотрудников" : "Всего преподавателей"} value={isStaff ? "48" : "72"} icon={UsersRound} />
        <StatCard label="Активные досье" value={isStaff ? "46" : "70"} icon={FileText} />
        <StatCard label="Предупреждения" value={isStaff ? "9" : "12"} icon={AlertTriangle} />
        <StatCard label={isStaff ? "Аттестации в срок" : "Средний рейтинг"} value={isStaff ? "88%" : "4,7"} icon={Star} />
      </section>

      <section className="mt-7 grid gap-4 xl:grid-cols-4">
        {(isStaff
          ? ["Истекает медосмотр: Елена Ким", "Истекает договор: Данияр Оспанов", "Требуется обучение по ТБ: Мадина Сейтова", "Аттестация через 30 дней: Руслан Алиев"]
          : ["Истекает сертификат: Гульмира Касенова", "Требуется повышение квалификации: Аслан Беков", "Медосмотр истекает: Марина Соколова", "Контроль нагрузки: 3 преподавателя"]
        ).map((warning) => (
          <button
            key={warning}
            onClick={() => notify(warning)}
            className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-left text-base font-extrabold text-amber-800"
          >
            <AlertTriangle size={20} />
            {warning}
          </button>
        ))}
      </section>

      <section className="mt-7 overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
          <label className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 xl:max-w-md">
            <Search size={18} className="text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 text-base outline-none"
              placeholder={isStaff ? "Поиск сотрудника, ИИН, отдела…" : "Поиск преподавателя, дисциплины, отделения…"}
            />
          </label>
          <div className="flex gap-2">
            <button onClick={() => notify("Фильтры открыты в демо-режиме")} className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 text-slate-500">
              <Filter size={18} />
            </button>
            <button onClick={() => notify("Экспорт подготовлен")} className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 text-slate-500">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead>
              <tr className="bg-slate-50/90">
                {(isStaff
                  ? ["Сотрудник", "ИИН", "Должность", "Отдел", "Стаж", "Договор", "Документы", "Статус", "Действия"]
                  : ["Преподаватель", "ИИН", "Должность", "Отделение", "Стаж", "Категория", "Нагрузка", "Студенты", "Рейтинг", "Действия"]
                ).map((column) => (
                  <th key={column} className="px-5 py-4 text-left text-sm font-extrabold uppercase tracking-wide text-slate-500">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 hover:bg-blue-50/25">
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-base font-black text-primary">{initials(item.name)}</span>
                      <span>
                        <b className="block text-base text-slate-950">{item.name}</b>
                        <small className="mt-1 block text-sm font-bold text-slate-500">{item.id}</small>
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-sm font-bold text-slate-600">{item.iin}</td>
                  <td className="px-5 py-5 text-sm font-bold text-slate-800">{item.position}</td>
                  <td className="px-5 py-5 text-sm text-slate-600">{item.department}</td>
                  <td className="px-5 py-5 text-sm text-slate-600">{item.experience}</td>
                  {isStaff ? (
                    <>
                      <td className="px-5 py-5 text-sm font-bold text-slate-700">{"contract" in item ? item.contract : "—"}</td>
                      <td className="px-5 py-5 text-sm font-black text-slate-950">{item.documents}</td>
                      <td className="px-5 py-5">
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-extrabold text-emerald-700">{item.status}</span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-5 text-sm text-slate-600">{"category" in item ? item.category : "—"}</td>
                      <td className="px-5 py-5 text-sm font-black text-slate-950">{"workload" in item ? item.workload : "—"}</td>
                      <td className="px-5 py-5 text-sm font-black text-slate-950">{"students" in item ? item.students : "—"}</td>
                      <td className="px-5 py-5 text-sm font-black text-amber-600">{"rating" in item ? item.rating : "—"}</td>
                    </>
                  )}
                  <td className="px-5 py-5">
                    <Link
                      href={isStaff ? `/staff/${item.id}` : `/teachers/${item.id}`}
                      className="inline-flex h-11 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-extrabold text-white"
                    >
                      <ClipboardList size={16} />
                      Открыть досье
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modal ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setModal(false);
              notify(isStaff ? "Сотрудник добавлен в демо-реестр" : "Преподаватель добавлен в демо-реестр");
            }}
            className="w-full max-w-2xl rounded-[2rem] bg-white p-7 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">{isStaff ? "Добавить сотрудника" : "Добавить преподавателя"}</h2>
                <p className="mt-2 text-base text-slate-500">Демо-форма без backend: изменения показываются только визуально.</p>
              </div>
              <button type="button" onClick={() => setModal(false)} className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                <X size={20} />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {["ФИО", "ИИН", "Должность", isStaff ? "Отдел" : "Отделение", "Стаж", "Комментарий"].map((field) => (
                <label key={field} className="text-sm font-extrabold text-slate-600">
                  {field}
                  <input className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-base outline-none focus:border-blue-300" />
                </label>
              ))}
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button type="button" onClick={() => setModal(false)} className="h-12 rounded-2xl border border-slate-200 px-5 text-base font-extrabold text-slate-600">
                Отмена
              </button>
              <button className="h-12 rounded-2xl bg-primary px-6 text-base font-extrabold text-white">Сохранить</button>
            </div>
          </form>
        </div>
      ) : null}

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

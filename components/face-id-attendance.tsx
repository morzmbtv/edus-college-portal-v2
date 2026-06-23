"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  BadgeCheck,
  Camera,
  Check,
  Clock3,
  DoorOpen,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  MonitorSmartphone,
  Paperclip,
  Plus,
  Radio,
  Search,
  UserRoundPlus,
  Users,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";

type Category = "Студент" | "Преподаватель" | "Сотрудник" | "Администрация" | "Гость" | "Подрядчик" | "Родитель" | "Госорган";
type AccessStatus = "На территории" | "Вышел" | "Опоздал" | "Отсутствует" | "Ушёл раньше" | "Гость активен";
type Source = "Face ID" | "QR" | "Ручная регистрация" | "Охрана";

type AccessEvent = {
  id: string;
  personId?: string;
  name: string;
  category: Category;
  groupOrDepartment: string;
  position?: string;
  entryTime: string;
  entryTerminal: string;
  exitTime: string;
  exitTerminal: string;
  zone: string;
  status: AccessStatus;
  source: Source;
};

const tabs = ["Обзор", "Live-лента", "Студенты", "Преподаватели", "Сотрудники", "Гости", "Терминалы", "Корректировки", "Отчёты"];
const zones = ["учебный корпус", "общежитие", "столовая", "библиотека", "серверная", "администрация", "склад", "спортзал"];

const accessEvents: AccessEvent[] = [
  { id: "EV-001", personId: "ST-2024-0188", name: "Алимжан Нурланов", category: "Студент", groupOrDepartment: "ИС-23-1", entryTime: "08:17", entryTerminal: "Главный вход", exitTime: "16:42", exitTerminal: "Главный вход", zone: "учебный корпус", status: "Опоздал", source: "Face ID" },
  { id: "EV-002", personId: "TCH-2026-001", name: "Гульмира Касенова", category: "Преподаватель", groupOrDepartment: "Отделение ИТ", position: "Преподаватель спецдисциплин", entryTime: "07:48", entryTerminal: "Учительская", exitTime: "17:12", exitTerminal: "Главный вход", zone: "учебный корпус", status: "На территории", source: "Face ID" },
  { id: "EV-003", personId: "EMP-2026-001", name: "Елена Ким", category: "Сотрудник", groupOrDepartment: "Канцелярия", position: "Заведующая канцелярией", entryTime: "08:02", entryTerminal: "Административный блок", exitTime: "18:05", exitTerminal: "Административный блок", zone: "администрация", status: "На территории", source: "Face ID" },
  { id: "EV-004", name: "Айгуль Садыкова", category: "Администрация", groupOrDepartment: "Руководство", position: "Директор", entryTime: "07:35", entryTerminal: "Административный блок", exitTime: "—", exitTerminal: "—", zone: "администрация", status: "На территории", source: "Face ID" },
  { id: "EV-005", name: "Мурат Абдиев", category: "Гость", groupOrDepartment: "ТОО «SafeBuild»", position: "Инженер подрядчика", entryTime: "10:15", entryTerminal: "Главный вход", exitTime: "—", exitTerminal: "—", zone: "склад", status: "Гость активен", source: "QR" },
  { id: "EV-006", name: "Сергей Волков", category: "Подрядчик", groupOrDepartment: "Vision Systems", position: "Техник Face ID", entryTime: "09:05", entryTerminal: "Корпус Б", exitTime: "12:30", exitTerminal: "Корпус Б", zone: "серверная", status: "Вышел", source: "QR" },
  { id: "EV-007", name: "Мадина Омарова", category: "Родитель", groupOrDepartment: "Родитель ИС-23-1", entryTime: "11:20", entryTerminal: "Главный вход", exitTime: "—", exitTerminal: "—", zone: "администрация", status: "Гость активен", source: "Охрана" },
  { id: "EV-008", name: "Руслан Тажибаев", category: "Госорган", groupOrDepartment: "Управление образования", position: "Главный специалист", entryTime: "09:40", entryTerminal: "Административный блок", exitTime: "12:10", exitTerminal: "Административный блок", zone: "администрация", status: "Вышел", source: "Охрана" },
  { id: "EV-009", personId: "TCH-2026-001", name: "Аслан Беков", category: "Преподаватель", groupOrDepartment: "Энергетика", position: "Мастер производственного обучения", entryTime: "08:21", entryTerminal: "Корпус А", exitTime: "15:00", exitTerminal: "Корпус А", zone: "спортзал", status: "Ушёл раньше", source: "Face ID" },
  { id: "EV-010", personId: "EMP-2026-001", name: "Нурлан Ахметов", category: "Сотрудник", groupOrDepartment: "IT/цифровизация", position: "Системный администратор", entryTime: "08:00", entryTerminal: "Корпус Б", exitTime: "—", exitTerminal: "—", zone: "серверная", status: "На территории", source: "Face ID" },
];

const guests = [
  ["Мурат Абдиев", "ТОО «SafeBuild»", "Осмотр склада", "Н. Ахметов", "10:15", "13:00", "Удостоверение №048812", "Охранник М. Есенов", "Гость активен"],
  ["Мадина Омарова", "Родитель", "Встреча с куратором", "Г. Касенова", "11:20", "12:00", "Удостоверение №991204", "Охранник М. Есенов", "Гость активен"],
  ["Руслан Тажибаев", "Управление образования", "Проверка документов", "Е. Ким", "09:40", "12:10", "Служебное удостоверение", "Охранник А. Нуртазин", "Завершён"],
  ["Сергей Волков", "Vision Systems", "Обслуживание терминала", "IT-отдел", "09:05", "12:30", "Пропуск подрядчика", "Охранник А. Нуртазин", "Завершён"],
];

const terminals = [
  ["Главный вход", "Онлайн", "11:20 · Мадина О.", "884", "Главный корпус", "учебный корпус"],
  ["Корпус А", "Онлайн", "10:58 · группа ЭЛ-22-1", "438", "Корпус А", "учебный корпус"],
  ["Корпус Б", "Онлайн", "10:45 · Нурлан А.", "402", "Корпус Б", "серверная"],
  ["Общежитие", "Онлайн", "09:30 · Арман Т.", "226", "Общежитие №1", "общежитие"],
  ["Столовая", "Онлайн", "12:05 · поток студентов", "618", "Главный корпус", "столовая"],
  ["Библиотека", "Офлайн", "Вчера, 18:41", "0", "Главный корпус", "библиотека"],
  ["Учительская", "Онлайн", "07:48 · Гульмира К.", "96", "Корпус А", "учебный корпус"],
  ["Административный блок", "Онлайн", "11:40 · госорган", "154", "Главный корпус", "администрация"],
];

const corrections = [
  ["КР-2026-018", "Гульмира Касенова", "Преподаватель", "22.06.2026", "Выход 17:12", "HR", "Служебная записка", "Подтверждено"],
  ["КР-2026-017", "Елена Ким", "Сотрудник", "21.06.2026", "Вход 08:02", "Кадровик", "Заявка на отсутствие", "На проверке"],
  ["КР-2026-016", "Мурат Абдиев", "Гость", "20.06.2026", "Продление визита", "Охрана", "Пропуск", "Подтверждено"],
];

const trend = [
  { time: "08:00", events: 820 }, { time: "09:00", events: 1240 }, { time: "10:00", events: 1430 },
  { time: "11:00", events: 1685 }, { time: "12:00", events: 2120 }, { time: "13:00", events: 2480 },
  { time: "14:00", events: 2820 },
];

const statusStyle: Record<AccessStatus, string> = {
  "На территории": "bg-emerald-50 text-emerald-700",
  "Вышел": "bg-slate-100 text-slate-600",
  "Опоздал": "bg-amber-50 text-amber-700",
  "Отсутствует": "bg-red-50 text-red-700",
  "Ушёл раньше": "bg-orange-50 text-orange-700",
  "Гость активен": "bg-violet-50 text-violet-700",
};

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2);
}

function dossierLink(event: AccessEvent) {
  if (event.category === "Студент" && event.personId) return `/students/${event.personId}`;
  if (event.category === "Преподаватель") return "/teachers/TCH-2026-001";
  if (event.category === "Сотрудник" || event.category === "Администрация") return "/staff/EMP-2026-001";
  return null;
}

function Toast({ message }: { message: string }) {
  return <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500"><Check size={14} /></span>{message}</div>;
}

function ModalFrame({ title, subtitle, children, onClose }: { title: string; subtitle: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-900/35 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form onSubmit={(event) => event.preventDefault()} className="my-4 w-full max-w-3xl animate-rise rounded-[24px] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="min-w-0"><h2 className="text-lg font-extrabold">{title}</h2><p className="mt-1 text-xs text-slate-400">{subtitle}</p></div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-400"><X size={18} /></button>
        </div>
        {children}
      </form>
    </div>
  );
}

function GuestModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <ModalFrame title="Зарегистрировать гостя" subtitle="Фейковая регистрация визита без реальной интеграции" onClose={onClose}>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        {["ФИО", "Организация", "Телефон", "Цель визита", "К кому пришел", "Документ"].map((label) => <label key={label} className="text-[11px] font-bold text-slate-600">{label}<input className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-primary" /></label>)}
        <label className="text-[11px] font-bold text-slate-600">Зона доступа<select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs">{zones.map((zone) => <option key={zone}>{zone}</option>)}</select></label>
        <label className="text-[11px] font-bold text-slate-600">Срок визита<input type="time" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs" /></label>
        <label className="text-[11px] font-bold text-slate-600 sm:col-span-2">Комментарий<textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-xs" /></label>
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-6 py-4">
        <button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold">Отмена</button>
        <button type="button" onClick={onSave} className="h-10 rounded-xl bg-primary px-5 text-xs font-bold text-white">Зарегистрировать</button>
      </div>
    </ModalFrame>
  );
}

function CorrectionModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <ModalFrame title="Ручная корректировка" subtitle="Корректировка доступа и рабочего времени по mock-данным" onClose={onClose}>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <label className="text-[11px] font-bold text-slate-600">Человек<input defaultValue="Гульмира Касенова" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs" /></label>
        <label className="text-[11px] font-bold text-slate-600">Категория<select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs">{["Студент", "Преподаватель", "Сотрудник", "Администрация", "Гость", "Подрядчик", "Родитель", "Госорган"].map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="text-[11px] font-bold text-slate-600">Дата<input type="date" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs" /></label>
        <label className="text-[11px] font-bold text-slate-600">Время входа<input type="time" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs" /></label>
        <label className="text-[11px] font-bold text-slate-600">Время выхода<input type="time" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs" /></label>
        <label className="text-[11px] font-bold text-slate-600">Кто внес корректировку<input defaultValue="HR · Елена Ким" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs" /></label>
        <label className="text-[11px] font-bold text-slate-600 sm:col-span-2">Причина<textarea className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 p-3 text-xs" /></label>
        <label className="text-[11px] font-bold text-slate-600">Подтверждающий документ<label className="mt-2 flex h-16 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-[10px] text-slate-400"><Paperclip size={15} />Прикрепить файл<input type="file" className="hidden" /></label></label>
        <label className="text-[11px] font-bold text-slate-600">Комментарий<textarea className="mt-2 min-h-16 w-full rounded-xl border border-slate-200 p-3 text-xs" /></label>
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-6 py-4">
        <button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold">Отмена</button>
        <button type="button" onClick={onSave} className="h-10 rounded-xl bg-primary px-5 text-xs font-bold text-white">Сохранить</button>
      </div>
    </ModalFrame>
  );
}

function EventDetails({ event, onClose }: { event: AccessEvent; onClose: () => void }) {
  const link = dossierLink(event);
  return (
    <ModalFrame title="Детали события доступа" subtitle={`${event.id} · ${event.source}`} onClose={onClose}>
      <div className="grid gap-5 p-6 lg:grid-cols-[1fr_.75fr]">
        <section className="rounded-2xl border border-slate-100 p-5">
          <div className="flex items-start gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-sm font-extrabold text-primary">{initials(event.name)}</span><div><h3 className="text-lg font-extrabold">{event.name}</h3><p className="mt-1 text-sm text-slate-500">{event.category} · {event.groupOrDepartment}</p></div></div>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            {[
              ["Должность", event.position ?? "—"], ["Вход", `${event.entryTime} · ${event.entryTerminal}`], ["Выход", `${event.exitTime} · ${event.exitTerminal}`], ["Зона доступа", event.zone], ["Статус", event.status], ["Источник", event.source],
            ].map(([label, value]) => <div key={label}><dt className="text-slate-400">{label}</dt><dd className="mt-1 font-bold text-slate-800">{value}</dd></div>)}
          </dl>
        </section>
        <section className="rounded-2xl bg-slate-50 p-5">
          <h3 className="text-sm font-extrabold">Визуальные действия</h3>
          <div className="mt-4 space-y-2">
            {link ? <Link href={link} className="flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-xs font-bold text-white">Открыть досье / карточку</Link> : <button className="h-11 w-full rounded-xl bg-primary px-4 text-xs font-bold text-white">Открыть карточку гостя</button>}
            <button className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold">Показать события за день</button>
            <button className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold">Создать корректировку</button>
          </div>
        </section>
      </div>
    </ModalFrame>
  );
}

function AccessTable({ rows }: { rows: AccessEvent[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1540px]">
        <thead><tr className="bg-slate-50/80">{["ФИО", "Категория", "Группа / подразделение", "Должность", "Вход", "Терминал входа", "Выход", "Терминал выхода", "Зона", "Статус", "Источник", "Действия"].map((column) => <th key={column} className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{column}</th>)}</tr></thead>
        <tbody>
          {rows.map((event) => {
            const link = dossierLink(event);
            return (
              <tr key={event.id} className="border-t border-slate-100 hover:bg-blue-50/20">
                <td className="px-4 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-[10px] font-extrabold text-primary">{initials(event.name)}</span><b className="text-[11px] text-slate-800">{event.name}</b></div></td>
                <td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-700">{event.category}</span></td>
                <td className="px-4 py-4 text-[10px] text-slate-500">{event.groupOrDepartment}</td>
                <td className="px-4 py-4 text-[10px] text-slate-500">{event.position ?? "—"}</td>
                <td className="px-4 py-4 text-[10px] font-bold">{event.entryTime}</td>
                <td className="px-4 py-4 text-[10px] text-slate-500">{event.entryTerminal}</td>
                <td className="px-4 py-4 text-[10px] font-bold">{event.exitTime}</td>
                <td className="px-4 py-4 text-[10px] text-slate-500">{event.exitTerminal}</td>
                <td className="px-4 py-4 text-[10px] text-slate-500">{event.zone}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${statusStyle[event.status]}`}>{event.status}</span></td>
                <td className="px-4 py-4 text-[10px] text-slate-500">{event.source}</td>
                <td className="px-4 py-3">{link ? <Link href={link} className="rounded-lg bg-primary px-3 py-2 text-[9px] font-bold text-white">Открыть досье</Link> : <button className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-bold text-slate-600">Открыть карточку</button>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function FaceIdAttendance() {
  const [active, setActive] = useState("Обзор");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AccessEvent | null>(null);
  const [guestModal, setGuestModal] = useState(false);
  const [correctionModal, setCorrectionModal] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  const visible = useMemo(() => accessEvents.filter((event) => event.name.toLowerCase().includes(query.toLowerCase()) || event.category.toLowerCase().includes(query.toLowerCase()) || event.groupOrDepartment.toLowerCase().includes(query.toLowerCase())), [query]);
  const byCategory = (category: Category | Category[]) => visible.filter((event) => Array.isArray(category) ? category.includes(event.category) : event.category === category);
  const guestsOnTerritory = accessEvents.filter((event) => ["Гость", "Родитель", "Подрядчик", "Госорган"].includes(event.category) && event.status === "Гость активен").length;

  return (
    <div className="mx-auto max-w-[1600px] animate-rise">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-blue-200"><Camera size={23} /></span>
          <div className="min-w-0"><h1 className="break-words text-2xl font-extrabold tracking-[-.03em] sm:text-[28px]">Face ID и доступ</h1><p className="mt-1.5 text-sm text-slate-500">Контроль входа, выхода и зон доступа для всего контингента колледжа</p></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="flex h-10 items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 text-[10px] font-bold text-emerald-700"><Radio size={13} className="animate-pulse" />Live · 7 терминалов онлайн</span>
          <button onClick={() => setGuestModal(true)} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[10px] font-bold text-slate-600"><UserRoundPlus size={15} />Зарегистрировать гостя</button>
          <button onClick={() => setCorrectionModal(true)} className="h-10 rounded-xl bg-primary px-4 text-[10px] font-bold text-white">Ручная корректировка</button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border-b border-slate-200"><div className="flex min-w-max">{tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`relative px-5 py-3.5 text-[10px] font-bold ${active === tab ? "text-primary" : "text-slate-400"}`}>{tab}{active === tab ? <span className="absolute inset-x-4 bottom-0 h-0.5 bg-primary" /> : null}</button>)}</div></div>

      {active === "Обзор" ? (
        <div className="mt-5 space-y-5">
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {[
              ["На территории", "1 086", DoorOpen, "bg-emerald-50 text-emerald-600"], ["Отсутствуют", "198", Users, "bg-red-50 text-red-600"], ["Опоздали", "42", Clock3, "bg-amber-50 text-amber-600"], ["Гостей на территории", guestsOnTerritory.toString(), UserRoundPlus, "bg-violet-50 text-violet-600"], ["Активные терминалы", "7 / 8", MonitorSmartphone, "bg-blue-50 text-primary"], ["Событий сегодня", "3 648", BadgeCheck, "bg-slate-100 text-slate-600"],
            ].map(([label, value, Icon, color]) => <article key={label as string} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card"><div className="flex items-start justify-between"><span className={`grid h-9 w-9 place-items-center rounded-xl ${color}`}><Icon size={16} /></span><b className="text-lg">{value as string}</b></div><p className="mt-3 text-[9px] font-bold text-slate-500">{label as string}</p></article>)}
          </section>
          <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
            <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><div className="flex items-center justify-between"><div><h2 className="text-sm font-extrabold">События за сегодня</h2><p className="mt-1 text-[9px] text-slate-400">Входы, выходы, QR и ручные регистрации</p></div><b className="text-xl">3 648</b></div><div className="mt-4 h-[260px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend}><defs><linearGradient id="accessFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2563EB" stopOpacity={0.22} /><stop offset="1" stopColor="#2563EB" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#EEF2F7" /><XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9 }} /><Tooltip contentStyle={{ border: "none", borderRadius: 12, fontSize: 10 }} /><Area dataKey="events" name="События" stroke="#2563EB" strokeWidth={3} fill="url(#accessFill)" /></AreaChart></ResponsiveContainer></div></article>
            <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><h2 className="text-sm font-extrabold">Зоны доступа</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{zones.map((zone, index) => <div key={zone} className="rounded-xl bg-slate-50 p-3"><div className="flex items-center justify-between text-[10px]"><b>{zone}</b><span className="text-slate-400">{84 + index * 3}</span></div><div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-full rounded-full bg-primary" style={{ width: `${62 + index * 4}%` }} /></div></div>)}</div></article>
          </section>
        </div>
      ) : null}

      {active === "Live-лента" ? (
        <section className="mt-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="flex items-center gap-2 text-sm font-extrabold"><span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />Live-лента событий</h2><p className="mt-1 text-[9px] text-slate-400">Студенты, персонал, гости и внешние участники</p></div><label className="flex h-10 w-full max-w-xs items-center gap-2 rounded-xl border border-slate-200 px-3"><Search size={14} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 text-[9px] outline-none" placeholder="ФИО, категория, подразделение…" /></label></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{visible.map((event) => <article key={event.id} className="rounded-2xl border border-slate-100 p-4 hover:border-blue-200"><div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[10px] font-extrabold text-primary">{initials(event.name)}</span><div className="min-w-0"><h3 className="truncate text-[11px] font-extrabold">{event.name}</h3><p className="mt-1 truncate text-[9px] text-slate-400">{event.category} · {event.groupOrDepartment}</p><div className="mt-2 flex flex-wrap items-center gap-2"><b className="text-xs">{event.entryTime}</b><span className={`rounded-full px-2 py-1 text-[8px] font-bold ${statusStyle[event.status]}`}>{event.status}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-[8px] font-bold text-slate-500">{event.source}</span></div></div></div><div className="mt-4 flex gap-2"><button onClick={() => setSelected(event)} className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 text-[8px] font-bold"><Eye size={12} />Детали</button>{dossierLink(event) ? <Link href={dossierLink(event)!} className="flex h-8 flex-1 items-center justify-center rounded-lg bg-primary text-[8px] font-bold text-white">Открыть досье</Link> : <button className="h-8 flex-1 rounded-lg bg-primary text-[8px] font-bold text-white">Карточка</button>}</div></article>)}</div>
        </section>
      ) : null}

      {["Студенты", "Преподаватели", "Сотрудники"].includes(active) ? (
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center"><div><h2 className="text-sm font-extrabold">{active}</h2><p className="mt-1 text-[9px] text-slate-400">Персональные события доступа и переход в досье</p></div><button onClick={() => showToast("Фильтр применён по mock data")} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-[10px] font-bold text-slate-500"><Filter size={14} />Фильтры</button></div>
          <AccessTable rows={active === "Студенты" ? byCategory("Студент") : active === "Преподаватели" ? byCategory("Преподаватель") : byCategory(["Сотрудник", "Администрация"])} />
        </section>
      ) : null}

      {active === "Гости" ? (
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center"><div><h2 className="text-sm font-extrabold">Гости на территории</h2><p className="mt-1 text-[9px] text-slate-400">Визиты родителей, подрядчиков, госорганов и внешних участников</p></div><button onClick={() => setGuestModal(true)} className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-[10px] font-bold text-white"><Plus size={15} />Зарегистрировать гостя</button></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[1320px]"><thead><tr className="bg-slate-50/80">{["ФИО гостя", "Организация", "Цель визита", "Кого посещает", "Вход", "Ожидаемый выход", "Документ", "Зарегистрировал", "Статус визита"].map((column) => <th key={column} className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{column}</th>)}</tr></thead><tbody>{guests.map((row) => <tr key={row[0]} className="border-t border-slate-100">{row.map((cell, index) => <td key={`${row[0]}-${index}`} className="px-4 py-4 text-[10px] text-slate-500">{index === 0 ? <b className="text-slate-800">{cell}</b> : index === 8 ? <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${cell === "Гость активен" ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-600"}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div>
        </section>
      ) : null}

      {active === "Терминалы" ? <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{terminals.map((item) => <article key={item[0]} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-primary"><MonitorSmartphone size={20} /></span><span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold ${item[1] === "Онлайн" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{item[1] === "Онлайн" ? <Wifi size={11} /> : <WifiOff size={11} />} {item[1]}</span></div><h3 className="mt-4 text-sm font-extrabold">{item[0]}</h3><dl className="mt-4 space-y-2 text-[9px]"><div className="flex justify-between gap-3"><dt className="text-slate-400">Последнее событие</dt><dd className="truncate font-bold">{item[2]}</dd></div><div className="flex justify-between"><dt className="text-slate-400">Событий сегодня</dt><dd className="font-bold">{item[3]}</dd></div><div className="flex justify-between"><dt className="text-slate-400">Корпус</dt><dd className="font-bold">{item[4]}</dd></div><div className="flex justify-between"><dt className="text-slate-400">Зона доступа</dt><dd className="font-bold">{item[5]}</dd></div></dl><button onClick={() => showToast(`Открыты события терминала «${item[0]}»`)} className="mt-4 h-9 w-full rounded-xl border border-slate-200 text-[9px] font-bold">Показать события</button></article>)}</section> : null}

      {active === "Корректировки" ? <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"><div className="flex items-center justify-between px-5 py-4"><div><h2 className="text-sm font-extrabold">Ручные корректировки</h2><p className="mt-1 text-[9px] text-slate-400">История изменений доступа и рабочего времени</p></div><button onClick={() => setCorrectionModal(true)} className="h-9 rounded-xl bg-primary px-3 text-[9px] font-bold text-white">Добавить корректировку</button></div><div className="overflow-x-auto"><table className="w-full min-w-[980px]"><thead><tr className="bg-slate-50/80">{["Номер", "Человек", "Категория", "Дата", "Изменение", "Кто внес", "Документ", "Статус проверки"].map((column) => <th key={column} className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{column}</th>)}</tr></thead><tbody>{corrections.map((row) => <tr key={row[0]} className="border-t border-slate-100">{row.map((cell, index) => <td key={`${row[0]}-${index}`} className="px-4 py-4 text-[10px] text-slate-500">{index === 0 || index === 1 ? <b className={index === 0 ? "text-primary" : "text-slate-800"}>{cell}</b> : index === 7 ? <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${cell === "Подтверждено" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div></section> : null}

      {active === "Отчёты" ? <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Отчёт по студентам", "Посещаемость и доступ студентов за период"], ["Отчёт по персоналу", "Рабочие входы/выходы преподавателей и сотрудников"], ["Отчёт по гостям", "Журнал визитов внешних участников"], ["Отчёт по зонам", "Загрузка терминалов и зон доступа"]].map(([title, description]) => <article key={title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-primary"><FileText size={19} /></span><h3 className="mt-4 text-sm font-extrabold">{title}</h3><p className="mt-2 min-h-10 text-[9px] leading-4 text-slate-500">{description}</p><div className="mt-4 flex gap-2"><button onClick={() => showToast(`${title}: PDF подготовлен`)} className="flex h-9 flex-1 items-center justify-center gap-1 rounded-xl bg-red-50 text-[9px] font-bold text-red-700"><FileText size={13} />PDF</button><button onClick={() => showToast(`${title}: Excel подготовлен`)} className="flex h-9 flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-50 text-[9px] font-bold text-emerald-700"><FileSpreadsheet size={13} />Excel</button></div></article>)}</section> : null}

      {selected ? <EventDetails event={selected} onClose={() => setSelected(null)} /> : null}
      {guestModal ? <GuestModal onClose={() => setGuestModal(false)} onSave={() => { setGuestModal(false); showToast("Гость зарегистрирован в журнале доступа"); }} /> : null}
      {correctionModal ? <CorrectionModal onClose={() => setCorrectionModal(false)} onSave={() => { setCorrectionModal(false); showToast("Ручная корректировка сохранена"); }} /> : null}
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}

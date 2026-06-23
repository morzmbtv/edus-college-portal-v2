"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Banknote,
  CalendarCheck2,
  Check,
  Clock3,
  Download,
  FileSpreadsheet,
  FileText,
  Hourglass,
  RefreshCw,
  Search,
  Send,
  Smartphone,
  TimerReset,
  UserCheck,
  X,
} from "lucide-react";

type TimesheetStatus = "Черновик" | "Сформирован" | "На проверке" | "Утверждён" | "Отправлен в бухгалтерию";
type RequestStatus = "Новая" | "На рассмотрении" | "Одобрена" | "Отклонена" | "Требует уточнения";

type TimesheetRow = {
  id: string;
  name: string;
  category: "Преподаватель" | "Сотрудник" | "Администрация";
  position: string;
  department: string;
  norm: number;
  worked: number;
  late: number;
  early: number;
  absent: number;
  unpaid: number;
  vacation: number;
  sick: number;
  trip: number;
  overtime: number;
  status: TimesheetStatus;
  amount: string;
  dossier: string;
};

type AbsenceRequest = {
  id: string;
  name: string;
  category: "Преподаватель" | "Сотрудник" | "Администрация";
  position: string;
  type: string;
  period: string;
  from: string;
  to: string;
  reason: string;
  attachment: string;
  status: RequestStatus;
  approver: string;
  submitted: string;
  code: string;
};

const tabs = ["Обзор", "Преподаватели", "Сотрудники", "По подразделениям", "Отклонения", "Заявки на отсутствие", "Расчёт зарплаты", "Экспорт"];

const rows: TimesheetRow[] = [
  { id: "TCH-2026-001", name: "Гульмира Касенова", category: "Преподаватель", position: "Преподаватель спецдисциплин", department: "Отделение ИТ", norm: 168, worked: 164, late: 1, early: 0, absent: 0, unpaid: 0, vacation: 0, sick: 0, trip: 0, overtime: 4, status: "Сформирован", amount: "412 000 ₸", dossier: "/teachers/TCH-2026-001" },
  { id: "TCH-2026-002", name: "Аслан Беков", category: "Преподаватель", position: "Мастер производственного обучения", department: "Энергетика", norm: 168, worked: 156, late: 3, early: 1, absent: 0, unpaid: 0, vacation: 0, sick: 2, trip: 0, overtime: 0, status: "На проверке", amount: "368 500 ₸", dossier: "/teachers/TCH-2026-001" },
  { id: "EMP-2026-001", name: "Елена Ким", category: "Сотрудник", position: "Заведующая канцелярией", department: "Канцелярия", norm: 168, worked: 168, late: 0, early: 0, absent: 0, unpaid: 0, vacation: 0, sick: 0, trip: 0, overtime: 2, status: "Сформирован", amount: "356 000 ₸", dossier: "/staff/EMP-2026-001" },
  { id: "EMP-2026-002", name: "Нурлан Ахметов", category: "Сотрудник", position: "Системный администратор", department: "IT/цифровизация", norm: 168, worked: 172, late: 0, early: 0, absent: 0, unpaid: 0, vacation: 0, sick: 0, trip: 0, overtime: 8, status: "Черновик", amount: "384 000 ₸", dossier: "/staff/EMP-2026-001" },
  { id: "ADM-2026-001", name: "Айгуль Садыкова", category: "Администрация", position: "Директор", department: "Руководство", norm: 168, worked: 160, late: 0, early: 0, absent: 0, unpaid: 0, vacation: 0, sick: 0, trip: 2, overtime: 0, status: "Утверждён", amount: "685 000 ₸", dossier: "/staff/EMP-2026-001" },
  { id: "EMP-2026-003", name: "Марина Соколова", category: "Сотрудник", position: "Бухгалтер", department: "Бухгалтерия", norm: 168, worked: 128, late: 1, early: 0, absent: 0, unpaid: 0, vacation: 5, sick: 0, trip: 0, overtime: 0, status: "На проверке", amount: "286 000 ₸", dossier: "/staff/EMP-2026-001" },
];

const requests: AbsenceRequest[] = [
  { id: "ЗО-2026-041", name: "Гульмира Касенова", category: "Преподаватель", position: "Преподаватель спецдисциплин", type: "Отпроситься на часть дня", period: "24.06.2026", from: "14:00", to: "17:00", reason: "Медицинский приём", attachment: "Справка.pdf", status: "Новая", approver: "Завуч", submitted: "23.06.2026 08:12", code: "ОТР" },
  { id: "ЗО-2026-040", name: "Елена Ким", category: "Сотрудник", position: "Заведующая канцелярией", type: "БС", period: "25.06.2026", from: "—", to: "—", reason: "Семейные обстоятельства", attachment: "Заявление.pdf", status: "На рассмотрении", approver: "HR", submitted: "22.06.2026 17:40", code: "БС" },
  { id: "ЗО-2026-039", name: "Аслан Беков", category: "Преподаватель", position: "Мастер производственного обучения", type: "Больничный", period: "20.06–21.06.2026", from: "—", to: "—", reason: "Лист временной нетрудоспособности", attachment: "Больничный.pdf", status: "Одобрена", approver: "Завуч", submitted: "20.06.2026 09:11", code: "Б" },
  { id: "ЗО-2026-038", name: "Марина Соколова", category: "Сотрудник", position: "Бухгалтер", type: "Отпуск", period: "24.06–28.06.2026", from: "—", to: "—", reason: "Ежегодный отпуск", attachment: "Приказ-отпуск.docx", status: "Одобрена", approver: "Директор", submitted: "18.06.2026 15:04", code: "ОТ" },
  { id: "ЗО-2026-037", name: "Гульнара Тулеуова", category: "Администрация", position: "Завуч", type: "Командировка", period: "26.06.2026", from: "09:00", to: "18:00", reason: "Семинар Управления образования", attachment: "Приглашение.pdf", status: "Одобрена", approver: "Директор", submitted: "17.06.2026 12:20", code: "К" },
  { id: "ЗО-2026-036", name: "Нурлан Ахметов", category: "Сотрудник", position: "Системный администратор", type: "Уважительная причина", period: "23.06.2026", from: "10:00", to: "12:00", reason: "Обслуживание оборудования подрядчиком", attachment: "Акт.pdf", status: "Требует уточнения", approver: "HR", submitted: "22.06.2026 10:33", code: "УП" },
  { id: "ЗО-2026-035", name: "Аслан Беков", category: "Преподаватель", position: "Мастер производственного обучения", type: "Удалённая работа", period: "27.06.2026", from: "09:00", to: "13:00", reason: "Подготовка методических материалов", attachment: "План.docx", status: "На рассмотрении", approver: "Завуч", submitted: "21.06.2026 14:19", code: "УП" },
];

const calendar = [
  ["1", "Я", "08:01", "17:05", "8:04", "Face ID"], ["2", "Я", "07:58", "17:00", "8:02", "Face ID"],
  ["3", "ОП", "08:18", "17:04", "7:46", "Face ID"], ["4", "Я", "07:55", "17:20", "8:25", "Face ID"],
  ["5", "ОТР", "08:04", "14:00", "5:56", "Заявка"], ["6", "Я", "08:00", "17:03", "8:03", "Face ID"],
  ["7", "В", "—", "—", "—", "Выходной"], ["8", "В", "—", "—", "—", "Выходной"],
  ["9", "Я", "07:52", "17:10", "8:18", "Face ID"], ["10", "СВ", "07:50", "19:00", "10:10", "Face ID"],
  ["11", "Я", "08:01", "17:06", "8:05", "Face ID"], ["12", "БС", "—", "—", "—", "Заявка"],
  ["13", "Я", "08:02", "17:00", "7:58", "Face ID"], ["14", "В", "—", "—", "—", "Выходной"],
];

const codeLegend = [
  ["Я", "явка"], ["Н", "неявка"], ["ОТ", "отпуск"], ["Б", "больничный"], ["БС", "отпуск без сохранения зарплаты"], ["К", "командировка"], ["УП", "уважительная причина"], ["ОП", "опоздание"], ["РУ", "ранний уход"], ["СВ", "сверхурочные"], ["ОТР", "отпросился на часть дня"],
];

const statusStyle: Record<TimesheetStatus, string> = {
  "Черновик": "bg-slate-100 text-slate-600",
  "Сформирован": "bg-blue-50 text-primary",
  "На проверке": "bg-amber-50 text-amber-700",
  "Утверждён": "bg-emerald-50 text-emerald-700",
  "Отправлен в бухгалтерию": "bg-violet-50 text-violet-700",
};

const requestStyle: Record<RequestStatus, string> = {
  "Новая": "bg-blue-50 text-primary",
  "На рассмотрении": "bg-amber-50 text-amber-700",
  "Одобрена": "bg-emerald-50 text-emerald-700",
  "Отклонена": "bg-red-50 text-red-700",
  "Требует уточнения": "bg-violet-50 text-violet-700",
};

function Toast({ message }: { message: string }) {
  return <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500"><Check size={14} /></span>{message}</div>;
}

function ModalFrame({ title, subtitle, children, onClose }: { title: string; subtitle: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-900/35 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="my-4 w-full max-w-5xl animate-rise rounded-[24px] bg-white shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5"><div><h2 className="text-lg font-extrabold">{title}</h2><p className="mt-1 text-xs text-slate-400">{subtitle}</p></div><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-400"><X size={18} /></button></div>{children}</div></div>;
}

function TimesheetTable({ data, onDetail, onCorrection }: { data: TimesheetRow[]; onDetail: (row: TimesheetRow) => void; onCorrection: () => void }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[1780px]"><thead><tr className="bg-slate-50/80">{["ФИО", "Категория", "Должность", "Подразделение", "Норма", "Отработано", "Опоздания", "Ранние уходы", "Отсутствия", "БС", "Отпуск", "Больничный", "Командировка", "Переработка", "Статус", "К начислению", "Действия"].map((column) => <th key={column} className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{column}</th>)}</tr></thead><tbody>{data.map((row) => <tr key={row.id} className="border-t border-slate-100 hover:bg-blue-50/20"><td className="px-4 py-4"><Link href={row.dossier} className="font-extrabold text-slate-800 hover:text-primary">{row.name}</Link></td><td className="px-4 py-4 text-[10px] text-slate-500">{row.category}</td><td className="px-4 py-4 text-[10px] text-slate-500">{row.position}</td><td className="px-4 py-4 text-[10px] text-slate-500">{row.department}</td><td className="px-4 py-4 text-[10px] font-bold">{row.norm}</td><td className="px-4 py-4 text-[10px] font-bold">{row.worked}</td><td className="px-4 py-4 text-[10px] text-amber-600">{row.late}</td><td className="px-4 py-4 text-[10px] text-orange-600">{row.early}</td><td className="px-4 py-4 text-[10px] text-red-600">{row.absent}</td><td className="px-4 py-4 text-[10px]">{row.unpaid}</td><td className="px-4 py-4 text-[10px]">{row.vacation}</td><td className="px-4 py-4 text-[10px]">{row.sick}</td><td className="px-4 py-4 text-[10px]">{row.trip}</td><td className="px-4 py-4 text-[10px] text-emerald-600">{row.overtime}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${statusStyle[row.status]}`}>{row.status}</span></td><td className="px-4 py-4 text-[10px] font-extrabold">{row.amount}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => onDetail(row)} className="rounded-lg bg-primary px-3 py-2 text-[9px] font-bold text-white">Детализация</button><button onClick={onCorrection} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-bold text-slate-600">Коррекция</button></div></td></tr>)}</tbody></table></div>;
}

function DetailModal({ row, onClose, onToast }: { row: TimesheetRow; onClose: () => void; onToast: (message: string) => void }) {
  return <ModalFrame title={`Детализация табеля: ${row.name}`} subtitle="Календарь месяца, источники данных и история изменений" onClose={onClose}><div className="grid gap-5 p-6 xl:grid-cols-[1.1fr_.9fr]"><section className="rounded-2xl border border-slate-100 p-5"><h3 className="text-sm font-extrabold">Календарь месяца</h3><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">{calendar.map(([day, code, entry, exit, hours, source]) => <button key={day} onClick={() => onToast(`День ${day}: источник ${source}`)} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-left"><div className="flex items-center justify-between"><b className="text-sm">{day}</b><span className={`rounded-md px-1.5 py-0.5 text-[9px] font-black ${["Я", "СВ"].includes(code) ? "bg-emerald-100 text-emerald-700" : code === "В" ? "bg-slate-200 text-slate-500" : "bg-amber-100 text-amber-700"}`}>{code}</span></div><p className="mt-2 text-[9px] text-slate-500">{entry} — {exit}</p><p className="text-[9px] font-bold text-slate-700">{hours}</p></button>)}</div></section><section className="space-y-5"><article className="rounded-2xl bg-slate-50 p-5"><h3 className="text-sm font-extrabold">Сводка</h3><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">{[["Норма часов", `${row.norm} ч`], ["Отработано", `${row.worked} ч`], ["Отклонение", `${row.worked - row.norm} ч`], ["Источник", "Face ID / заявки"], ["Комментарий", "Есть 1 заявка из мобильного приложения"], ["Статус", row.status]].map(([label, value]) => <div key={label}><dt className="text-slate-400">{label}</dt><dd className="mt-1 font-bold">{value}</dd></div>)}</dl></article><article className="rounded-2xl border border-slate-100 p-5"><h3 className="text-sm font-extrabold">История изменений</h3><div className="mt-4 space-y-3">{["Сформирован по данным Face ID", "Учтена заявка ОТР", "HR добавил комментарий", "Отправлено на проверку руководителю"].map((item, index) => <div key={item} className="flex gap-3 text-sm"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-primary">{index + 1}</span><span>{item}</span></div>)}</div></article></section></div><div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-6 py-4"><Link href="/attendance" className="h-10 rounded-xl border border-slate-200 px-4 pt-2.5 text-xs font-bold">Открыть детализацию Face ID</Link><button onClick={() => onToast("Детализация выгружена")} className="h-10 rounded-xl bg-primary px-5 text-xs font-bold text-white">Экспорт детализации</button></div></ModalFrame>;
}

function RequestModal({ request, onClose, onApprove }: { request: AbsenceRequest; onClose: () => void; onApprove: () => void }) {
  return <ModalFrame title="Рассмотрение заявки" subtitle={`${request.id} · источник: мобильное приложение`} onClose={onClose}><div className="grid gap-5 p-6 lg:grid-cols-[1fr_.85fr]"><section className="rounded-2xl border border-slate-100 p-5"><div className="flex items-start gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-primary"><Smartphone size={20} /></span><div><h3 className="text-lg font-extrabold">{request.name}</h3><p className="mt-1 text-sm text-slate-500">{request.category} · {request.position}</p><span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-primary">Источник: мобильное приложение</span></div></div><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">{[["Тип заявки", request.type], ["Период", request.period], ["Время", `${request.from} — ${request.to}`], ["Причина", request.reason], ["Вложение", request.attachment], ["Согласующий", request.approver]].map(([label, value]) => <div key={label}><dt className="text-slate-400">{label}</dt><dd className="mt-1 font-bold text-slate-800">{value}</dd></div>)}</dl></section><section className="rounded-2xl bg-slate-50 p-5"><h3 className="text-sm font-extrabold">Влияние на табель</h3><div className="mt-4 rounded-2xl bg-white p-4"><p className="text-sm text-slate-500">При одобрении в табеле появится код:</p><p className="mt-3 text-4xl font-black text-primary">{request.code}</p><p className="mt-2 text-xs text-slate-400">Код будет применён к выбранному периоду и попадёт в mock-расчёт зарплаты.</p></div><label className="mt-4 block text-[11px] font-bold text-slate-600">Комментарий согласующего<textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-xs" /></label></section></div><div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-6 py-4"><button onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold">Закрыть</button><button onClick={onClose} className="h-10 rounded-xl bg-violet-50 px-4 text-xs font-bold text-violet-700">Запросить уточнение</button><button onClick={onClose} className="h-10 rounded-xl bg-red-50 px-4 text-xs font-bold text-red-700">Отклонить</button><button onClick={onApprove} className="h-10 rounded-xl bg-primary px-5 text-xs font-bold text-white">Одобрить</button></div></ModalFrame>;
}

function CorrectionModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return <ModalFrame title="Ручная корректировка табеля" subtitle="Фейковая корректировка без backend и бухгалтерских интеграций" onClose={onClose}><div className="grid gap-4 p-6 sm:grid-cols-2"><label className="text-[11px] font-bold text-slate-600">Сотрудник<input defaultValue="Гульмира Касенова" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs" /></label><label className="text-[11px] font-bold text-slate-600">Код табеля<select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs">{codeLegend.map(([code, label]) => <option key={code}>{code} — {label}</option>)}</select></label><label className="text-[11px] font-bold text-slate-600">Дата<input type="date" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs" /></label><label className="text-[11px] font-bold text-slate-600">Источник<select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs"><option>Face ID</option><option>Заявка</option><option>Ручная корректировка</option></select></label><label className="text-[11px] font-bold text-slate-600 sm:col-span-2">Комментарий<textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-xs" /></label></div><div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4"><button onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold">Отмена</button><button onClick={onSave} className="h-10 rounded-xl bg-primary px-5 text-xs font-bold text-white">Сохранить</button></div></ModalFrame>;
}

export function TimesheetModule() {
  const [active, setActive] = useState("Обзор");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<TimesheetRow | null>(null);
  const [request, setRequest] = useState<AbsenceRequest | null>(null);
  const [correction, setCorrection] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  const visibleRows = useMemo(() => rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()) || row.department.toLowerCase().includes(query.toLowerCase()) || row.category.toLowerCase().includes(query.toLowerCase())), [query]);
  const teacherRows = visibleRows.filter((row) => row.category === "Преподаватель");
  const staffRows = visibleRows.filter((row) => row.category !== "Преподаватель");
  const activeRequests = requests.filter((item) => item.status !== "Одобрена" && item.status !== "Отклонена");

  return <div className="mx-auto max-w-[1600px] animate-rise"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-blue-200"><TimerReset size={23} /></span><div className="min-w-0"><h1 className="break-words text-2xl font-extrabold tracking-[-.03em] sm:text-[28px]">Табель рабочего времени</h1><p className="mt-1.5 text-sm text-slate-500">Mock-расчёт рабочего времени по Face ID и заявкам на отсутствие</p></div></div><div className="flex flex-wrap gap-2"><button onClick={() => showToast("Табель сформирован по данным Face ID")} className="h-10 rounded-xl bg-primary px-4 text-[10px] font-bold text-white">Сформировать табель</button><button onClick={() => showToast("Табель пересчитан")} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-600"><RefreshCw size={14} />Пересчитать</button><button onClick={() => showToast("Табель утверждён и готов к отправке")} className="h-10 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-[10px] font-bold text-emerald-700">Утвердить табель</button></div></div>
    <div className="mt-6 overflow-x-auto border-b border-slate-200"><div className="flex min-w-max">{tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`relative px-5 py-3.5 text-[10px] font-bold ${active === tab ? "text-primary" : "text-slate-400"}`}>{tab}{active === tab ? <span className="absolute inset-x-4 bottom-0 h-0.5 bg-primary" /> : null}</button>)}</div></div>

    {active === "Обзор" ? <div className="mt-5 space-y-5"><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["Сотрудников в табеле", "112", UserCheck, "bg-blue-50 text-primary"], ["Преподавателей в табеле", "86", CalendarCheck2, "bg-violet-50 text-violet-700"], ["Отработано часов", "18 426", Clock3, "bg-emerald-50 text-emerald-700"], ["Опоздания", "42", Hourglass, "bg-amber-50 text-amber-700"], ["Ранние уходы", "11", TimerReset, "bg-orange-50 text-orange-700"], ["Отсутствия", "18", X, "bg-red-50 text-red-700"], ["Заявки на рассмотрении", activeRequests.length.toString(), Smartphone, "bg-cyan-50 text-cyan-700"], ["К начислению mock", "42,8 млн ₸", Banknote, "bg-slate-100 text-slate-700"]].map(([label, value, Icon, color]) => <article key={label as string} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card"><div className="flex items-start justify-between"><span className={`grid h-9 w-9 place-items-center rounded-xl ${color}`}><Icon size={16} /></span><b className="text-lg">{value as string}</b></div><p className="mt-3 text-[9px] font-bold text-slate-500">{label as string}</p></article>)}</section><section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"><div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center"><div><h2 className="text-sm font-extrabold">Таблица табеля</h2><p className="mt-1 text-[9px] text-slate-400">Сводка по преподавателям, сотрудникам и администрации</p></div><label className="flex h-10 w-full max-w-xs items-center gap-2 rounded-xl border border-slate-200 px-3"><Search size={14} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 text-[9px] outline-none" placeholder="ФИО, отдел, категория…" /></label></div><TimesheetTable data={visibleRows} onDetail={setSelected} onCorrection={() => setCorrection(true)} /></article><article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><h2 className="text-sm font-extrabold">Условные обозначения табеля</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{codeLegend.map(([code, label]) => <div key={code} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="grid h-8 w-10 place-items-center rounded-lg bg-white text-[10px] font-black text-primary">{code}</span><span className="text-[10px] font-bold text-slate-600">{label}</span></div>)}</div></article></section></div> : null}

    {active === "Преподаватели" ? <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"><TimesheetTable data={teacherRows} onDetail={setSelected} onCorrection={() => setCorrection(true)} /></section> : null}
    {active === "Сотрудники" ? <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"><TimesheetTable data={staffRows} onDetail={setSelected} onCorrection={() => setCorrection(true)} /></section> : null}

    {active === "По подразделениям" ? <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{["Отделение ИТ", "Канцелярия", "IT/цифровизация", "Бухгалтерия", "Руководство", "Энергетика"].map((department, index) => <article key={department} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><h3 className="text-sm font-extrabold">{department}</h3><p className="mt-3 text-2xl font-black">{1480 + index * 116} ч</p><p className="mt-1 text-[10px] text-slate-400">Отработано за месяц</p><div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary" style={{ width: `${74 + index * 3}%` }} /></div></article>)}</section> : null}

    {active === "Отклонения" ? <section className="mt-5 grid gap-4 xl:grid-cols-3">{[["Опоздания", "42 случая", "Чаще всего: 08:10–08:25"], ["Ранние уходы", "11 случаев", "Проверить объяснительные"], ["Не закрыты выходы", "7 событий", "Нужна ручная корректировка"], ["Переработка", "64 часа", "IT и канцелярия"], ["Отсутствия без заявки", "3 человека", "Требует проверки"], ["Расхождение Face ID / заявка", "5 записей", "На контроле HR"]].map(([title, value, hint]) => <article key={title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><h3 className="text-sm font-extrabold">{title}</h3><p className="mt-3 text-2xl font-black text-slate-900">{value}</p><p className="mt-1 text-[10px] text-slate-400">{hint}</p><button onClick={() => setCorrection(true)} className="mt-4 h-9 rounded-xl border border-slate-200 px-3 text-[9px] font-bold">Ручная корректировка</button></article>)}</section> : null}

    {active === "Заявки на отсутствие" ? <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"><div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center"><div><h2 className="text-sm font-extrabold">Заявки на отсутствие из мобильного приложения</h2><p className="mt-1 text-[9px] text-slate-400">Отпроситься, БС, отпуск, больничный, командировка, удалённая работа</p></div><span className="flex h-9 items-center gap-2 rounded-xl bg-blue-50 px-3 text-[9px] font-bold text-primary"><Smartphone size={14} />Источник: мобильное приложение</span></div><div className="overflow-x-auto"><table className="w-full min-w-[1660px]"><thead><tr className="bg-slate-50/80">{["Номер", "ФИО", "Категория", "Должность", "Тип заявки", "Дата / период", "С", "По", "Причина", "Вложение", "Статус", "Согласующий", "Дата подачи", "Действия"].map((column) => <th key={column} className="px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{column}</th>)}</tr></thead><tbody>{requests.map((item) => <tr key={item.id} className="border-t border-slate-100 hover:bg-blue-50/20"><td className="px-4 py-4 text-[10px] font-extrabold text-primary">{item.id}</td><td className="px-4 py-4 text-[10px] font-bold text-slate-800">{item.name}</td><td className="px-4 py-4 text-[10px] text-slate-500">{item.category}</td><td className="px-4 py-4 text-[10px] text-slate-500">{item.position}</td><td className="px-4 py-4 text-[10px] font-bold">{item.type}</td><td className="px-4 py-4 text-[10px] text-slate-500">{item.period}</td><td className="px-4 py-4 text-[10px]">{item.from}</td><td className="px-4 py-4 text-[10px]">{item.to}</td><td className="max-w-[220px] px-4 py-4 text-[10px] text-slate-500">{item.reason}</td><td className="px-4 py-4 text-[10px] text-slate-500">{item.attachment}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${requestStyle[item.status]}`}>{item.status}</span></td><td className="px-4 py-4 text-[10px]">{item.approver}</td><td className="px-4 py-4 text-[10px] text-slate-500">{item.submitted}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => setRequest(item)} className="rounded-lg bg-primary px-3 py-2 text-[9px] font-bold text-white">Рассмотреть</button><button onClick={() => showToast("Открыт чат с сотрудником")} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-bold text-slate-600">Связаться</button></div></td></tr>)}</tbody></table></div></section> : null}

    {active === "Расчёт зарплаты" ? <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_.8fr]"><article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><h2 className="text-sm font-extrabold">Mock-расчёт зарплаты</h2><p className="mt-1 text-[10px] text-slate-400">Демонстрация, не реальная бухгалтерия</p><div className="mt-5 space-y-3">{[["Оклад", "420 000 ₸"], ["Норма часов", "168 ч"], ["Фактически отработано", "164 ч"], ["Опоздания", "−4 200 ₸"], ["Отсутствия", "0 ₸"], ["БС", "0 ₸"], ["Переработка", "+12 000 ₸"], ["Удержания", "−4 200 ₸"], ["Доплаты", "+12 000 ₸"], ["Итог к начислению", "427 800 ₸"]].map(([label, value], index) => <div key={label} className={`flex justify-between rounded-xl p-3 text-sm ${index === 9 ? "bg-blue-50 font-black text-primary" : "bg-slate-50"}`}><span>{label}</span><b>{value}</b></div>)}</div></article><article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><h2 className="text-sm font-extrabold">Действия</h2><div className="mt-4 grid gap-2"><button onClick={() => showToast("Расчёт зарплаты пересчитан")} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white"><RefreshCw size={15} />Пересчитать</button><button onClick={() => showToast("Табель отправлен в бухгалтерию")} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold"><Send size={15} />Отправить в бухгалтерию</button><button onClick={() => showToast("Excel подготовлен")} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 text-xs font-bold text-emerald-700"><FileSpreadsheet size={15} />Экспорт Excel</button><button onClick={() => showToast("PDF подготовлен")} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 text-xs font-bold text-red-700"><FileText size={15} />Экспорт PDF</button></div></article></section> : null}

    {active === "Экспорт" ? <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Экспорт Excel", FileSpreadsheet], ["Экспорт PDF", FileText], ["Свод по подразделениям", Download], ["Отправить в бухгалтерию", Send]].map(([title, Icon]) => <article key={title as string} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-primary"><Icon size={19} /></span><h3 className="mt-4 text-sm font-extrabold">{title as string}</h3><p className="mt-2 text-[10px] text-slate-500">Фейковая кнопка для демонстрации сценария</p><button onClick={() => showToast(`${title as string}: действие выполнено`)} className="mt-4 h-10 w-full rounded-xl bg-primary px-4 text-xs font-bold text-white">Выполнить</button></article>)}</section> : null}

    {selected ? <DetailModal row={selected} onClose={() => setSelected(null)} onToast={showToast} /> : null}
    {request ? <RequestModal request={request} onClose={() => setRequest(null)} onApprove={() => { setRequest(null); showToast("Заявка одобрена и отражена в табеле"); }} /> : null}
    {correction ? <CorrectionModal onClose={() => setCorrection(false)} onSave={() => { setCorrection(false); showToast("Ручная корректировка добавлена в табель"); }} /> : null}
    {toast ? <Toast message={toast} /> : null}
  </div>;
}

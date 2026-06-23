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
  BarChart,
  Bar,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowLeft,
  Award,
  BookOpenCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileCheck2,
  FilePlus2,
  FileText,
  GraduationCap,
  HeartPulse,
  History,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  Upload,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

type TabKey =
  | "overview"
  | "personal"
  | "parents"
  | "documents"
  | "educationDocuments"
  | "medicalDocuments"
  | "grades"
  | "attendance"
  | "achievements"
  | "discipline"
  | "communications"
  | "tasks"
  | "ai"
  | "educationHistory"
  | "audit"
  | "archive";

type DocumentStatus = "Загружен" | "Проверен" | "Требует обновления" | "Просрочен" | "Архив";
type StudentDocument = {
  id: number;
  name: string;
  category: string;
  type: string;
  number: string;
  issued: string;
  valid: string;
  status: DocumentStatus;
  uploadedBy: string;
  uploadedAt: string;
};

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Обзор", icon: Activity },
  { key: "personal", label: "Личные данные", icon: UserRound },
  { key: "parents", label: "Родители", icon: UsersRound },
  { key: "documents", label: "Документы", icon: FileText },
  { key: "educationDocuments", label: "Образовательные документы", icon: GraduationCap },
  { key: "medicalDocuments", label: "Медицинские документы", icon: HeartPulse },
  { key: "grades", label: "Оценки", icon: BookOpenCheck },
  { key: "attendance", label: "Face ID", icon: ClipboardCheck },
  { key: "achievements", label: "Достижения", icon: Award },
  { key: "discipline", label: "Нарушения", icon: ShieldAlert },
  { key: "communications", label: "Коммуникации", icon: MessageCircle },
  { key: "tasks", label: "Задачи", icon: CheckCircle2 },
  { key: "ai", label: "AI-анализ", icon: Sparkles },
  { key: "educationHistory", label: "История обучения", icon: History },
  { key: "audit", label: "История действий", icon: Scale },
  { key: "archive", label: "Архив", icon: Archive },
];

const student = {
  id: "ST-2024-0188",
  name: "Алимжан Нурланов",
  iin: "080714501284",
  birthDate: "14.07.2008",
  age: "17 лет",
  group: "ИС-23-1",
  course: "2 курс",
  specialty: "Информационные системы",
  status: "Обучается",
  educationForm: "Очная",
  language: "Русский",
  phone: "+7 701 248 19 84",
  email: "alimzhan.nurlanov@college.kz",
  address: "г. Алматы, ул. Абая 118, кв. 47",
  risk: "Высокий",
  riskScore: 73,
  average: "3,62",
  attendance: "78%",
  curator: "Гульмира Касенова",
  psychologist: "Алия Серикова",
  financing: "Грант",
  dormitory: "Нет",
  documentsCount: 35,
  violationsCount: 3,
  achievementsCount: 4,
};

const documentCatalog: Record<string, string[]> = {
  "Удостоверение личности": ["Удостоверение личности", "Свидетельство о рождении", "ИИН", "Адресная справка"],
  "Образовательные документы": [
    "Аттестат",
    "Диплом",
    "Приложение к аттестату",
    "Сертификаты",
    "Результаты вступительных испытаний",
    "Заявление на поступление",
    "Договор на обучение",
    "Приказ о зачислении",
  ],
  "Медицинские документы": [
    "Форма 075/у",
    "Форма 063/у",
    "Справка о состоянии здоровья",
    "Прививочная карта",
    "Медицинские ограничения",
    "Справка об инвалидности",
  ],
  "Социальные документы": [
    "Статус многодетной семьи",
    "Статус сироты",
    "Опекунство",
    "Льготы",
    "Документы по социальной помощи",
  ],
  "Академические документы": [
    "Приказы",
    "Справки",
    "Заявления",
    "Академическая задолженность",
    "Индивидуальный учебный план",
    "Перевод",
    "Восстановление",
    "Академический отпуск",
    "Отчисление",
    "Выпуск",
  ],
  "Прочие документы": [
    "Объяснительные",
    "Характеристики",
    "Акты",
    "Заявления родителей",
    "Согласие на обработку персональных данных",
    "Согласие на Face ID",
  ],
};

const initialDocuments: StudentDocument[] = Object.entries(documentCatalog).flatMap(([category, names], categoryIndex) =>
  names.map((name, index) => {
    const status: DocumentStatus =
      name === "Форма 075/у"
        ? "Требует обновления"
        : name === "Приложение к аттестату" || name === "Согласие на Face ID"
          ? "Загружен"
          : index % 9 === 0
            ? "Просрочен"
            : index % 6 === 0
              ? "Архив"
              : "Проверен";

    return {
      id: categoryIndex * 100 + index + 1,
      name,
      category,
      type: name.includes("Справ") ? "Справка" : name.includes("Приказ") ? "Приказ" : name.includes("Согласие") ? "Согласие" : "Документ",
      number: index % 3 === 0 ? `DOC-${2024 + categoryIndex}-${118 + index}` : "—",
      issued: index % 4 === 0 ? "18.08.2024" : "—",
      valid: name === "Форма 075/у" ? "04.07.2026" : index % 5 === 0 ? "Бессрочно" : "—",
      status,
      uploadedBy: index % 2 ? "Канцелярия · Е. Ким" : "Приёмная комиссия",
      uploadedAt: `${String(12 + (index % 10)).padStart(2, "0")}.08.2024`,
    };
  }),
);

const documentStatusStyle: Record<DocumentStatus, string> = {
  Загружен: "bg-blue-50 text-blue-700 ring-blue-100",
  Проверен: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "Требует обновления": "bg-amber-50 text-amber-700 ring-amber-100",
  Просрочен: "bg-red-50 text-red-700 ring-red-100",
  Архив: "bg-slate-100 text-slate-500 ring-slate-200",
};

const completeness = [
  ["Личные документы", 100, "bg-emerald-500"],
  ["Образовательные документы", 85, "bg-blue-500"],
  ["Медицинские документы", 60, "bg-amber-500"],
  ["Социальные документы", 40, "bg-orange-500"],
  ["Академические документы", 90, "bg-violet-500"],
] as const;

const parents = [
  {
    name: "Нурланов Серик Айдарович",
    relation: "Отец",
    iin: "780211301482",
    phone: "+7 701 456 10 18",
    email: "s.nurlanov@mail.kz",
    address: "г. Алматы, ул. Абая 118, кв. 47",
    work: "ТОО Almaty Build, инженер",
    main: true,
    appeals: ["18.06.2026 · Причины пропусков", "10.05.2026 · Организация питания"],
    documents: ["Удостоверение личности", "Заявление родителя"],
  },
  {
    name: "Нурланова Айгуль Маратовна",
    relation: "Мать",
    iin: "810430402771",
    phone: "+7 707 884 23 11",
    email: "a.nurlanova@mail.kz",
    address: "г. Алматы, ул. Абая 118, кв. 47",
    work: "Школа №42, бухгалтер",
    main: false,
    appeals: ["22.04.2026 · Справка для секции"],
    documents: ["Согласие на обработку данных"],
  },
];

const subjects = [
  ["Базы данных", "4,1", "5, 4, 4, 3, 5", "Г. Касенова", "Нет", "Хорошо работает на практике"],
  ["Программирование", "3,8", "4, 4, 3, 4, 4", "Р. Ахметов", "1 лабораторная", "Нужно закрыть лабораторную №4"],
  ["Компьютерные сети", "3,4", "4, 3, 3, 4, 3", "А. Беков", "Курсовая работа", "Снизилась вовлечённость"],
  ["Английский язык", "4,3", "5, 4, 4, 5, 4", "Д. Омарова", "Нет", "Стабильный результат"],
  ["Физическая культура", "3,6", "4, 4, н, 3, 4", "Е. Нургалиев", "Норматив", "Пропущены два занятия"],
];

const gradeTrend = [
  { month: "Сен", grade: 4.3, attendance: 94 },
  { month: "Окт", grade: 4.1, attendance: 91 },
  { month: "Ноя", grade: 3.9, attendance: 87 },
  { month: "Дек", grade: 3.8, attendance: 84 },
  { month: "Янв", grade: 3.7, attendance: 81 },
  { month: "Фев", grade: 3.6, attendance: 78 },
];

const attendanceEvents = [
  ["22.06.2026", "Понедельник", "08:17", "Главный вход", "16:42", "Главный вход", "Опоздал", "8 ч 25 мин", "Face ID", "Опоздание на 17 минут"],
  ["19.06.2026", "Пятница", "07:56", "Корпус А", "15:48", "Корпус А", "Присутствовал", "7 ч 52 мин", "Face ID", "—"],
  ["18.06.2026", "Четверг", "08:03", "Главный вход", "14:12", "Корпус Б", "Ушёл раньше", "6 ч 09 мин", "Face ID", "Заявление куратора"],
  ["17.06.2026", "Среда", "—", "—", "—", "—", "Отсутствовал", "0 ч", "Ручная корректировка", "Медицинская справка"],
  ["16.06.2026", "Вторник", "08:21", "Главный вход", "16:31", "Библиотека", "Опоздал", "8 ч 10 мин", "Face ID", "Опоздание на 21 минуту"],
  ["15.06.2026", "Понедельник", "07:51", "Общежитие", "16:38", "Главный вход", "Присутствовал", "8 ч 47 мин", "Face ID", "—"],
  ["12.06.2026", "Пятница", "08:06", "Корпус Б", "15:55", "Корпус Б", "Присутствовал", "7 ч 49 мин", "Face ID", "—"],
  ["11.06.2026", "Четверг", "08:14", "Главный вход", "16:20", "Столовая", "Опоздал", "8 ч 06 мин", "Face ID", "—"],
];

const achievements = [
  ["1 место", "Хакатон Almaty Tech 2025", "Городской", "24.11.2025"],
  ["Сертификат", "Cisco Networking Basics", "Международный", "18.03.2026"],
  ["Благодарность", "Волонтёрский проект колледжа", "Колледж", "02.05.2026"],
  ["Участник", "WorldSkills Kazakhstan", "Региональный", "14.04.2026"],
];

const violations = [
  ["18.06.2026", "Опоздание", "Опоздание на 21 минуту", "Беседа куратора", "Г. Касенова", "Проведено"],
  ["03.06.2026", "Пропуск", "Занятия без уважительной причины", "Уведомление родителя", "Г. Касенова", "Исполнено"],
  ["14.05.2026", "Замечание", "Использование телефона на экзамене", "Объяснительная", "А. Беков", "Архив"],
];

const communications = [
  ["18.06.2026", "Серик Нурланов · отец", "Телефон", "Причины пропусков", "Г. Касенова", "Контакт состоялся"],
  ["10.05.2026", "Айгуль Нурланова · мать", "Портал", "Организация питания", "Е. Каримова", "Ответ отправлен"],
  ["02.03.2026", "Студент", "Личная встреча", "Смена учебной группы", "Завуч", "Исполнено"],
];

const studentTasks = [
  ["ЗД-2026-0147", "Связаться с родителем студента", "Высокий", "В работе", "Куратор", "22.06.2026"],
  ["ЗД-2026-0148", "Провести беседу по AI-сигналу", "Критический", "Новая", "Психолог", "23.06.2026"],
  ["ЗД-2026-0136", "Закрыть задолженность по программированию", "Средний", "Ожидает проверки", "Преподаватель", "25.06.2026"],
];

const educationHistory = [
  ["18.08.2024", "Подал заявку на поступление", "ЗП-2024-0441"],
  ["21.08.2024", "Документы проверены", "Комплект подтверждён"],
  ["24.08.2024", "Рекомендован к зачислению", "Решение комиссии №18"],
  ["26.08.2024", "Договор подписан", "ДОГ-2024-0198"],
  ["28.08.2024", "Приказ о зачислении", "Приказ №184"],
  ["01.09.2025", "Переведён на 2 курс", "Приказ №121"],
  ["15.01.2026", "Изменение группы", "ИС-23-2 → ИС-23-1"],
  ["—", "Академический отпуск", "Не предоставлялся"],
  ["—", "Восстановление", "Не применялось"],
  ["Июнь 2027", "Выпуск / отчисление", "Ожидается выпуск"],
  ["После выпуска", "Архив", "Передача личного дела"],
];

const auditTrail = [
  ["Айгуль Садыкова", "Изменён уровень AI-риска", "22.06.2026, 09:41", "AI Центр рисков", "Высокий риск подтверждён"],
  ["Гульмира Касенова", "Добавлен комментарий к успеваемости", "21.06.2026, 16:18", "Успеваемость", "Назначена консультация"],
  ["Елена Ким", "Загружена медицинская справка", "20.06.2026, 11:05", "Документы", "Форма 075/у"],
  ["Face ID", "Зафиксирован вход с опозданием", "20.06.2026, 08:17", "Посещаемость", "Терминал: Главный вход"],
  ["Аслан Беков", "Изменена учебная группа", "15.01.2026, 14:30", "Движение студентов", "ИС-23-2 → ИС-23-1"],
];

function clsx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-sm font-extrabold ring-1", className)}>{children}</span>;
}

function InfoGrid({ rows }: { rows: [string, string][] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-1.5 text-base font-extrabold text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  );
}

function SimpleTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px]">
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
            <tr key={`${row[0]}-${index}`} className="border-t border-slate-100 hover:bg-blue-50/30">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="px-5 py-4 text-sm leading-6 text-slate-600">
                  {cellIndex === 0 ? <b className="text-slate-900">{cell}</b> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentsTable({
  documents,
  onAction,
}: {
  documents: StudentDocument[];
  onAction: (document: StudentDocument, label: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1680px]">
          <thead>
            <tr className="bg-slate-50/90">
              {["Название", "Категория", "Тип", "Номер", "Дата выдачи", "Срок действия", "Статус", "Кто загрузил", "Дата загрузки", "Действия"].map((column) => (
                <th key={column} className="px-5 py-4 text-left text-sm font-extrabold uppercase tracking-wide text-slate-500">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-t border-slate-100 hover:bg-blue-50/20">
                <td className="px-5 py-4 text-base font-extrabold text-slate-900">{document.name}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{document.category}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{document.type}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{document.number}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{document.issued}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{document.valid}</td>
                <td className="px-5 py-4">
                  <Badge className={documentStatusStyle[document.status]}>{document.status}</Badge>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{document.uploadedBy}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{document.uploadedAt}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["Открыть", Search],
                      ["Скачать", Download],
                      ["Заменить", Upload],
                      ["На проверку", CheckCircle2],
                      ["В архив", Archive],
                    ].map(([label, Icon]) => (
                      <button
                        key={String(label)}
                        onClick={() => onAction(document, String(label))}
                        title={String(label)}
                        className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-primary"
                      >
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ActionModal({
  type,
  onClose,
  onSave,
}: {
  type: "edit" | "document" | "contact" | "task" | "certificate" | "archive" | "attendance";
  onClose: () => void;
  onSave: () => void;
}) {
  const titles = {
    edit: "Редактировать данные студента",
    document: "Добавить документ",
    contact: "Связаться с родителем",
    task: "Назначить задачу",
    certificate: "Сформировать справку",
    archive: "Перевести личное дело в архив",
    attendance: "Ручная корректировка посещения",
  };

  const fields =
    type === "attendance"
      ? ["Дата", "Время входа", "Время выхода", "Статус", "Причина", "Подтверждающий документ", "Комментарий", "Кто внёс корректировку"]
      : type === "task"
        ? ["Название задачи", "Ответственный", "Приоритет", "Срок", "Описание"]
        : type === "document"
          ? ["Категория", "Название документа", "Номер", "Срок действия", "Файл", "Комментарий"]
          : type === "contact"
            ? ["Кому", "Канал связи", "Тема", "Комментарий"]
            : type === "certificate"
              ? ["Тип справки", "Получатель", "Основание", "Комментарий"]
              : type === "archive"
                ? ["Причина", "Дата архивации", "Ответственный", "Комментарий"]
                : ["Телефон", "Email", "Адрес", "Статус", "Комментарий"];

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="w-full max-w-3xl rounded-[2rem] bg-white p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">{titles[type]}</h2>
            <p className="mt-2 text-base text-slate-500">Демо-действие: данные сохраняются только локально в интерфейсе.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500">
            <X size={20} />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {fields.map((field, index) => (
            <label key={field} className={clsx("block", index === fields.length - 1 ? "sm:col-span-2" : "")}>
              <span className="text-sm font-extrabold text-slate-600">{field}</span>
              {field === "Комментарий" || field === "Описание" ? (
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
          <button type="submit" className="h-12 rounded-2xl bg-primary px-6 text-base font-extrabold text-white">
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}

export function StudentDossier() {
  const params = useParams<{ id?: string }>();
  const [active, setActive] = useState<TabKey>("overview");
  const [documents, setDocuments] = useState(initialDocuments);
  const [modal, setModal] = useState<null | "edit" | "document" | "contact" | "task" | "certificate" | "archive" | "attendance">(null);
  const [toast, setToast] = useState("");
  const [documentCategory, setDocumentCategory] = useState("Все категории");
  const [attendanceStatus, setAttendanceStatus] = useState("Все статусы");
  const [terminal, setTerminal] = useState("Все терминалы");

  const filteredDocuments = useMemo(() => {
    if (documentCategory === "Все категории") return documents;
    return documents.filter((document) => document.category === documentCategory);
  }, [documentCategory, documents]);

  const filteredAttendance = useMemo(() => {
    return attendanceEvents.filter((event) => {
      const byStatus = attendanceStatus === "Все статусы" || event[6] === attendanceStatus;
      const byTerminal = terminal === "Все терминалы" || event[3] === terminal || event[5] === terminal;
      return byStatus && byTerminal;
    });
  }, [attendanceStatus, terminal]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleDocumentAction = (document: StudentDocument, label: string) => {
    if (label === "В архив") {
      setDocuments((current) => current.map((item) => (item.id === document.id ? { ...item, status: "Архив" } : item)));
    }
    if (label === "На проверку") {
      setDocuments((current) => current.map((item) => (item.id === document.id ? { ...item, status: "Загружен" } : item)));
    }
    showToast(`${document.name}: ${label.toLowerCase()}`);
  };

  const saveModal = () => {
    const label =
      modal === "document"
        ? "Документ добавлен в личное дело"
        : modal === "task"
          ? "Задача назначена ответственному"
          : modal === "contact"
            ? "Контакт с родителем зафиксирован"
            : modal === "certificate"
              ? "Справка сформирована"
              : modal === "attendance"
                ? "Корректировка посещения сохранена"
                : modal === "archive"
                  ? "Личное дело подготовлено к архивации"
                  : "Данные студента обновлены";
    setModal(null);
    showToast(label);
  };

  return (
    <div className="mx-auto max-w-[1700px] animate-rise">
      <div className="mb-6">
        <Link href="/students" className="inline-flex items-center gap-2 text-base font-extrabold text-slate-500 transition hover:text-primary">
          <ArrowLeft size={18} />
          Назад к списку студентов
        </Link>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-card">
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 p-6 text-white sm:p-8">
          <div className="absolute right-8 top-8 hidden h-40 w-40 rounded-full bg-white/10 blur-2xl lg:block" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid h-28 w-28 shrink-0 place-items-center rounded-[2rem] border border-white/30 bg-white/20 text-4xl font-black shadow-xl backdrop-blur">
                АН
              </div>
              <div>
                <p className="text-base font-bold text-blue-100">Личное дело студента · {params?.id ?? student.id}</p>
                <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{student.name}</h1>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge className="bg-white/20 text-white ring-white/30">{student.group}</Badge>
                  <Badge className="bg-white/20 text-white ring-white/30">{student.course}</Badge>
                  <Badge className="bg-emerald-400/20 text-white ring-emerald-100/40">{student.status}</Badge>
                  <Badge className="bg-orange-400/20 text-white ring-orange-100/40">AI-риск: {student.risk}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
              {[
                ["Средний балл", student.average],
                ["Посещаемость", student.attendance],
                ["Риск AI", `${student.riskScore}/100`],
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
            ["Редактировать", Pencil, "edit"],
            ["Добавить документ", FilePlus2, "document"],
            ["Связаться с родителем", Phone, "contact"],
            ["Назначить задачу", CheckCircle2, "task"],
            ["Сформировать справку", FileCheck2, "certificate"],
            ["В архив", Archive, "archive"],
          ] as const).map(([label, Icon, type]) => (
            <button
              key={String(label)}
              onClick={() => setModal(type as typeof modal)}
              className={clsx(
                "inline-flex h-12 items-center gap-2 rounded-2xl px-4 text-base font-extrabold transition",
                type === "archive" ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-blue-50 text-primary hover:bg-blue-100",
              )}
            >
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
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-blue-100 to-sky-50 text-2xl font-black text-primary">АН</div>
              <div>
                <h2 className="text-xl font-black text-slate-950">{student.name}</h2>
                <p className="mt-1 text-base font-bold text-slate-500">ИИН {student.iin}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ["Группа", student.group],
                ["Курс", student.course],
                ["Средний балл", student.average],
                ["Посещаемость", student.attendance],
                ["Документы", String(student.documentsCount)],
                ["Нарушения", String(student.violationsCount)],
                ["Достижения", String(student.achievementsCount)],
                ["AI-риск", student.risk],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">{label}</p>
                  <p className={clsx("mt-1 text-lg font-black", label === "AI-риск" ? "text-orange-600" : "text-slate-950")}>{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert size={22} className="mt-0.5 shrink-0 text-orange-600" />
                <div>
                  <p className="text-base font-black text-orange-800">Высокий уровень риска</p>
                  <p className="mt-1 text-sm leading-6 text-orange-700">Нужны действия куратора и психолога: посещаемость падает, есть задолженности.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
            <h2 className="text-xl font-black text-slate-950">Быстрые связи</h2>
            <div className="mt-4 space-y-3">
              {([
                ["Куратор", student.curator, Mail],
                ["Психолог", student.psychologist, HeartPulse],
                ["Задачи", "3 активные", CheckCircle2],
                ["Документы", "4 требуют внимания", AlertTriangle],
              ] as const).map(([label, value, Icon]) => (
                <button key={String(label)} onClick={() => showToast(`${label}: открыто в демо-режиме`)} className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-blue-50">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-primary shadow-sm">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-500">{label}</span>
                    <span className="block text-base font-black text-slate-900">{value}</span>
                  </span>
                  <ChevronRight size={18} className="ml-auto text-slate-400" />
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
                  onClick={() => setActive(key)}
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
                  <StatCard label="Средний балл" value={student.average} />
                  <StatCard label="Посещаемость за месяц" value={student.attendance} tone="orange" />
                  <StatCard label="Документы в деле" value={String(student.documentsCount)} tone="emerald" />
                  <StatCard label="Активные задачи" value="3" tone="red" />
                </section>

                <section className="grid gap-7 xl:grid-cols-[1.1fr_.9fr]">
                  <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                    <h2 className="text-2xl font-black text-slate-950">Цифровой профиль студента</h2>
                    <p className="mt-2 text-base leading-7 text-slate-500">
                      Единая карточка объединяет личные данные, документы, Face ID посещаемость, оценки, коммуникации, задачи и AI-рекомендации.
                    </p>
                    <div className="mt-6">
                      <InfoGrid
                        rows={[
                          ["Специальность", student.specialty],
                          ["Форма обучения", student.educationForm],
                          ["Язык обучения", student.language],
                          ["Финансирование", student.financing],
                          ["Общежитие", student.dormitory],
                          ["Статус", student.status],
                        ]}
                      />
                    </div>
                  </article>

                  <article className="rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 shadow-card">
                    <div className="flex items-start gap-4">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-100 text-orange-700">
                        <Sparkles size={24} />
                      </span>
                      <div>
                        <h2 className="text-2xl font-black text-slate-950">AI-краткая сводка</h2>
                        <p className="mt-2 text-base leading-7 text-slate-600">
                          Основной риск — снижение посещаемости и две академические задолженности. Рекомендуется связаться с родителями, назначить психолога и закрыть задолженности до 25.06.2026.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-3">
                      {["Посещаемость упала на 16%", "Средний балл снизился на 0,7", "9 опозданий за месяц", "2 задолженности по предметам"].map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 text-base font-bold text-slate-700">
                          <AlertTriangle size={18} className="text-orange-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </article>
                </section>

                <section className="grid gap-7 xl:grid-cols-2">
                  <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                    <h2 className="text-2xl font-black text-slate-950">Динамика оценок и посещаемости</h2>
                    <div className="mt-5 h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={gradeTrend}>
                          <CartesianGrid vertical={false} stroke="#EEF2F7" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13 }} />
                          <Tooltip contentStyle={{ border: "none", borderRadius: 16, boxShadow: "0 12px 30px rgba(15,23,42,.12)" }} />
                          <Line dataKey="grade" name="Средний балл" stroke="#2563EB" strokeWidth={3} />
                          <Line dataKey="attendance" name="Посещаемость" stroke="#F97316" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </article>
                  <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                    <h2 className="text-2xl font-black text-slate-950">Ближайшие контрольные точки</h2>
                    <div className="mt-5 space-y-4">
                      {[
                        ["23.06.2026", "Беседа с психологом", "Психолог"],
                        ["24.06.2026", "Контроль звонка родителю", "Куратор"],
                        ["25.06.2026", "Закрыть лабораторную №4", "Преподаватель"],
                        ["04.07.2026", "Обновить медицинскую справку", "Канцелярия"],
                      ].map(([date, title, owner]) => (
                        <div key={title} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-primary shadow-sm">
                            <CalendarDays size={19} />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-slate-500">{date} · {owner}</p>
                            <p className="mt-1 text-base font-black text-slate-950">{title}</p>
                          </div>
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
                      ["ФИО", student.name],
                      ["ИИН", student.iin],
                      ["Дата рождения", student.birthDate],
                      ["Возраст", student.age],
                      ["Телефон", student.phone],
                      ["Email", student.email],
                      ["Адрес", student.address],
                      ["Группа", student.group],
                      ["Специальность", student.specialty],
                      ["Курс", student.course],
                      ["Форма обучения", student.educationForm],
                      ["Язык обучения", student.language],
                    ]}
                  />
                </div>
              </section>
            ) : null}

            {active === "parents" ? (
              <section className="grid gap-5 xl:grid-cols-2">
                {parents.map((parent) => (
                  <article key={parent.iin} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-black text-slate-950">{parent.name}</h2>
                        <p className="mt-1 text-base font-bold text-slate-500">{parent.relation} · ИИН {parent.iin}</p>
                      </div>
                      {parent.main ? <Badge className="bg-blue-50 text-primary ring-blue-100">Основной контакт</Badge> : null}
                    </div>
                    <div className="mt-5">
                      <InfoGrid
                        rows={[
                          ["Телефон", parent.phone],
                          ["Email", parent.email],
                          ["Адрес", parent.address],
                          ["Место работы", parent.work],
                        ]}
                      />
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-base font-black text-slate-900">История обращений</p>
                        <div className="mt-3 space-y-2 text-sm font-bold text-slate-600">
                          {parent.appeals.map((appeal) => <p key={appeal}>{appeal}</p>)}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-base font-black text-slate-900">Документы родителя</p>
                        <div className="mt-3 space-y-2 text-sm font-bold text-slate-600">
                          {parent.documents.map((document) => <p key={document}>{document}</p>)}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setModal("contact")} className="mt-6 inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-5 text-base font-extrabold text-white">
                      <Phone size={18} />
                      Связаться
                    </button>
                  </article>
                ))}
              </section>
            ) : null}

            {active === "documents" || active === "educationDocuments" || active === "medicalDocuments" ? (
              <div className="space-y-6">
                {active === "documents" ? (
                  <>
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                      {completeness.map(([label, value, color]) => (
                        <article key={label} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-base font-black text-slate-900">{label}</p>
                            <b className="text-xl font-black text-slate-950">{value}%</b>
                          </div>
                          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                            <div className={clsx("h-full rounded-full", color)} style={{ width: `${value}%` }} />
                          </div>
                        </article>
                      ))}
                    </section>
                    <section className="grid gap-4 xl:grid-cols-3">
                      {["Медицинская справка истекает через 12 дней", "Нет согласия на Face ID", "Не загружено приложение к аттестату"].map((warning) => (
                        <div key={warning} className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-base font-extrabold text-amber-800">
                          <AlertTriangle size={20} />
                          {warning}
                        </div>
                      ))}
                    </section>
                  </>
                ) : null}

                <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-card">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-950">
                        {active === "educationDocuments" ? "Образовательные документы" : active === "medicalDocuments" ? "Медицинские документы" : "Реестр документов студента"}
                      </h2>
                      <p className="mt-1 text-base text-slate-500">Полный комплект цифрового личного дела с проверкой сроков и статусов.</p>
                    </div>
                    <select
                      value={active === "educationDocuments" ? "Образовательные документы" : active === "medicalDocuments" ? "Медицинские документы" : documentCategory}
                      disabled={active !== "documents"}
                      onChange={(event) => setDocumentCategory(event.target.value)}
                      className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold text-slate-700 outline-none disabled:bg-slate-50"
                    >
                      <option>Все категории</option>
                      {Object.keys(documentCatalog).map((category) => <option key={category}>{category}</option>)}
                    </select>
                  </div>
                </section>

                <DocumentsTable
                  documents={
                    active === "educationDocuments"
                      ? documents.filter((document) => document.category === "Образовательные документы")
                      : active === "medicalDocuments"
                        ? documents.filter((document) => document.category === "Медицинские документы")
                        : filteredDocuments
                  }
                  onAction={handleDocumentAction}
                />
              </div>
            ) : null}

            {active === "grades" ? (
              <div className="space-y-6">
                <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
                  <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                    <SimpleTable columns={["Предмет", "Средний балл", "Оценки", "Преподаватель", "Задолженность", "Комментарий"]} rows={subjects} />
                  </article>
                  <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                    <h2 className="text-2xl font-black text-slate-950">Динамика по месяцам</h2>
                    <div className="mt-5 h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gradeTrend}>
                          <CartesianGrid vertical={false} stroke="#EEF2F7" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13 }} />
                          <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 13 }} />
                          <Tooltip />
                          <Bar dataKey="grade" name="Средний балл" fill="#2563EB" radius={[10, 10, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </article>
                </section>
                <section className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-base font-extrabold text-red-700">Задолженность: компьютерные сети · курсовая работа</div>
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-base font-extrabold text-amber-700">Задолженность: программирование · лабораторная №4</div>
                </section>
              </div>
            ) : null}

            {active === "attendance" ? (
              <div className="space-y-6">
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                  {[
                    ["Сегодня", "Опоздал 17 мин"],
                    ["За неделю", "78%"],
                    ["За месяц", "82%"],
                    ["Опозданий", "9"],
                    ["Пропусков", "7"],
                    ["Среднее время", "08:09 — 16:24"],
                  ].map(([label, value]) => <StatCard key={label} label={label} value={value} tone={label === "Опозданий" || label === "Пропусков" ? "orange" : "blue"} />)}
                </section>
                <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
                  <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-slate-950">Июнь 2026</h2>
                      <CalendarDays size={22} className="text-primary" />
                    </div>
                    <div className="mt-5 grid grid-cols-7 gap-2 text-center text-sm font-black text-slate-400">
                      {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => <b key={day}>{day}</b>)}
                      {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => (
                        <span
                          key={day}
                          className={clsx(
                            "grid aspect-square place-items-center rounded-xl text-sm font-black",
                            [3, 10, 17].includes(day)
                              ? "bg-red-50 text-red-600"
                              : [2, 9, 16, 22].includes(day)
                                ? "bg-amber-50 text-amber-700"
                                : day > 22
                                  ? "text-slate-300"
                                  : "bg-emerald-50 text-emerald-700",
                          )}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 space-y-3 text-sm font-bold text-slate-600">
                      <p><span className="mr-2 inline-block h-3 w-3 rounded-full bg-emerald-400" />Присутствовал</p>
                      <p><span className="mr-2 inline-block h-3 w-3 rounded-full bg-amber-400" />Опоздал / ушёл раньше</p>
                      <p><span className="mr-2 inline-block h-3 w-3 rounded-full bg-red-400" />Отсутствовал</p>
                    </div>
                  </article>
                  <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 xl:flex-row">
                      <div className="flex flex-wrap gap-3">
                        <select className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold">
                          <option>Последние 30 дней</option>
                          <option>Эта неделя</option>
                          <option>Сегодня</option>
                        </select>
                        <select value={attendanceStatus} onChange={(event) => setAttendanceStatus(event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold">
                          <option>Все статусы</option>
                          <option>Присутствовал</option>
                          <option>Опоздал</option>
                          <option>Отсутствовал</option>
                          <option>Ушёл раньше</option>
                        </select>
                        <select value={terminal} onChange={(event) => setTerminal(event.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold">
                          <option>Все терминалы</option>
                          {["Главный вход", "Корпус А", "Корпус Б", "Общежитие", "Столовая", "Библиотека"].map((item) => <option key={item}>{item}</option>)}
                        </select>
                      </div>
                      <button onClick={() => setModal("attendance")} className="h-12 rounded-2xl bg-primary px-5 text-base font-extrabold text-white">Ручная корректировка</button>
                    </div>
                    <SimpleTable columns={["Дата", "День", "Вход", "Терминал входа", "Выход", "Терминал выхода", "Статус дня", "Длительность", "Источник", "Комментарий"]} rows={filteredAttendance} />
                  </article>
                </section>
              </div>
            ) : null}

            {active === "achievements" ? (
              <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {achievements.map(([title, event, level, date]) => (
                  <article key={event} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                    <Award size={28} className="text-amber-500" />
                    <h3 className="mt-5 text-2xl font-black text-slate-950">{title}</h3>
                    <p className="mt-2 text-base font-extrabold text-slate-700">{event}</p>
                    <p className="mt-4 text-sm font-bold text-slate-500">{level} · {date}</p>
                  </article>
                ))}
              </section>
            ) : null}

            {active === "discipline" ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                <SimpleTable columns={["Дата", "Тип", "Описание", "Мера", "Ответственный", "Статус"]} rows={violations} />
              </article>
            ) : null}

            {active === "communications" ? (
              <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                  <SimpleTable columns={["Дата", "Инициатор", "Канал", "Тема", "Ответственный", "Статус"]} rows={communications} />
                </article>
                <aside className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                  <h2 className="text-2xl font-black text-slate-950">Быстрая связь</h2>
                  <div className="mt-5 space-y-3">
                    {["Позвонить родителю", "Написать email", "Создать обращение", "Назначить встречу"].map((action) => (
                      <button key={action} onClick={() => showToast(action)} className="flex h-12 w-full items-center gap-3 rounded-2xl bg-slate-50 px-4 text-base font-extrabold text-slate-700 hover:bg-blue-50">
                        <MessageCircle size={18} className="text-primary" />
                        {action}
                        <ChevronRight size={16} className="ml-auto" />
                      </button>
                    ))}
                  </div>
                </aside>
              </div>
            ) : null}

            {active === "tasks" ? (
              <section className="grid gap-5 xl:grid-cols-3">
                {studentTasks.map(([number, title, priority, status, owner, deadline]) => (
                  <Link href="/tasks" key={number} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-xl">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base font-black text-primary">{number}</span>
                      <Badge className="bg-blue-50 text-blue-700 ring-blue-100">{status}</Badge>
                    </div>
                    <h3 className="mt-5 text-xl font-black text-slate-950">{title}</h3>
                    <p className="mt-3 text-base font-bold text-slate-500">{owner} · срок {deadline}</p>
                    <p className="mt-4 text-sm font-extrabold text-orange-600">Приоритет: {priority}</p>
                  </Link>
                ))}
                <button onClick={() => setModal("task")} className="rounded-[2rem] border-2 border-dashed border-blue-200 bg-blue-50/60 p-6 text-left text-xl font-black text-primary">
                  + Назначить новую задачу
                </button>
              </section>
            ) : null}

            {active === "ai" ? (
              <div className="space-y-6">
                <section className="grid gap-6 xl:grid-cols-[360px_1fr_1fr]">
                  <article className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-card">
                    <ShieldAlert size={28} className="text-orange-600" />
                    <p className="mt-5 text-base font-bold text-slate-500">Общий уровень риска</p>
                    <p className="mt-2 text-4xl font-black text-orange-600">Высокий</p>
                    <p className="mt-2 text-2xl font-black text-slate-950">{student.riskScore}/100</p>
                    <p className="mt-4 text-base leading-7 text-slate-500">Ответственные: куратор {student.curator}, психолог {student.psychologist}</p>
                  </article>
                  <article className="rounded-[2rem] border border-red-100 bg-red-50/40 p-6">
                    <h2 className="text-2xl font-black text-slate-950">Почему студент попал в риск</h2>
                    <div className="mt-5 space-y-3">
                      {["Посещаемость снизилась на 16%", "Средний балл снизился на 0,7", "9 опозданий за месяц", "2 академические задолженности", "Снижение вовлечённости на занятиях"].map((reason) => (
                        <p key={reason} className="flex gap-3 text-base font-bold text-slate-700">
                          <span className="mt-2 h-2 w-2 rounded-full bg-red-500" />
                          {reason}
                        </p>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-[2rem] border border-violet-100 bg-violet-50/40 p-6">
                    <h2 className="flex items-center gap-3 text-2xl font-black text-slate-950">
                      <Sparkles size={24} className="text-violet-600" />
                      AI-рекомендации
                    </h2>
                    <div className="mt-5 space-y-3">
                      {["Связаться с родителями", "Проверить задолженности", "Назначить встречу с психологом", "Закрепить наставника", "Контролировать посещаемость 14 дней"].map((item) => (
                        <p key={item} className="flex gap-3 text-base font-bold text-slate-700">
                          <Check size={18} className="mt-0.5 text-violet-600" />
                          {item}
                        </p>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button onClick={() => setModal("task")} className="h-12 rounded-2xl bg-violet-600 px-5 text-base font-extrabold text-white">Создать задачу</button>
                      <button onClick={() => showToast("AI-сигнал отмечен как обработанный")} className="h-12 rounded-2xl bg-white px-5 text-base font-extrabold text-violet-700">Отметить обработанным</button>
                    </div>
                  </article>
                </section>
                <section className="grid gap-6 xl:grid-cols-2">
                  <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                    <h2 className="text-2xl font-black text-slate-950">История AI-сигналов</h2>
                    <div className="mt-5 space-y-4">
                      {[
                        ["22.06.2026", "Высокий риск", "Снижение посещаемости"],
                        ["15.06.2026", "Средний риск", "Академическая задолженность"],
                        ["02.06.2026", "Наблюдение", "Повторные опоздания"],
                      ].map(([date, level, reason]) => (
                        <div key={date} className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm font-bold text-slate-500">{date} · {level}</p>
                          <p className="mt-1 text-base font-black text-slate-950">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-card">
                    <h2 className="text-2xl font-black text-slate-950">Защитные факторы</h2>
                    <p className="mt-4 text-base leading-7 text-slate-600">
                      Победитель хакатона, активность в IT-клубе, сертификат Cisco и положительные отзывы преподавателя по базам данных снижают вероятность отчисления при своевременной работе куратора.
                    </p>
                  </article>
                </section>
              </div>
            ) : null}

            {active === "educationHistory" ? (
              <section className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-card">
                <h2 className="text-2xl font-black text-slate-950">История поступления и движения</h2>
                <div className="mt-7">
                  {educationHistory.map(([date, title, detail], index, array) => (
                    <div key={`${date}-${title}`} className="relative flex gap-5 pb-7 last:pb-0">
                      <span className={clsx("relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl", index < 7 ? "bg-blue-50 text-primary" : "bg-slate-100 text-slate-400")}>
                        {index < 7 ? <Check size={18} /> : <FileText size={18} />}
                      </span>
                      {index < array.length - 1 ? <span className="absolute bottom-0 left-[21px] top-11 w-px bg-slate-200" /> : null}
                      <div>
                        <p className="text-sm font-bold text-slate-500">{date}</p>
                        <p className="mt-1 text-xl font-black text-slate-950">{title}</p>
                        <p className="mt-1 text-base text-slate-600">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {active === "audit" ? (
              <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
                <SimpleTable columns={["Кто изменил", "Что изменил", "Дата и время", "Модуль", "Комментарий"]} rows={auditTrail} />
              </article>
            ) : null}

            {active === "archive" ? (
              <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
                <article className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-card">
                  <h2 className="text-2xl font-black text-slate-950">Архив личного дела</h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    Статус: <b>{student.status}</b>. После выпуска, отчисления или завершения срока хранения документы передаются в электронный архив колледжа.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                      ["Архивные документы", "12"],
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
                  <button onClick={() => showToast("Архивная копия подготовлена")} className="mt-5 h-12 w-full rounded-2xl bg-slate-900 text-base font-extrabold text-white">
                    Сформировать архивную копию
                  </button>
                </article>
              </section>
            ) : null}
          </div>
        </main>
      </div>

      {modal ? <ActionModal type={modal} onClose={() => setModal(null)} onSave={saveModal} /> : null}
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

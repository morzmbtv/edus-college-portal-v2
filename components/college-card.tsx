"use client";

import { useState } from "react";
import {
  BookOpenCheck, Building2, Check, Download, FilePlus2, FileText,
  GraduationCap, Landmark, MapPin, MonitorSmartphone, MoreHorizontal, Pencil,
  Plus, School, Users, Wifi, WifiOff, X,
} from "lucide-react";

const tabs = ["Общая информация", "Руководство", "Структура", "Отделения", "Группы", "Специальности", "Кабинеты и корпуса", "Face ID терминалы", "Шаблоны документов", "Роли и доступы"];

const leadership = [
  ["АС","Айгуль Садыкова","Директор","director@edus.kz","+7 701 555 42 18"],
  ["ГК","Гульмира Касенова","Заместитель директора по учебной работе","g.kasenova@edus.kz","+7 701 555 10 24"],
  ["АК","Асель Каримова","Заместитель директора по воспитательной работе","a.karimova@edus.kz","+7 701 555 19 08"],
  ["ЛИ","Лаура Ибраева","Главный бухгалтер","l.ibraeva@edus.kz","+7 701 555 73 11"],
  ["ЕК","Елена Ким","Заведующая канцелярией","e.kim@edus.kz","+7 701 555 21 44"],
  ["БТ","Бакыт Толеуов","Руководитель отдела кадров","b.toleuov@edus.kz","+7 701 555 60 17"],
];
const structure = [
  ["Учебная часть","12 сотрудников","Г. Касенова"], ["Воспитательный отдел","7 сотрудников","А. Каримова"],
  ["Канцелярия","4 сотрудника","Е. Ким"], ["Бухгалтерия","6 сотрудников","Л. Ибраева"],
  ["Отдел кадров","3 сотрудника","Б. Толеуов"], ["IT / цифровизация","5 сотрудников","Р. Ахметов"],
  ["Общежитие","280 мест","С. Кудайберген"], ["Охрана","12 сотрудников","Н. Ахметов"],
  ["Библиотека","48 200 книг","Д. Омарова"], ["Медпункт","2 специалиста","А. Серикова"],
];
const departments = [
  ["Информационные технологии","12 групп","312 студентов","А. Беков"], ["Экономика и учёт","9 групп","238 студентов","М. Соколова"],
  ["Строительство","8 групп","206 студентов","Е. Нургалиев"], ["Сервис и туризм","10 групп","264 студента","Ж. Абиева"],
  ["Энергетика","7 групп","184 студента","К. Иманов"],
];
const groups = [
  ["ИС-23-1","2 курс","Информационные системы","Г. Касенова","24","91,7%","4,48","1 студент"],
  ["БУ-24-2","1 курс","Учёт и аудит","М. Соколова","28","96,4%","4,12","Нет"],
  ["ЭЛ-22-1","3 курс","Электроснабжение","А. Беков","22","86,4%","3,94","3 студента"],
  ["СТ-23-2","2 курс","Строительство зданий","Е. Нургалиев","25","92,8%","4,05","1 студент"],
  ["ТУ-24-1","1 курс","Туризм","Ж. Абиева","27","94,1%","4,31","Нет"],
];
const specialties = [
  ["06130100","Программное обеспечение","3 года 10 мес.","7","184","А. Беков"],
  ["04110100","Учёт и аудит","2 года 10 мес.","5","138","М. Соколова"],
  ["07320100","Строительство зданий","3 года 10 мес.","6","156","Е. Нургалиев"],
  ["10150100","Туризм","2 года 10 мес.","4","108","Ж. Абиева"],
  ["07130200","Электроснабжение","3 года 10 мес.","5","132","К. Иманов"],
];
const rooms = [
  ["Главный корпус","2 этаж","204","Компьютерная лаборатория","Р. Ахметов","26"],
  ["Главный корпус","1 этаж","118","Кабинет бухгалтерского учёта","М. Соколова","30"],
  ["Учебный корпус №2","1 этаж","Лаб. 2","Электротехническая лаборатория","А. Беков","20"],
  ["Учебный корпус №2","3 этаж","305","Кабинет педагогики","Ж. Абиева","32"],
  ["Главный корпус","1 этаж","Актовый зал","Массовые мероприятия","А. Каримова","260"],
];
const terminals = [
  ["EDUS Gate 01","Главный вход","Онлайн","Сегодня, 09:41","Студенты · корпус №1"],
  ["EDUS Gate 02","Учебный корпус №2","Онлайн","Сегодня, 09:38","Студенты · корпус №2"],
  ["EDUS Dorm 01","Общежитие, вход","Онлайн","Сегодня, 09:27","Проживающие студенты"],
  ["EDUS Staff 01","Служебный вход","Офлайн","Вчера, 18:42","Преподаватели и сотрудники"],
];
const templates = ["Приказ о зачислении", "Приказ об отчислении", "Справка с места учёбы", "Служебная записка", "Ответ родителю", "Договор", "Акт"];
const accessRows = [
  ["Директор","Полный обзор и управленческие решения","Все модули","Полный"],
  ["Завуч","Организация учебного процесса","Студенты, расписание, успеваемость, посещаемость","Расширенный"],
  ["Куратор","Работа со своей группой","Студенты группы, посещаемость, обращения","Ограниченный"],
  ["Преподаватель","Ведение занятий и журнала","Расписание, журнал, оценки","Рабочий"],
  ["Психолог","Сопровождение студентов риска","Риск-мониторинг, карточки сопровождения","Конфиденциальный"],
  ["Кадровик","Кадровый учёт","Сотрудники, договоры, личные дела","Расширенный"],
  ["Канцелярия","Регистрация документов","Документооборот, архив","Регистрационный"],
];

const actionByTab: Record<string,string|undefined> = {
  "Группы":"Добавить группу", "Специальности":"Добавить специальность", "Кабинеты и корпуса":"Добавить кабинет",
  "Face ID терминалы":"Добавить терминал Face ID", "Шаблоны документов":"Добавить шаблон документа", "Роли и доступы":"Настроить права доступа",
};

function DataTable({ columns, rows, onAction }: { columns:string[]; rows:string[][]; onAction:(row:string[])=>void }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[820px] border-collapse"><thead><tr className="bg-slate-50/80">{columns.map(column=><th key={column} className="px-5 py-3.5 text-left text-[9px] font-extrabold uppercase tracking-[.07em] text-slate-400">{column}</th>)}<th className="w-14 px-4 py-3.5"/></tr></thead><tbody>{rows.map(row=><tr key={row.join("-")} className="border-t border-slate-100 hover:bg-blue-50/20">{row.map((cell,index)=><td key={`${cell}-${index}`} className="px-5 py-4 text-[11px] text-slate-600">{index===0?<b className="text-slate-800">{cell}</b>:cell==="Онлайн"||cell==="Полный"||cell==="Расширенный"?<span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">{cell}</span>:cell==="Офлайн"?<span className="rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-bold text-red-700">{cell}</span>:cell}</td>)}<td className="px-4"><button onClick={()=>onAction(row)} title={`Действия: ${row[0]}`} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><MoreHorizontal size={16}/></button></td></tr>)}</tbody></table></div>;
}

function EditModal({ action, onClose, onSave }: { action:string; onClose:()=>void; onSave:()=>void }) {
  const addingGroup=action.includes("группу"); const addingSpecialty=action.includes("специальность"); const addingRoom=action.includes("кабинет"); const addingTerminal=action.includes("Face ID"); const addingTemplate=action.includes("шаблон"); const permissions=action.includes("права");
  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-900/35 p-4 backdrop-blur-[2px]" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><form onSubmit={event=>{event.preventDefault();onSave()}} className="my-4 w-full max-w-xl animate-rise rounded-[22px] bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="text-lg font-extrabold">{action}</h2><p className="mt-1 text-xs text-slate-400">Изменения сохраняются только в демо-режиме</p></div><button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-400"><X size={18}/></button></div><div className="grid gap-4 p-6 sm:grid-cols-2">
    {permissions?<><label className="text-[11px] font-bold text-slate-600">Роль<select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none"><option>Директор</option><option>Завуч</option><option>Куратор</option><option>Преподаватель</option><option>Психолог</option><option>Кадровик</option><option>Канцелярия</option></select></label><label className="text-[11px] font-bold text-slate-600">Уровень доступа<select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none"><option>Полный</option><option>Расширенный</option><option>Ограниченный</option></select></label></>:null}
    {!permissions?<label className="text-[11px] font-bold text-slate-600">{addingGroup?"Название группы":addingSpecialty?"Код специальности":addingRoom?"Номер кабинета":addingTerminal?"Название терминала":addingTemplate?"Название шаблона":"Название колледжа"}<input required className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-primary" placeholder="Введите значение"/></label>:null}
    {!permissions?<label className="text-[11px] font-bold text-slate-600">{addingTerminal?"Место установки":addingRoom?"Назначение":addingSpecialty?"Название специальности":addingGroup?"Куратор":"Ответственный"}<input className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-primary" placeholder="Укажите данные"/></label>:null}
    {addingTemplate?<label className="text-[11px] font-bold text-slate-600 sm:col-span-2">Файл шаблона<label className="mt-2 flex h-20 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-xs text-slate-400"><FilePlus2 size={17}/>Выбрать DOCX или PDF<input type="file" className="hidden"/></label></label>:null}
    {!addingTemplate&&!permissions?<label className="text-[11px] font-bold text-slate-600 sm:col-span-2">Комментарий<textarea className="mt-2 min-h-24 w-full resize-none rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-primary" placeholder="Дополнительная информация"/></label>:null}
    {permissions?<div className="sm:col-span-2"><p className="text-[11px] font-bold text-slate-600">Доступные модули</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{["Колледж","Студенты","Преподаватели","Расписание","Успеваемость","Посещаемость","Документооборот","Настройки"].map(item=><label key={item} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-[10px] font-bold text-slate-600"><input type="checkbox" defaultChecked className="accent-primary"/>{item}</label>)}</div></div>:null}
  </div><div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4"><button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-500">Отмена</button><button className="h-10 rounded-xl bg-primary px-5 text-xs font-bold text-white">Сохранить</button></div></form></div>;
}

export function CollegeCard() {
  const [active,setActive]=useState("Общая информация"); const [modal,setModal]=useState<string|null>(null); const [toast,setToast]=useState("");
  function showToast(message:string){setToast(message);window.setTimeout(()=>setToast(""),2500)}
  function save(){const action=modal;setModal(null);showToast(`${action}: изменения сохранены`)}
  const action=actionByTab[active];
  return <div className="mx-auto max-w-[1600px] animate-rise"><div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div className="flex items-center gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-blue-200"><School size={26}/></span><div><h1 className="text-2xl font-extrabold tracking-[-.025em] sm:text-[28px]">Карточка колледжа</h1><p className="mt-1.5 text-sm text-slate-500">Структура, подразделения и цифровая инфраструктура организации</p></div></div><div className="flex flex-wrap gap-2"><button onClick={()=>setModal("Редактировать данные колледжа")} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-600 shadow-sm"><Pencil size={15}/>Редактировать данные колледжа</button>{action?<button onClick={()=>setModal(action)} className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-[11px] font-bold text-white shadow-lg shadow-blue-100"><Plus size={16}/>{action}</button>:null}</div></div>
    <section className="mt-7 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"><div className="overflow-x-auto border-b border-slate-100 px-3 pt-2"><div className="flex min-w-max">{tabs.map(tab=><button key={tab} onClick={()=>setActive(tab)} className={`relative px-3.5 py-3.5 text-[10px] font-bold transition ${active===tab?"text-primary":"text-slate-400 hover:text-slate-700"}`}>{tab}{active===tab?<span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary"/>:null}</button>)}</div></div>
      {active==="Общая информация"?<div className="p-5 sm:p-7"><div className="flex flex-col gap-5 rounded-2xl bg-[#123269] p-6 text-white sm:flex-row sm:items-center"><span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/10"><Landmark size={30}/></span><div><h2 className="text-xl font-extrabold">Высший колледж информационных технологий EDUS</h2><p className="mt-2 flex items-center gap-2 text-xs text-blue-100/80"><MapPin size={14}/>г. Алматы, ул. Толе би, 189</p></div><span className="ml-auto rounded-full bg-emerald-400/15 px-3 py-1.5 text-[10px] font-bold text-emerald-200">Лицензия действительна</span></div><div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 sm:grid-cols-2 xl:grid-cols-4">{[["Название","Высший колледж информационных технологий"],["БИН","990 740 001 284"],["Адрес","г. Алматы, ул. Толе би, 189"],["Телефон","+7 (727) 355-42-18"],["Email","info@edus-college.kz"],["Сайт","www.edus-college.kz"],["Директор","Айгуль Садыкова"],["Язык обучения","Казахский, русский"]].map(([label,value])=><div key={label} className="bg-white p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-xs font-bold text-slate-700">{value}</p></div>)}</div><div className="mt-5 grid gap-4 sm:grid-cols-3"><article className="rounded-2xl bg-blue-50 p-5"><GraduationCap size={20} className="text-primary"/><p className="mt-4 text-2xl font-extrabold">1 284</p><p className="mt-1 text-[10px] font-bold text-slate-500">студента</p></article><article className="rounded-2xl bg-violet-50 p-5"><BookOpenCheck size={20} className="text-violet-600"/><p className="mt-4 text-2xl font-extrabold">86</p><p className="mt-1 text-[10px] font-bold text-slate-500">преподавателей</p></article><article className="rounded-2xl bg-emerald-50 p-5"><Users size={20} className="text-emerald-600"/><p className="mt-4 text-2xl font-extrabold">112</p><p className="mt-1 text-[10px] font-bold text-slate-500">сотрудников всего</p></article></div></div>:null}
      {active==="Руководство"?<div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3 sm:p-7">{leadership.map(([initials,name,position,email,phone])=><article key={position} className="rounded-2xl border border-slate-100 p-5"><div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-xs font-extrabold text-primary">{initials}</span><div className="min-w-0"><h3 className="text-xs font-extrabold">{name}</h3><p className="mt-1 text-[10px] leading-4 text-slate-500">{position}</p></div></div><div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-[10px] text-slate-400"><p>{email}</p><p>{phone}</p></div></article>)}</div>:null}
      {active==="Структура"?<div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-5 sm:p-7">{structure.map(([name,meta,lead])=><article key={name} className="rounded-2xl border border-slate-100 p-4 hover:border-blue-100 hover:shadow-card"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-primary"><Building2 size={17}/></span><h3 className="mt-4 text-xs font-extrabold">{name}</h3><p className="mt-1 text-[10px] text-slate-400">{meta}</p><p className="mt-3 text-[10px] font-bold text-slate-600">{lead}</p></article>)}</div>:null}
      {active==="Отделения"?<div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5 sm:p-7">{departments.map(([name,groupsCount,students,head])=><article key={name} className="rounded-2xl border border-slate-100 p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-primary"><GraduationCap size={19}/></span><h3 className="mt-4 min-h-9 text-xs font-extrabold leading-5">{name}</h3><p className="mt-3 text-[10px] text-slate-400">{groupsCount} · {students}</p><p className="mt-3 border-t border-slate-100 pt-3 text-[10px] font-bold text-slate-600">{head}</p></article>)}</div>:null}
      {active==="Группы"?<DataTable columns={["Группа","Курс","Специальность","Куратор","Студентов","Посещаемость","Средний балл","Риск-группа"]} rows={groups} onAction={row=>showToast(`Открыта карточка группы ${row[0]}`)}/>:null}
      {active==="Специальности"?<DataTable columns={["Код","Название","Срок обучения","Групп","Студентов","Заведующий отделением"]} rows={specialties} onAction={row=>showToast(`Открыта специальность ${row[0]}`)}/>:null}
      {active==="Кабинеты и корпуса"?<DataTable columns={["Корпус","Этаж","Кабинет","Назначение","Ответственный","Вместимость"]} rows={rooms} onAction={row=>showToast(`Открыт кабинет ${row[2]}`)}/>:null}
      {active==="Face ID терминалы"?<div><div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4 sm:p-7">{terminals.map(([name,place,status,last,zones])=><article key={name} className="rounded-2xl border border-slate-100 p-5"><div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-primary"><MonitorSmartphone size={19}/></span><span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold ${status==="Онлайн"?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`}>{status==="Онлайн"?<Wifi size={11}/>:<WifiOff size={11}/>} {status}</span></div><h3 className="mt-4 text-xs font-extrabold">{name}</h3><p className="mt-1 text-[10px] text-slate-400">{place}</p><div className="mt-4 border-t border-slate-100 pt-3"><p className="text-[9px] text-slate-400">Последнее событие</p><p className="mt-1 text-[10px] font-bold">{last}</p><p className="mt-3 text-[9px] text-slate-400">Группы / зоны</p><p className="mt-1 text-[10px] font-bold">{zones}</p></div></article>)}</div></div>:null}
      {active==="Шаблоны документов"?<div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4 sm:p-7">{templates.map((name,index)=><article key={name} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-primary"><FileText size={18}/></span><div className="min-w-0"><h3 className="truncate text-[11px] font-extrabold">{name}</h3><p className="mt-1 text-[9px] text-slate-400">DOCX · версия {index+1}.0</p></div><button onClick={()=>showToast(`Шаблон «${name}» подготовлен к скачиванию`)} className="ml-auto text-slate-400 hover:text-primary"><Download size={16}/></button></article>)}</div>:null}
      {active==="Роли и доступы"?<DataTable columns={["Роль","Описание","Доступные модули","Уровень доступа"]} rows={accessRows} onAction={row=>setModal(`Настроить права: ${row[0]}`)}/>:null}
    </section>{modal?<EditModal action={modal} onClose={()=>setModal(null)} onSave={save}/>:null}{toast?<div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500"><Check size={14}/></span>{toast}</div>:null}
  </div>;
}

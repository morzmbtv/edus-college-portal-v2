import { CollegeCard } from "@/components/college-card";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function CollegePage() {
  return <><Link href="/compliance" className="mx-auto mb-5 flex max-w-[1600px] items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-emerald-800"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white"><ShieldCheck size={17}/></span><span><b className="block text-[11px]">Контур соответствия колледжа</b><small className="text-[9px] text-emerald-600">Индекс 92% · лицензии действуют · 2 замечания требуют внимания</small></span><span className="ml-auto text-[10px] font-bold">Открыть →</span></Link><CollegeCard /></>;
}

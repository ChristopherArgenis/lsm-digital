import { type LucideIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  options: { value: string; count: number }[];
  onChange: (value: string) => void;
};

export function PhonologicalSelect({ id, label, icon: Icon, value, options, onChange }: Props) {
  return <div className="min-w-0">
    <label id={`${id}-label`} htmlFor={id} className={`mb-2 flex min-h-10 items-center gap-2 text-xs font-medium leading-snug ${value ? "text-primary" : "text-foreground"}`}>
      <Icon size={16} aria-hidden="true" className="shrink-0 text-primary" />
      <span>{label}</span>
    </label>
    <Select value={value || "all"} onValueChange={(next) => onChange(next === "all" ? "" : next)}>
      <SelectTrigger id={id} aria-labelledby={`${id}-label`} title={value || "Todos"} className={`h-11 w-full gap-2 rounded-md text-sm shadow-none transition-colors hover:border-primary/50 focus:ring-2 focus:ring-primary/30 data-[state=open]:border-primary ${value ? "border-primary/50 bg-primary-soft font-medium text-primary" : "border-input bg-background text-muted-foreground"}`}>
        <span className="min-w-0 truncate"><SelectValue>{value || "Todos"}</SelectValue></span>
      </SelectTrigger>
      <SelectContent align="start" sideOffset={6} className="w-[min(20rem,calc(100vw-2rem))] shadow-lg">
        <SelectItem value="all" className="min-h-11 cursor-pointer px-3 pr-9 focus:bg-primary-soft focus:text-primary">Todos</SelectItem>
        {options.map((option) => <SelectItem key={option.value} value={option.value} textValue={option.value} className="min-h-11 cursor-pointer px-3 pr-9 focus:bg-primary-soft focus:text-primary [&>span:last-child]:w-full">
          <span className="flex items-center justify-between gap-4">
            <span className="whitespace-normal leading-snug">{option.value}</span>
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[11px] tabular-nums text-muted-foreground">{option.count.toLocaleString("es-MX")}</span>
          </span>
        </SelectItem>)}
      </SelectContent>
    </Select>
  </div>;
}
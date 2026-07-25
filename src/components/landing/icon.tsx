import {
  Gauge,
  ShieldCheck,
  Trees,
  Briefcase,
  Home,
  Building2,
  Ship,
  Tent,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Gauge,
  ShieldCheck,
  Trees,
  Briefcase,
  Home,
  Building2,
  Ship,
  Tent,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = MAP[name] ?? Gauge;
  return <Cmp className={className} aria-hidden />;
}

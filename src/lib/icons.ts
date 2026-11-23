import {
  BookOpen,
  Circle,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Landmark,
  Rocket,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Lucide icons that content files may name in their "icon" field.
    Add an icon here before using its name in content. */
const contentIcons: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  handshake: Handshake,
  "heart-handshake": HeartHandshake,
  landmark: Landmark,
  rocket: Rocket,
  "shield-check": ShieldCheck,
  users: Users,
};

export function contentIcon(name: string): LucideIcon {
  return contentIcons[name] ?? Circle;
}

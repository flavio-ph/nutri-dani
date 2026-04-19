import { LucideIcon } from 'lucide-react';

export interface NavElement {
  name: string;
  href: string;
}

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  forWho: string;
}

export interface ScheduleItem {
  day: string;
  hours: string;
  type: string;
}

export interface Testimonial {
  name: string;
  text: string;
  tag: string;
  image?: string;
}

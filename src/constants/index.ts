import { Stethoscope, Video, Apple, Activity } from 'lucide-react';
import { NavElement, ServiceItem, ScheduleItem, Testimonial } from '../types';

export const navLinks: NavElement[] = [
  { name: 'Início', href: '#home' },
  { name: 'Sobre', href: '#about' },
  { name: 'Serviços', href: '#services' },
  { name: 'Horários', href: '#schedule' },
  // { name: 'Depoimentos', href: '#testimonials' },
  { name: 'Contato', href: '#contact' },
];

export const services: ServiceItem[] = [
  {
    icon: Stethoscope,
    title: "Consulta Presencial e domiciliar",
    description: "Atendimento completo em consultório ou a domicílio, com olhar atento à sua rotina e objetivos. Aqui, cada detalhe importa — da avaliação física ao planejamento alimentar.",
    benefits: ["Avaliação corporal completa", "Plano alimentar impresso", "Ambiente acolhedor"],
    forWho: "Quem prefere contato próximo e precisa de avaliação física precisa."
  },
  {
    icon: Video,
    title: "Consulta Online",
    description: "A mesma qualidade do atendimento presencial, no conforto da sua casa, para qualquer lugar do mundo.",
    benefits: ["Flexibilidade de horário", "Sem tempo de deslocamento", "Material digital interativo"],
    forWho: "Pessoas com rotina corrida ou que moram em outras cidades/países."
  },
  {
    icon: Apple,
    title: "Reeducação Alimentar",
    description: "Programa focado em mudar sua relação com a comida, aprendendo a fazer escolhas inteligentes sem terrorismo nutricional.",
    benefits: ["Autonomia alimentar", "Resultados duradouros", "Fim do efeito sanfona"],
    forWho: "Quem está cansado de dietas restritivas e busca saúde a longo prazo."
  },
  /*
  {
    icon: Activity,
    title: "Nutrição Esportiva",
    description: "Estratégias nutricionais específicas para otimizar seu rendimento nos treinos e alcançar seus objetivos estéticos.",
    benefits: ["Melhora de performance", "Ganho de massa magra", "Recuperação muscular"],
    forWho: "Praticantes de atividade física e atletas amadores."
  }
  */
];

export const schedule: ScheduleItem[] = [
  { day: "Segunda-feira", hours: "08:00 - 18:00", type: "Presencial & Online" },
  { day: "Terça-feira", hours: "08:00 - 18:00", type: "Presencial & Online" },
  { day: "Quarta-feira", hours: "08:00 - 20:00", type: "Apenas Online" },
  { day: "Quinta-feira", hours: "08:00 - 18:00", type: "Presencial & Online" },
  { day: "Sexta-feira", hours: "08:00 - 16:00", type: "Presencial & Online" },
];

export const testimonials: Testimonial[] = [
  {
    name: "Mariana Silva",
    text: "A Dani mudou completamente minha visão sobre dieta. Eu achava que precisava cortar tudo que gostava, mas ela me ensinou a ter equilíbrio. Hoje me sinto com muito mais energia e perdi peso sem sofrimento.",
    tag: "Emagrecimento",
    image: "https://i.pravatar.cc/150?img=47"
  },
  {
    name: "Carlos Eduardo",
    text: "O acompanhamento para hipertrofia foi excelente. O plano alimentar foi super adaptado à minha rotina corrida e os resultados nos treinos apareceram muito mais rápido do que eu esperava.",
    tag: "Nutrição Esportiva",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "Ana Beatriz",
    text: "Sempre tive uma relação difícil com a comida, pulando de dieta em dieta. O acolhimento da Daniele foi fundamental para eu fazer as pazes com a alimentação. Recomendo de olhos fechados!",
    tag: "Reeducação Alimentar",
    image: "https://i.pravatar.cc/150?img=32"
  }
];

export const contactInfo = {
  whatsapp: "5579996900462",
  whatsappFormatted: "(79) 99690-0462",
  email: "daniele0709alves@gmail.com",
  address: "Atendimento Online e Domiciliar",
  instagram: "https://www.instagram.com/_danialves.s?igsh=MXFzcnRocnQ0MXlo"
};

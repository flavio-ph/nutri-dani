import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { useBooking } from '../context/BookingContext';

// Imagem Real Adicionada
import aboutImg from '../assets/about.jpeg';

export default function About() {
  const { openBookingModal } = useBooking();

  return (
    <section id="about" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative order-2 md:order-1"
          >
            <div className="aspect-square rounded-tl-[40px] rounded-br-[40px] border border-line p-2 bg-surface overflow-hidden max-w-[320px] sm:max-w-none mx-auto">
              <img
                src={aboutImg}
                alt="Nutricionista em atendimento"
                className="w-full h-full object-cover rounded-tl-[32px] rounded-br-[32px] object-top"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent-light/50 -z-10" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2"
          >
            <span className="text-[11px] uppercase tracking-[2px] text-accent mb-4 block">Sobre Mim</span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-text mb-4 sm:mb-6">
              Muito prazer, sou a <span className="text-primary italic">Daniele</span>
            </h2>
            <div className="space-y-3 sm:space-y-4 text-text-muted text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
              <p>
                Acredito que a alimentação deve ser fonte de nutrição, prazer e saúde, não de culpa e restrições severas. Meu propósito é te ajudar a construir uma relação mais leve e saudável com a comida.
              </p>
              <p>
                Com um olhar atento e acolhedor, desenvolvo planos alimentares que se adaptam à sua rotina, respeitando suas preferências, cultura e objetivos, seja para emagrecimento, hipertrofia ou qualidade de vida.
              </p>
            </div>

            <Button onClick={openBookingModal} variant="outline" icon={ArrowRight}>
              Quero transformar minha alimentação
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

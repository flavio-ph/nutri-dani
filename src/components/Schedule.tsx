import { motion } from 'motion/react';
import { schedule } from '../constants';
import { Button } from './ui/Button';
import { ArrowRight } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function Schedule() {
  const { openBookingModal } = useBooking();
  return (
    <section id="schedule" className="py-16 sm:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full text-center"
          >
            <span className="text-[11px] uppercase tracking-[2px] text-accent mb-4 block font-semibold">Disponibilidade</span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-text mb-4 sm:mb-6">
              Horários de <span className="text-primary italic">Atendimento</span>
            </h2>
            <p className="text-text-muted text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
              Organize sua rotina e encontre o melhor horário para cuidarmos da sua saúde. Os agendamentos são feitos de forma simples e rápida.
            </p>
            
            <div className="bg-surface rounded-[12px] border border-line overflow-hidden text-left">
              <div className="flex flex-col">
                {schedule.map((item, index) => (
                  <div key={item.day} className="grid grid-cols-[80px_1fr] border-b border-line last:border-0 text-[12px]">
                    <div className="p-4 bg-primary-light/20 font-semibold text-primary flex items-center justify-center border-r border-line/50">
                      {item.day.substring(0, 3).toUpperCase()}
                    </div>
                    <div className="p-4 flex flex-wrap gap-3 items-center">
                      <span className="bg-line/50 px-2 py-1 rounded-[4px] text-text-muted font-medium">
                        {item.hours}
                      </span>
                      <span className="text-xs text-accent ml-auto font-medium">
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Button onClick={openBookingModal} icon={ArrowRight}>
                Agendar uma consulta
              </Button>
            </div>
          </motion.div>

          {/* 
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-full min-h-[400px] rounded-tl-[40px] rounded-br-[40px] border border-line p-2 bg-surface overflow-hidden shadow-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1505253857503-455fa168923a?q=80&w=1000&auto=format&fit=crop"
              alt="Consultório nutricional"
              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-tl-[32px] rounded-br-[32px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-2 bg-gradient-to-t from-black/40 to-transparent mix-blend-overlay rounded-tl-[32px] rounded-br-[32px]" />
          </motion.div>
          */}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { Star, ArrowRight } from 'lucide-react';
import { testimonials } from '../constants';
import { Button } from './ui/Button';
import { useBooking } from '../context/BookingContext';

export default function Testimonials() {
  const { openBookingModal } = useBooking();

  return (
    <section id="testimonials" className="py-24 bg-background text-text">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[2px] text-accent mb-4 block font-semibold">Depoimentos</span>
          <h2 className="font-display text-3xl md:text-4xl font-normal mb-4">
            Histórias reais de <span className="italic">transformação</span>
          </h2>
          <p className="text-text-muted text-lg">
            O que dizem os pacientes que já transformaram sua relação com a alimentação.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface p-8 rounded-[16px] border border-line flex flex-col relative"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-accent text-accent" />
                ))}
              </div>
              <div className="mb-8 flex-1">
                <p className="text-[14px] leading-[1.6] text-text-muted italic">
                  "{testimonial.text}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-line/50">
                {testimonial.image && (
                   <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-10 h-10 rounded-full object-cover shrink-0" 
                      referrerPolicy="no-referrer"
                   />
                )}
                <div>
                  <p className="font-bold text-[13px] text-text">{testimonial.name}</p>
                  <p className="text-[11px] text-accent uppercase tracking-wider mt-0.5">{testimonial.tag}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
            <Button onClick={openBookingModal} variant="primary" icon={ArrowRight}>
               Quero ser a próxima história
            </Button>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { MapPin, Mail, MessageCircle, Instagram, Calendar } from 'lucide-react';
import { contactInfo } from '../constants';
import { Button } from './ui/Button';
import { useBooking } from '../context/BookingContext';

export default function Contact() {
  const { openBookingModal } = useBooking();

  return (
    <section id="contact" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="bg-surface rounded-[12px] p-5 sm:p-8 md:p-16 border border-line shadow-sm">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[11px] uppercase tracking-[2px] text-accent mb-4 block font-semibold">Contato</span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-text mb-3 sm:mb-4">
                Vamos iniciar sua <span className="text-primary italic">jornada?</span>
              </h2>
              <p className="text-text-muted text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
                Dê o primeiro passo para uma vida mais saudável. Entre em contato para tirar dúvidas ou agendar sua consulta.
              </p>

              <div className="space-y-6">
                <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-primary-light/30 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">WhatsApp</p>
                    <p className="text-lg font-medium text-text">{contactInfo.whatsappFormatted}</p>
                  </div>
                </a>

                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-primary-light/30 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">E-mail</p>
                    <p className="text-lg font-medium text-text hover:text-primary transition-colors break-all">{contactInfo.email}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-primary-light/30 rounded-full flex items-center justify-center text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Consultório</p>
                    <p className="text-lg font-medium text-text">{contactInfo.address}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-background rounded-[12px] p-2 text-center border border-line"
            >
              {/* Google Maps Embed */}
              <div className="w-full h-[250px] rounded-[8px] overflow-hidden border border-line relative mb-6 bg-surface">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14629.589839352726!2d-46.66258813359146!3d-23.5586616056586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59ccb795fa1d%3A0xc62269a91176b05e!2sAv.%20Paulista%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1711200000000!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização do Consultório"
                ></iframe>
              </div>

              <div className="px-6 pb-6">
                 <h3 className="font-display text-2xl font-normal text-text mb-3">Agende agora</h3>
                 <p className="text-[13.5px] text-text-muted mb-6 leading-[1.6]">
                   Clique no botão abaixo para escolher o processo guiado de agenda e encontrar o melhor horário.
                 </p>
                 <Button onClick={openBookingModal} fullWidth icon={Calendar} iconPosition="left">
                   Iniciar Agendamento
                 </Button>
                 
                 <div className="flex items-center justify-center gap-4 pt-6 mt-6 border-t border-line/50">
                   <span className="text-sm text-text-muted">Acompanhe nas redes:</span>
                   <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-dark transition-colors">
                     <Instagram size={24} />
                   </a>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

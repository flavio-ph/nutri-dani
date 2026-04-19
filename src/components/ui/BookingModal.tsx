import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, ChevronRight, CheckCircle2, User, Phone } from 'lucide-react';
import { Button } from './Button';
import { contactInfo } from '../../constants';

interface BookingModalProps {
  onClose: () => void;
}

const services = [
  { id: 'presencial', name: 'Consulta Presencial', duration: '1h 30m' },
  { id: 'online', name: 'Consulta Online', duration: '1h' },
  { id: 'retorno', name: 'Retorno', duration: '45m' },
];

const availableDates = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  return d;
});

const availableTimes = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'];

export function BookingModal({ onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleFinish = () => {
    const serviceName = services.find((s) => s.id === selectedService)?.name;
    const dateStr = selectedDate?.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

    const message = `Olá Daniele! Gostaria de agendar uma *${serviceName}*.\n\n` +
      ` 🗓️ *Preferência de data:* ${dateStr}\n` +
      ` 🕑 *Horário:* ${selectedTime}\n` +
      ` 👤 *Meu nome é:* ${formData.name}\n\n` +
      `Podemos confirmar?`;

    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-surface rounded-[16px] sm:rounded-[24px] shadow-2xl border border-line overflow-hidden flex flex-col max-h-[95dvh] sm:max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-line">
          <div>
            <h3 className="font-display text-xl text-text">Agendar Consulta</h3>
            <p className="text-[13px] text-text-muted mt-1">
              Etapa {step} de 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-line/30 text-text-muted hover:bg-line/50 hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-line/50">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3 sm:space-y-4"
              >
                <h4 className="font-semibold text-text mb-4">Qual serviço você busca?</h4>
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${selectedService === service.id
                        ? 'border-primary bg-primary-light/20 ring-1 ring-primary'
                        : 'border-line hover:border-primary/50'
                      }`}
                  >
                    <div>
                      <p className="font-medium text-text">{service.name}</p>
                      <p className="text-[13px] text-text-muted mt-1">{service.duration}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${selectedService === service.id ? 'bg-primary border-primary' : 'border-line'
                        }`}>
                        {selectedService === service.id && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h4 className="font-semibold text-text mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    Escolha uma data
                  </h4>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide py-1">
                    {availableDates.map((date, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center min-w-[72px] p-3 rounded-[16px] border transition-all shrink-0 ${selectedDate?.toDateString() === date.toDateString()
                            ? 'bg-primary border-primary text-white shadow-md'
                            : 'bg-surface border-line text-text hover:border-primary/50'
                          }`}
                      >
                        <span className={`text-[11px] uppercase tracking-wider mb-1 ${selectedDate?.toDateString() === date.toDateString() ? 'text-white/80' : 'text-text-muted'
                          }`}>
                          {date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                        </span>
                        <span className="text-xl font-display font-medium">
                          {date.getDate()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-text mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-primary" />
                    Escolha um horário
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 sm:p-3 rounded-[12px] border font-medium text-[13px] sm:text-[14px] transition-all ${selectedTime === time
                            ? 'bg-primary-light/30 border-primary text-primary'
                            : 'bg-surface border-line text-text hover:border-primary/50'
                          }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h4 className="font-semibold text-text mb-2">Seus Dados</h4>
                <p className="text-[13px] text-text-muted mb-6">
                  Estamos quase lá! Preencha seus dados para enviarmos a solicitação ao WhatsApp.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-text mb-1">Nome completo</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-[8px] bg-background border border-line focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[14px]"
                        placeholder="Ex: João Silva"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text mb-1">Celular / WhatsApp</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-[8px] bg-background border border-line focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[14px]"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-primary-light/20 p-4 rounded-xl mt-6">
                  <p className="text-[12px] text-text-muted flex gap-2">
                    <span className="text-primary mt-0.5">ℹ️</span>
                    As consultas de horário dependem da aprovação final via WhatsApp. Seu agendamento só é confirmado lá.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-line flex items-center justify-between bg-surface">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="text-[14px] font-medium text-text hover:text-primary transition-colors px-4 py-2"
            >
              Voltar
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedService) ||
                (step === 2 && (!selectedDate || !selectedTime))
              }
              className="disabled:opacity-50 disabled:pointer-events-none"
              icon={ChevronRight}
            >
              Continuar
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={!formData.name}
              className="disabled:opacity-50 disabled:pointer-events-none"
            >
              Confirmar p/ WhatsApp
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

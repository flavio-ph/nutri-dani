import { motion } from 'motion/react';
import { ArrowRight, Users, Heart, Leaf } from 'lucide-react';
import { Button } from './ui/Button';
import { useBooking } from '../context/BookingContext';

// Imagem Real Adicionada
import heroImg from '../assets/hero.jpeg';

export default function Hero() {
  const { openBookingModal } = useBooking();

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-x-hidden">
      {/* Background decorative elements */}
      <div
        className="absolute top-[100px] right-[10%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-accent-light/50 -z-10"
        style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
      />
      <div
        className="absolute bottom-[10%] left-[5%] w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] bg-primary-light/30 -z-10"
        style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl text-center md:text-left"
        >
          <span className="text-[11px] uppercase tracking-[2px] text-accent mb-4 sm:mb-6 block font-semibold">
            Nutricionista clínica
          </span>
          <h1 className="text-[38px] xs:text-4xl sm:text-5xl md:text-[56px] font-display font-normal leading-[1.1] text-text mb-4 sm:mb-6">
            Sua saúde em <br />
            <span className="text-primary italic">equilíbrio</span>
          </h1>
          <p className="text-[14px] sm:text-[16px] text-text-muted mb-6 sm:mb-8 leading-[1.6] max-w-[400px] mx-auto md:mx-0">
            Acompanhamento nutricional personalizado, pensado para a sua rotina e seus objetivos.
            Aqui, você aprende a se alimentar com equilíbrio, sem radicalismos, construindo hábitos sustentáveis que promovem saúde, bem-estar e resultados reais ao longo do tempo.
          </p>

          {/* Metrics section 
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-light/40 rounded-lg text-primary">
                <Users size={18} />
              </div>
              <div>
                <p className="text-xl font-display font-bold text-text leading-tight">300+</p>
                <p className="text-[11px] text-text-muted uppercase tracking-wider">Pacientes</p>
              </div>
            </div>
            <div className="w-px h-10 bg-line"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-light/40 rounded-lg text-accent">
                <Heart size={18} />
              </div>
              <div>
                <p className="text-xl font-display font-bold text-text leading-tight">98%</p>
                <p className="text-[11px] text-text-muted uppercase tracking-wider">Satisfação</p>
              </div>
            </div>
          </div> */}

          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 items-center justify-center md:justify-start">
            <Button onClick={openBookingModal} icon={ArrowRight}>
              Agendar Consulta
            </Button>
            <Button as="a" href="#about" variant="ghost">
              Conhecer meu trabalho
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative mt-6 md:mt-0 w-full max-w-[320px] xs:max-w-[360px] sm:max-w-none mx-auto md:mx-0"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative aspect-[4/5] md:aspect-[3/4] rounded-tl-[80px] rounded-br-[80px] border border-line p-2 bg-surface overflow-hidden shadow-sm"
          >
            <img
              src={heroImg}
              alt="Daniele Alves - Nutricionista"
              className="w-full h-full object-cover object-top rounded-tl-[72px] rounded-br-[72px]"
            />
            <div className="absolute inset-2 bg-gradient-to-t from-black/10 to-transparent mix-blend-overlay rounded-tl-[72px] rounded-br-[72px]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="hidden xs:block absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 md:bottom-12 md:-left-12 bg-surface/90 backdrop-blur-sm p-[18px] sm:p-[25px] border border-line rounded-tl-[30px] rounded-br-[30px] shadow-lg max-w-[170px] sm:max-w-[200px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-light flex items-center justify-center text-accent shrink-0">
                <Leaf size={20} />
              </div>
              <p className="font-medium text-[12px] sm:text-[13px] leading-[1.3] text-text-muted">Foco no seu<br />Bem-estar</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

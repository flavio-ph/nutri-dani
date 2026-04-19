import { motion } from 'motion/react';
import { services } from '../constants';

export default function Services() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[2px] text-accent mb-4 block font-semibold">Especialidades</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-text mb-4">
            Como posso te <span className="text-primary italic">ajudar?</span>
          </h2>
          <p className="text-text-muted text-lg">
            Serviços desenhados para atender suas necessidades de forma individualizada e acolhedora.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface p-5 sm:p-8 rounded-[12px] border border-line relative hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-primary-light/50 rounded-2xl flex items-center justify-center text-primary-dark mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <service.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl font-normal text-primary mb-3">
                {service.title}
              </h3>
              <p className="text-[14px] text-text-muted mb-6 leading-[1.5]">
                {service.description}
              </p>
              
              <div className="space-y-4 pt-4 border-t border-line/50">
                <div>
                  <h4 className="text-[11px] font-semibold text-text uppercase tracking-wider mb-2">Benefícios</h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="text-[13.5px] text-text-muted flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2">
                  <h4 className="text-[11px] font-semibold text-text uppercase tracking-wider mb-1">Para quem é</h4>
                  <p className="text-[13.5px] text-text-muted">{service.forWho}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

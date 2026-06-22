import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { contactInfo } from '../constants';

/**
 * WhatsAppFAB — botão flutuante do WhatsApp (canto inferior direito).
 * Elemento essencial para sites de profissionais de saúde no Brasil.
 */
export default function WhatsAppFAB() {
  const message = 'Olá Daniele! Vim pelo site e gostaria de saber mais sobre as consultas. 😊';
  const url = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com Daniele pelo WhatsApp"
      title="Falar pelo WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-shadow"
    >
      {/* Pulso animado */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <MessageCircle size={26} className="relative z-10" />
    </motion.a>
  );
}

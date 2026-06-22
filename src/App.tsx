import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Schedule from './components/Schedule';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import { BookingProvider } from './context/BookingContext';
import DietBuilder from './components/DietBuilder/DietBuilder';
import WhatsAppFAB from './components/WhatsAppFAB';

// Simple client-side routing — no extra dependency needed
const isDietRoute = ['/dieta', '/diet'].includes(window.location.pathname);

export default function App() {
  if (isDietRoute) {
    return <DietBuilder />;
  }

  return (
    <BookingProvider>
      <div className="min-h-screen bg-background font-sans text-text selection:bg-primary/20 selection:text-primary-dark">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Schedule />
          {/* <Testimonials /> */}
          <Contact />
        </main>
        <Footer />
        <WhatsAppFAB />
      </div>
    </BookingProvider>
  );
}

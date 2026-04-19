import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Schedule from './components/Schedule';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { BookingProvider } from './context/BookingContext';

export default function App() {
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
      </div>
    </BookingProvider>
  );
}

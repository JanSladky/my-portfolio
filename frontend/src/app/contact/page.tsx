// src/app/contact/page.tsx
import SocialSidebar from '../../components/SocialSidebar';
import ContactForm from './ContactForm';

export const revalidate = 0;

export default function ContactPage() {
  return (
    <div className="bg-[#e9f0fb] min-h-screen w-full pt-[120px] pb-20 px-4 font-sans antialiased">
      <div className="max-w-4xl mx-auto backdrop-blur-2xl bg-white/10 border border-white/30 rounded-3xl shadow-2xl ring-1 ring-white/10 p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">Kontakt</h1>
        <SocialSidebar variant="inline" />
        <ContactForm />
      </div>
    </div>
  );
}
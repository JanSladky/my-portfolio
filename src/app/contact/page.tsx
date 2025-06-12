import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-[#0a192f] text-[#ccd6f6] pt-24 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 border-b-2 border-pink-600 inline-block">Kontakt</h1>
        <ContactForm />
      </div>
    </div>
  );
}
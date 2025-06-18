'use client';

import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import SocialSidebar from '../../components/SocialSidebar';

export default function ContactForm() {
  const [activeTab, setActiveTab] = useState<'client' | 'company'>('client');
  const [formClient, setFormClient] = useState({ name: '', email: '', phone: '', website_type: '', message: '' });
  const [formCompany, setFormCompany] = useState({ company: '', email: '', phone: '', website: '', tech_stack: '', message: '' });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isCompany = false) => {
    const { name, value } = e.target;
    isCompany ? setFormCompany((prev) => ({ ...prev, [name]: value })) : setFormClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setStatus('❌ Prosím potvrďte, že nejste robot.');
      return;
    }

    setStatus('⏳ Odesílám...');
    const payload = activeTab === 'client' ? { ...formClient, recaptchaToken, type: 'client' } : { ...formCompany, recaptchaToken, type: 'company' };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('✅ Zpráva byla úspěšně odeslána.');
        setFormClient({ name: '', email: '', phone: '', website_type: '', message: '' });
        setFormCompany({ company: '', email: '', phone: '', website: '', tech_stack: '', message: '' });
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
      } else {
        setStatus('❌ Došlo k chybě při odesílání.');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Chyba při odesílání.');
    }
  };

  return (
    <div className="bg-[#e9f0fb] min-h-screen w-full pt-[120px] pb-20 px-4 font-sans antialiased">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">Kontakt</h1>
        <SocialSidebar variant="inline" />
        {/* Tabs */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setActiveTab('client')}
            className={`px-6 py-2 rounded-full font-semibold ${activeTab === 'client' ? 'bg-blue-600 text-white' : 'bg-indigo-100 text-blue-600 hover:bg-indigo-200'} transition`}>
            Poptávka na web
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`px-6 py-2 rounded-full font-semibold ${activeTab === 'company' ? 'bg-blue-600 text-white' : 'bg-indigo-100 text-blue-600 hover:bg-indigo-200'} transition`}>
            Spolupráce / Nabídka práce
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {activeTab === 'client' ? (
            <>
              <input
                name="name"
                placeholder="Jméno"
                value={formClient.name}
                onChange={handleChange}
                required
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              />
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                value={formClient.email}
                onChange={handleChange}
                required
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Telefon"
                value={formClient.phone}
                onChange={handleChange}
                required
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              />

              <fieldset className="border border-gray-300 rounded-lg p-4">
                <legend className="text-blue-600 font-semibold">Typ webu</legend>
                {[
                  'Jednoduchý prezentační web bez redakčního systému',
                  'Vícestránkový web bez redakčního systému',
                  'Jednostránkový prezentační web s redakčním systémem',
                  'Vícestránkový web s redakčním systémem',
                ].map((option) => (
                  <label key={option} className="block text-gray-700 mt-2 cursor-pointer">
                    <input type="radio" name="website_type" value={option} checked={formClient.website_type === option} onChange={handleChange} className="mr-2 accent-blue-600" required />
                    {option}
                  </label>
                ))}
              </fieldset>

              <textarea
                name="message"
                placeholder="Doplňující zpráva"
                value={formClient.message}
                onChange={handleChange}
                rows={5}
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </>
          ) : (
            <>
              <input
                name="company"
                placeholder="Název firmy"
                value={formCompany.company}
                onChange={(e) => handleChange(e, true)}
                required
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              />
              <input
                name="email"
                type="email"
                placeholder="Kontaktní e-mail"
                value={formCompany.email}
                onChange={(e) => handleChange(e, true)}
                required
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Kontaktní telefon"
                value={formCompany.phone}
                onChange={(e) => handleChange(e, true)}
                required
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              />
              <input
                name="website"
                type="url"
                placeholder="Web firmy"
                value={formCompany.website}
                onChange={(e) => handleChange(e, true)}
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              />
              <input
                name="tech_stack"
                placeholder="Technologie (např. React, PHP, Node.js)"
                value={formCompany.tech_stack}
                onChange={(e) => handleChange(e, true)}
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              />
              <textarea
                name="message"
                placeholder="Doplňující informace"
                value={formCompany.message}
                onChange={(e) => handleChange(e, true)}
                rows={5}
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </>
          )}

          <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={(token) => setRecaptchaToken(token)} ref={recaptchaRef} />

          <button type="submit" className="bg-indigo-100 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-200 transition">
            Odeslat
          </button>
          {status && <p className="text-sm text-blue-500 mt-2">{status}</p>}
        </form>
      </div>
    </div>
  );
}

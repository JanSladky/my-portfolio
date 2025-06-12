'use client';

import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactForm() {
  const [activeTab, setActiveTab] = useState<'client' | 'company'>('client');
  const [formClient, setFormClient] = useState({
    name: '',
    email: '',
    phone: '',
    website_type: '',
    message: '',
  });
  const [formCompany, setFormCompany] = useState({
    company: '',
    email: '',
    phone: '',
    website: '',
    tech_stack: '',
    message: '',
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isCompany = false) => {
    const { name, value } = e.target;
    if (isCompany) {
      setFormCompany((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormClient((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setStatus('❌ Prosím potvrďte, že nejste robot.');
      return;
    }

    setStatus('⏳ Odesílám...');

    const payload =
      activeTab === 'client'
        ? { ...formClient, recaptchaToken, type: 'client' }
        : { ...formCompany, recaptchaToken, type: 'company' };

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
    <>
      {/* Záložky */}
      <div className="flex mb-6 space-x-2">
        <button
          onClick={() => setActiveTab('client')}
          className={`px-4 py-2 rounded-md font-semibold ${
            activeTab === 'client' ? 'bg-pink-600 text-white' : 'bg-[#112240] text-[#8892b0]'
          }`}
        >
          Poptávka na web
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-2 rounded-md font-semibold ${
            activeTab === 'company' ? 'bg-pink-600 text-white' : 'bg-[#112240] text-[#8892b0]'
          }`}
        >
          Spolupráce / Nabídka práce
        </button>
      </div>

      {/* Formulář */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {activeTab === 'client' ? (
          <>
            <input
              name="name"
              placeholder="Jméno"
              value={formClient.name}
              onChange={handleChange}
              required
              className="p-3 rounded-md bg-[#112240] text-[#ccd6f6] border border-gray-600 focus:outline-none focus:border-pink-600"
            />
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              value={formClient.email}
              onChange={handleChange}
              required
              className="p-3 rounded-md bg-[#112240] text-[#ccd6f6] border border-gray-600 focus:outline-none focus:border-pink-600"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Telefon"
              value={formClient.phone}
              onChange={handleChange}
              required
              className="p-3 rounded-md bg-[#112240] text-[#ccd6f6] border border-gray-600 focus:outline-none focus:border-pink-600"
            />
            <fieldset className="border border-gray-600 rounded-md p-4">
              <legend className="text-pink-500 font-semibold">Typ webu</legend>
              {[
                'Jednoduchý prezentační web bez redakčního systému',
                'Vícestránkový web bez redakčního systému',
                'Jednostránkový prezentační web s redakčním systémem',
                'Vícestránkový web s redakčním systémem',
              ].map((option) => (
                <label key={option} className="block text-[#8892b0] mt-2 cursor-pointer">
                  <input
                    type="radio"
                    name="website_type"
                    value={option}
                    checked={formClient.website_type === option}
                    onChange={handleChange}
                    className="mr-2 accent-pink-600"
                    required
                  />
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
              className="p-3 rounded-md bg-[#112240] text-[#ccd6f6] border border-gray-600 focus:outline-none focus:border-pink-600"
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
              className="p-3 rounded-md bg-[#112240] text-[#ccd6f6] border border-gray-600 focus:outline-none focus:border-pink-600"
            />
            <input
              name="email"
              type="email"
              placeholder="Kontaktní e-mail"
              value={formCompany.email}
              onChange={(e) => handleChange(e, true)}
              required
              className="p-3 rounded-md bg-[#112240] text-[#ccd6f6] border border-gray-600 focus:outline-none focus:border-pink-600"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Kontaktní telefon"
              value={formCompany.phone}
              onChange={(e) => handleChange(e, true)}
              required
              className="p-3 rounded-md bg-[#112240] text-[#ccd6f6] border border-gray-600 focus:outline-none focus:border-pink-600"
            />
            <input
              name="website"
              type="url"
              placeholder="Web firmy"
              value={formCompany.website}
              onChange={(e) => handleChange(e, true)}
              className="p-3 rounded-md bg-[#112240] text-[#ccd6f6] border border-gray-600 focus:outline-none focus:border-pink-600"
            />
            <input
              name="tech_stack"
              placeholder="Technologie (např. React, PHP, Node.js)"
              value={formCompany.tech_stack}
              onChange={(e) => handleChange(e, true)}
              className="p-3 rounded-md bg-[#112240] text-[#ccd6f6] border border-gray-600 focus:outline-none focus:border-pink-600"
            />
            <textarea
              name="message"
              placeholder="Doplňující informace"
              value={formCompany.message}
              onChange={(e) => handleChange(e, true)}
              rows={5}
              className="p-3 rounded-md bg-[#112240] text-[#ccd6f6] border border-gray-600 focus:outline-none focus:border-pink-600"
            />
          </>
        )}

        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={(token) => setRecaptchaToken(token)}
          ref={recaptchaRef}
        />

        <button
          type="submit"
          className="bg-pink-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-pink-700 transition"
        >
          Odeslat
        </button>

        {status && <p className="text-sm text-pink-400 mt-2">{status}</p>}
      </form>
    </>
  );
}
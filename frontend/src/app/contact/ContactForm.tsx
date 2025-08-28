// src/app/contact/ContactForm.tsx
'use client';

import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { postToStrapi } from '../../lib/strapiClient';

type Tab = 'client' | 'company';

export default function ContactForm() {
  const [activeTab, setActiveTab] = useState<Tab>('client');

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isCompany = false
  ) => {
    const { name, value } = e.target;
    if (isCompany) setFormCompany((p) => ({ ...p, [name]: value }));
    else setFormClient((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setStatus('❌ Prosím potvrďte, že nejste robot.');
      return;
    }

    setIsSubmitting(true);
    setStatus('⏳ Odesílám...');

    const payload =
      activeTab === 'client'
        ? { ...formClient, recaptchaToken, type: 'client' as const }
        : { ...formCompany, recaptchaToken, type: 'company' as const };

    try {
      await postToStrapi('/api/contact/submit', payload);

      setStatus('✅ Zpráva byla úspěšně odeslána.');
      setFormClient({ name: '', email: '', phone: '', website_type: '', message: '' });
      setFormCompany({ company: '', email: '', phone: '', website: '', tech_stack: '', message: '' });
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Došlo k chybě při odesílání: ${err?.message || 'Neznámá chyba'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Záložky */}
      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={() => setActiveTab('client')}
          className={`btn-glass font-semibold ${activeTab === 'client' ? 'tab-btn-glass' : 'btn-primary-light'}`}
        >
          <span className="btn-primary-inner">Poptávka na web</span>
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`btn-glass font-semibold ${activeTab === 'company' ? 'tab-btn-glass' : 'btn-primary-light'}`}
        >
          <span className="btn-primary-inner">Spolupráce / Nabídka práce</span>
        </button>
      </div>

      {/* Formulář */}
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
                  <input
                    type="radio"
                    name="website_type"
                    value={option}
                    checked={formClient.website_type === option}
                    onChange={handleChange}
                    className="mr-2 accent-blue-600"
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

        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={(token) => setRecaptchaToken(token)}
          ref={recaptchaRef}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-glass btn-primary-light disabled:opacity-60"
        >
          <span className="btn-primary-inner">{isSubmitting ? 'Odesílám…' : 'Odeslat'}</span>
        </button>

        {status && <p className="text-sm text-blue-500 mt-2">{status}</p>}
      </form>
    </>
  );
}
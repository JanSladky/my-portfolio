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

  // --- malí pomocníci pro jednotné styly
  const inputCls =
    'h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500';
  const areaCls =
    'min-h-[120px] p-3 rounded-md border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500';

  return (
    <>
      {/* Záložky */}
      <div className="flex justify-center mb-5 gap-3">
        <button
          onClick={() => setActiveTab('client')}
          className={`btn-glass text-sm font-semibold ${activeTab === 'client' ? 'tab-btn-glass' : 'btn-primary-light'}`}
        >
          <span className="btn-primary-inner">Poptávka na web</span>
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`btn-glass text-sm font-semibold ${activeTab === 'company' ? 'tab-btn-glass' : 'btn-primary-light'}`}
        >
          <span className="btn-primary-inner">Spolupráce / Nabídka práce</span>
        </button>
      </div>

      {/* Formulář – kompaktní, 2 sloupce na ≥md */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'client' ? (
          <>
            {/* Grid 2 sloupce */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="name"
                placeholder="Jméno"
                autoComplete="name"
                value={formClient.name}
                onChange={handleChange}
                required
                className={inputCls}
              />
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                autoComplete="email"
                value={formClient.email}
                onChange={handleChange}
                required
                className={inputCls}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Telefon"
                autoComplete="tel"
                value={formClient.phone}
                onChange={handleChange}
                required
                className={inputCls}
              />

              {/* Radio skupina – 2 sloupce na md */}
              <fieldset className="md:col-span-2 border border-gray-200 rounded-md px-3 py-2">
                <legend className="text-blue-600 font-medium text-sm px-1">Typ webu</legend>
                <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Jednoduchý prezentační web bez redakčního systému',
                    'Vícestránkový web bez redakčního systému',
                    'Jednostránkový prezentační web s redakčním systémem',
                    'Vícestránkový web s redakčním systémem',
                  ].map((option) => (
                    <label key={option} className="flex items-start gap-2 text-[0.95rem] text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="website_type"
                        value={option}
                        checked={formClient.website_type === option}
                        onChange={handleChange}
                        className="mt-1 accent-blue-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <textarea
                name="message"
                placeholder="Doplňující zpráva"
                value={formClient.message}
                onChange={handleChange}
                className={`${areaCls} md:col-span-2`}
              />
            </div>
          </>
        ) : (
          <>
            {/* Grid 2 sloupce */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="company"
                placeholder="Název firmy"
                autoComplete="organization"
                value={formCompany.company}
                onChange={(e) => handleChange(e, true)}
                required
                className={inputCls}
              />
              <input
                name="email"
                type="email"
                placeholder="Kontaktní e-mail"
                autoComplete="email"
                value={formCompany.email}
                onChange={(e) => handleChange(e, true)}
                required
                className={inputCls}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Kontaktní telefon"
                autoComplete="tel"
                value={formCompany.phone}
                onChange={(e) => handleChange(e, true)}
                required
                className={inputCls}
              />
              <input
                name="website"
                type="url"
                placeholder="Web firmy (volitelné)"
                value={formCompany.website}
                onChange={(e) => handleChange(e, true)}
                className={inputCls}
              />
              <input
                name="tech_stack"
                placeholder="Technologie (např. React, PHP, Node.js)"
                value={formCompany.tech_stack}
                onChange={(e) => handleChange(e, true)}
                className={`md:col-span-2 ${inputCls}`}
              />
              <textarea
                name="message"
                placeholder="Doplňující informace"
                value={formCompany.message}
                onChange={(e) => handleChange(e, true)}
                className={`${areaCls} md:col-span-2`}
              />
            </div>
          </>
        )}

        {/* reCAPTCHA menší mezery a centrování */}
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setRecaptchaToken(token)}
            ref={recaptchaRef}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-glass btn-primary-light disabled:opacity-60"
          >
            <span className="btn-primary-inner">{isSubmitting ? 'Odesílám…' : 'Odeslat'}</span>
          </button>
        </div>

        {status && <p className="text-center text-sm text-blue-600">{status}</p>}
      </form>
    </>
  );
}
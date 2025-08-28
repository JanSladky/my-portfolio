// backend/src/api/contact/controllers/contact.ts
import { factories } from '@strapi/strapi';
import nodemailer from 'nodemailer';

const adminHtml = (b: any) => {
  const isCompany = b.type === 'company';
  const displayName = isCompany ? b.company : b.name;
  const displayWebsite = isCompany ? b.website : b.company_website;

  return isCompany
    ? `
    <div style="background:#e6f0fa;padding:32px;border-radius:8px;font-family:sans-serif;color:#111;">
      <h2 style="color:#1a4a7f;">📬 Nová nabídka spolupráce</h2>
      <p><strong>Název firmy:</strong><br/>${displayName || '-'}</p>
      <p><strong>E-mail:</strong><br/>${b.email}</p>
      <p><strong>Telefon:</strong><br/>${b.phone || '-'}</p>
      <p><strong>Web firmy:</strong><br/>${displayWebsite || '-'}</p>
      <p><strong>Tech stack:</strong><br/>${b.tech_stack || '-'}</p>
      <p><strong>Doplňující informace:</strong><br/>${b.message || '-'}</p>
    </div>`
    : `
    <div style="background:#e6f0fa;padding:32px;border-radius:8px;font-family:sans-serif;color:#111;">
      <h2 style="color:#1a4a7f;">📥 Nová poptávka na web</h2>
      <p><strong>Jméno:</strong><br/>${displayName || '-'}</p>
      <p><strong>E-mail:</strong><br/>${b.email}</p>
      <p><strong>Telefon:</strong><br/>${b.phone || '-'}</p>
      <p><strong>Typ webu:</strong><br/>${b.website_type || '-'}</p>
      <p><strong>Doplňující zpráva:</strong><br/>${b.message || '-'}</p>
    </div>`;
};

const userHtml = (b: any) => {
  const isCompany = b.type === 'company';
  return isCompany
    ? `
    <div style="background:#e6f0fa;padding:32px;border-radius:8px;font-family:sans-serif;color:#111;">
      <h2 style="color:#1a4a7f;">Děkuji za nabídku spolupráce!</h2>
      <p>V brzké době se Vám ozvu.</p>
      <p>S pozdravem,<br/><strong>Jan Sladký</strong><br/>
      <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a><br/>
      <a href="https://www.jansladky.eu">www.jansladky.eu</a></p>
    </div>`
    : `
    <div style="background:#e6f0fa;padding:32px;border-radius:8px;font-family:sans-serif;color:#111;">
      <h2 style="color:#1a4a7f;">Děkujeme za Vaši poptávku!</h2>
      <p>Vaše zpráva dorazila v pořádku. Brzy se ozvu.</p>
      <p>S pozdravem,<br/><strong>Jan Sladký</strong><br/>
      <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a><br/>
      <a href="https://www.jansladky.eu">www.jansladky.eu</a></p>
    </div>`;
};

export default factories.createCoreController(
  'api::contact-submission.contact-submission' as any, // 👈 ukecání UID pro TS
  ({ strapi }) => ({
    async submit(ctx) {
      const b = (ctx.request as any).body || {};

      // 1) jednoduchá validace
      if (!b?.email || !b?.type || !['client', 'company'].includes(b.type)) {
        return ctx.badRequest('Invalid payload');
      }
      if (!b?.recaptchaToken) {
        return ctx.badRequest('Missing reCAPTCHA token');
      }

      // 2) ověření reCAPTCHA
      const secret = process.env.RECAPTCHA_SECRET_KEY || '';
      const resp: any = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(b.recaptchaToken)}`
      })
        .then(r => r.json())
        .catch(() => ({}));

      if (!resp?.success) {
        return ctx.forbidden('reCAPTCHA failed');
      }

      // 3) uložení do DB
      const dataToSave = {
        type: b.type,
        name: b.name || null,
        company: b.company || null,
        email: b.email,
        phone: b.phone || null,
        website_type: b.website_type || null,
        website: b.website || b.company_website || null,
        tech_stack: b.tech_stack || null,
        message: b.message || null,
        ip: (ctx as any).ip,
        user_agent: ctx.request.headers['user-agent'] || ''
      };

      await (strapi.entityService as any).create(
        'api::contact-submission.contact-submission',
        { data: dataToSave }
      );

      // 4) e-maily přes nodemailer (plugin není potřeba)
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 465),
        secure: String(process.env.EMAIL_SECURE) !== 'false',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      const adminTo = process.env.EMAIL_TO || process.env.EMAIL_USER;
      const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

      await transporter.sendMail({
        from,
        to: adminTo,
        replyTo: b.email,
        subject: b.type === 'company' ? 'Nabídka spolupráce' : 'Nová poptávka na web',
        html: adminHtml(b)
      });

      await transporter.sendMail({
        from,
        to: b.email,
        subject: b.type === 'company' ? 'Děkujeme za nabídku spolupráce' : 'Vaše poptávka byla přijata',
        html: userHtml(b)
      });

      ctx.send({ ok: true });
    },
  })
);
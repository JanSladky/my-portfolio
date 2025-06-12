import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ✅ reCAPTCHA ověření s logy
async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  console.log('✅ Ověřuji token:', token);

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await response.json();
  console.log('🔁 RECAPTCHA RESPONSE:', data);
  return data.success;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('📨 API REQUEST BODY:', body);

  const {
    name,
    email,
    phone,
    message,
    website_type,
    company_website,
    tech_stack,
    type, // 'client' nebo 'company'
    recaptchaToken,
    company,
    website,
  } = body;

  const displayName = type === 'company' ? company : name;
  const displayWebsite = type === 'company' ? website : company_website;

  if (!recaptchaToken) {
    return NextResponse.json({ message: 'Chybí reCAPTCHA token.' }, { status: 400 });
  }

  const isHuman = await verifyCaptcha(recaptchaToken);
  if (!isHuman) {
    return NextResponse.json({ message: 'reCAPTCHA ověření selhalo.' }, { status: 403 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const isCompany = type === 'company';

  const htmlToAdmin = isCompany
    ? `
    <div style="background:#e6f0fa;padding:32px;border-radius:8px;font-family:sans-serif;color:#111;">
      <h2 style="color:#1a4a7f;">📬 Nová nabídka spolupráce</h2>
      <p><strong>Název firmy:</strong><br/>${displayName}</p>
      <p><strong>E-mail:</strong><br/><a href="mailto:${email}" style="color:#1a4a7f;">${email}</a></p>
      <p><strong>Telefon:</strong><br/>${phone}</p>
      <p><strong>Web firmy:</strong><br/><a href="${displayWebsite}" style="color:#1a4a7f;">${displayWebsite}</a></p>
      <p><strong>Tech stack:</strong><br/>${tech_stack || '<em>neuvedeno</em>'}</p>
      <p><strong>Doplňující informace:</strong><br/>${message || '<em>neuvedeno</em>'}</p>
      <hr style="margin:24px 0;border:0;height:1px;background:#ccc;" />
       <a href="https://www.jansladky.eu" target="_blank" style="display:inline-block;margin-bottom:24px;">
        <img src="https://www.jansladky.eu/logo3.png" alt="JS Weby logo" style="height:50px;" />
      </a>
      <p style="font-size:13px;color:#444;">Tento e-mail byl odeslán z kariérního formuláře na webu <strong><a href="https://www.jansladky.eu" style="color:#1a4a7f;">jansladky.eu</a></strong>.</p>
    </div>
  `
    : `
    <div style="background:#e6f0fa;padding:32px;border-radius:8px;font-family:sans-serif;color:#111;">
      <h2 style="color:#1a4a7f;">📥 Nová poptávka na web</h2>
      <p><strong>Jméno:</strong><br/>${displayName}</p>
      <p><strong>E-mail:</strong><br/><a href="mailto:${email}" style="color:#1a4a7f;">${email}</a></p>
      <p><strong>Telefon:</strong><br/>${phone}</p>
      <p><strong>Typ webu:</strong><br/><span style="color:#444;">${website_type}</span></p>
      <p><strong>Doplňující zpráva:</strong><br/>${message || '<em>neuvedeno</em>'}</p>
      <hr style="margin:24px 0;border:0;height:1px;background:#ccc;" />
        <a href="https://www.jansladky.eu" target="_blank" style="display:inline-block;margin-bottom:24px;">
        <img src="https://www.jansladky.eu/logo3.png" alt="JS Weby logo" style="height:50px;" />
      </a>
      <p style="font-size:13px;color:#444;">Tento e-mail byl odeslán z kontaktního formuláře na webu <strong><a href="https://www.jansladky.eu" style="color:#1a4a7f;">jansladky.eu</a></strong>.</p>
    </div>
  `;

  const htmlToUser = isCompany
    ? `
    <div style="background:#e6f0fa;padding:32px;border-radius:8px;font-family:sans-serif;color:#111;">
      <h2 style="color:#1a4a7f;">Děkuji za nabídku spolupráce!</h2>
      <p>Velice si vážím Vaší nabídky spolupráce. V brzké době se Vám ozvu.</p>
      <hr style="margin:24px 0;border:0;height:1px;background:#ccc;" />
      <p style="line-height:1.6;">
        S pozdravem,<br />
        <strong>Jan Sladký</strong><br/>
        <a href="mailto:${process.env.EMAIL_USER}" style="color:#1a4a7f;">${process.env.EMAIL_USER}</a><br/>
        <a href="https://www.jansladky.eu" target="_blank" style="color:#1a4a7f;">www.jansladky.eu</a>
      </p>
       <a href="https://www.jansladky.eu" target="_blank" style="display:inline-block;margin-bottom:24px;">
        <img src="https://www.jansladky.eu/logo3.png" alt="JS Weby logo" style="height:50px;" />
      </a>
      <p style="font-size:12px;color:#444;margin-top:24px;">Tento e-mail byl automaticky odeslán z kariérního formuláře na webu jansladky.eu</p>
    </div>
  `
    : `
    <div style="background:#e6f0fa;padding:32px;border-radius:8px;font-family:sans-serif;color:#111;">
      <h2 style="color:#1a4a7f;">Děkujeme za Vaši poptávku!</h2>
      <p>Děkujeme, že jste mě kontaktovali ohledně tvorby webových stránek. Vaše zpráva dorazila v pořádku.</p>
      <p>Brzy se Vám ozvu, abychom probrali detaily a možnosti spolupráce.</p>
      <hr style="margin:24px 0;border:0;height:1px;background:#ccc;" />
      <p style="line-height:1.6;">
        S pozdravem,<br />
        <strong>Jan Sladký</strong><br/>
        <a href="mailto:${process.env.EMAIL_USER}" style="color:#1a4a7f;">${process.env.EMAIL_USER}</a><br/>
        <a href="https://www.jansladky.eu" target="_blank" style="color:#1a4a7f;">www.jansladky.eu</a>
      </p>
        <a href="https://www.jansladky.eu" target="_blank" style="display:inline-block;margin-bottom:24px;">
        <img src="https://www.jansladky.eu/logo3.png" alt="JS Weby logo" style="height:50px;" />
      </a>
      <p style="font-size:12px;color:#444;margin-top:24px;">Tento e-mail byl automaticky odeslán z kontaktního formuláře na webu jansladky.eu</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${displayName}" <${email}>`,
      to: process.env.EMAIL_TO,
      subject: isCompany ? 'Nabídka spolupráce' : 'Nová poptávka na web',
      html: htmlToAdmin,
    });

    await transporter.sendMail({
      from: `"Jan Sladký" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: isCompany ? 'Děkujeme za nabídku spolupráce' : 'Vaše poptávka byla přijata',
      html: htmlToUser,
    });

    return NextResponse.json({ message: 'Úspěšně odesláno' }, { status: 200 });
  } catch (err) {
    console.error('❌ Chyba při odesílání e-mailu:', err);
    return NextResponse.json({ message: 'Chyba při odesílání e-mailu' }, { status: 500 });
  }
}

import './SocialFollowLoop.css';

const socialLinks = [
  {
    name: 'X',
    href: 'https://x.com/diasporanri',
    color: '#f8fafc',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.9h1.73L8.28 3.98H6.42L17.8 19.9Z" />
      </svg>
    )
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/diasporanri/',
    color: '#f472b6',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className="social-follow-loop__fill" />
      </svg>
    )
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61595642654151',
    color: '#60a5fa',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 21v-8h2.75l.42-3h-3.17V8.08c0-.87.24-1.46 1.5-1.46h1.8V3.94c-.31-.04-1.38-.14-2.62-.14-2.59 0-4.36 1.58-4.36 4.48V10H7v3h2.82v8h3.68Z" />
      </svg>
    )
  },
  {
    name: 'WhatsApp Channel',
    href: 'https://whatsapp.com/channel/0029VbEFPa3GufIpcIg9wh2J',
    color: '#4ade80',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.85-1.27A9.5 9.5 0 1 0 12 2.5Zm0 17.2a7.7 7.7 0 0 1-3.92-1.07l-.28-.17-2.88.75.77-2.8-.18-.29A7.7 7.7 0 1 1 12 19.7Zm4.22-5.77c-.23-.12-1.35-.67-1.56-.75-.21-.08-.36-.12-.51.12-.15.23-.59.75-.72.9-.13.15-.27.17-.5.06-1.35-.67-2.24-1.2-3.13-2.69-.24-.41.24-.38.69-1.27.08-.15.04-.28-.02-.4-.06-.12-.51-1.23-.7-1.69-.18-.44-.36-.38-.5-.39h-.42c-.15 0-.4.06-.61.29-.21.23-.8.78-.8 1.9s.82 2.2.93 2.35c.11.15 1.61 2.46 3.9 3.45 1.45.63 2.02.68 2.74.57.44-.07 1.35-.55 1.54-1.08.19-.53.19-.98.13-1.08-.05-.1-.2-.16-.43-.28Z" />
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    color: '#93c5fd',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5.2 3.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.4 9h3.6v11.5H3.4V9Zm5.8 0h3.45v1.57h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.5v6.28h-3.6v-5.57c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.67H9.2V9Z" />
      </svg>
    )
  }
];

function SocialIcon({ social }) {
  const content = (
    <>
      <span className="social-follow-loop__icon" style={{ '--social-color': social.color }}>
        {social.icon}
      </span>
      <span className="social-follow-loop__name">{social.name}</span>
    </>
  );

  if (!social.href) {
    return (
      <span className="social-follow-loop__item social-follow-loop__item--disabled" title="LinkedIn link coming soon" aria-label="LinkedIn link coming soon">
        {content}
      </span>
    );
  }

  return (
    <a className="social-follow-loop__item" href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`Follow DiasporaNRI on ${social.name}`}>
      {content}
    </a>
  );
}

export default function SocialFollowLoop() {
  return (
    <section className="social-follow-loop" aria-label="Social media links">
      <div className="social-follow-loop__heading">
        <span className="social-follow-loop__line" />
        <h2>Follow us on</h2>
        <span className="social-follow-loop__line" />
      </div>
      <div className="social-follow-loop__viewport">
        <div className="social-follow-loop__track">
          <div className="social-follow-loop__group">
            {socialLinks.map((social) => <SocialIcon key={social.name} social={social} />)}
          </div>
          <div className="social-follow-loop__group" aria-hidden="true">
            {socialLinks.map((social) => <SocialIcon key={`duplicate-${social.name}`} social={social} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

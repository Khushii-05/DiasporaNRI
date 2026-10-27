import { useEffect, useState } from 'react';
import { getAnnouncements } from '../services/announcementService';
import './AnnouncementBar.css';

const fallbackAnnouncement = 'Trusted support for NRIs across property, legal, documentation, and banking.';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    let active = true;
    getAnnouncements()
      .then((items) => {
        if (active) setAnnouncements(items);
      })
      .catch((error) => {
        console.error('Failed to load announcements:', error);
      });

    return () => {
      active = false;
    };
  }, []);

  const messages = announcements.length
    ? announcements.map((announcement) => announcement.text)
    : [fallbackAnnouncement];
  const tickerContent = messages.flatMap((message, index) => [
    <span key={`message-${index}`}>{message}</span>,
    <span key={`separator-${index}`} className="announcement-bar__separator" aria-hidden="true">✦</span>
  ]);

  return (
    <aside className="announcement-bar" aria-label="Announcements">
      <div className="announcement-bar__label">
        <span className="announcement-bar__dot" aria-hidden="true" />
        Announcement
      </div>
      <div className="announcement-bar__viewport">
        <div className="announcement-bar__track">
          <div className="announcement-bar__group">{tickerContent}</div>
          <div className="announcement-bar__group" aria-hidden="true">{tickerContent}</div>
        </div>
      </div>
    </aside>
  );
}

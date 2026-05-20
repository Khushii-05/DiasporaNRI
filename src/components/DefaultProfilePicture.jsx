export default function DefaultProfilePicture({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M12 14c-5.523 0-8 2.686-8 6v2h16v-2c0-3.314-2.477-6-8-6z" />
    </svg>
  );
}

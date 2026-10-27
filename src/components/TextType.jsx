import { useEffect, useMemo, useState } from 'react';
import './TextType.css';

export default function TextType({
  text,
  as: Component = 'span',
  typingSpeed = 55,
  initialDelay = 250,
  pauseDuration = 1800,
  deletingSpeed = 35,
  loop = true,
  showCursor = true,
  cursorStyle = 'bar',
  className = ''
}) {
  const textItems = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [textIndex, setTextIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReduceMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const currentText = String(textItems[textIndex] ?? '');
    const isComplete = characterCount === currentText.length;
    const isEmpty = characterCount === 0;
    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && isComplete) {
      if (!loop && textIndex === textItems.length - 1) return undefined;
      delay = pauseDuration;
    } else if (isDeleting && isEmpty) {
      delay = initialDelay;
    }

    const timeout = window.setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true);
      } else if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setTextIndex((currentIndex) => (currentIndex + 1) % textItems.length);
      } else {
        setCharacterCount((count) => count + (isDeleting ? -1 : 1));
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [
    characterCount,
    deletingSpeed,
    initialDelay,
    isDeleting,
    loop,
    pauseDuration,
    reduceMotion,
    textIndex,
    textItems,
    typingSpeed
  ]);

  const currentText = String(textItems[textIndex] ?? '');
  const visibleText = reduceMotion ? currentText : currentText.slice(0, characterCount);

  return (
    <Component className={`text-type ${className}`.trim()} aria-label={currentText}>
      <span aria-hidden="true">{visibleText}</span>
      {showCursor && (
        <span className={`text-type__cursor text-type__cursor--${cursorStyle}`} aria-hidden="true" />
      )}
    </Component>
  );
}

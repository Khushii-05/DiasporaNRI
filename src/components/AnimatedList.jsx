import { useState } from 'react';
import './AnimatedList.css';

export default function AnimatedList({ items, onItemSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const selectItem = (item, index) => {
    setSelectedIndex(index);
    onItemSelect?.(item, index);
  };

  return (
    <div className="animated-list" role="listbox" aria-label="Services">
      {items.map((item, index) => {
        const selected = selectedIndex === index;

        return (
          <button
            key={item.title}
            type="button"
            className={`animated-list__item${selected ? ' animated-list__item--selected' : ''}`}
            style={{ '--animated-list-index': index }}
            onClick={() => selectItem(item, index)}
            onMouseEnter={() => setSelectedIndex(index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                selectItem(item, index);
              }
            }}
            role="option"
            aria-selected={selected}
          >
            <span className="animated-list__index">{String(index + 1).padStart(2, '0')}</span>
            <span className="animated-list__content">
              <span className="animated-list__title">{item.title}</span>
              <span className="animated-list__description">{item.description}</span>
              <span className="animated-list__features">
                {item.features.map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </span>
            </span>
            <span className="animated-list__arrow" aria-hidden="true">↗</span>
          </button>
        );
      })}
    </div>
  );
}

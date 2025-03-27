import React, { useEffect, useRef } from 'react';
import './LunchRegistration.css';

export default function LunchRegistration() {
  const buttonRef = useRef<HTMLButtonElement | null>(null); // Sử dụng React Ref
  let stars: HTMLDivElement[] = [];

  useEffect(() => {
    const button = buttonRef.current;

    if (!button) return;

    const handleMouseOver = () => {
      removeStars();
      for (let i = 0; i < 5; i++) {
        let star = document.createElement('div');
        star.classList.add('stars');
        if (Math.random() > 0.5) star.classList.add('large');
        document.body.appendChild(star);

        let buttonRect = button.getBoundingClientRect();
        let startX = Math.random() * buttonRect.width + buttonRect.left;
        let startY = Math.random() * buttonRect.height + buttonRect.top;

        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;

        setTimeout(() => {
          let angle = Math.random() * 2 * Math.PI;
          let distance = Math.random() * 50 + 20;
          let moveX = Math.cos(angle) * distance;
          let moveY = Math.sin(angle) * distance;
          star.style.transform = `rotate(45deg) translate(${moveX}px, ${moveY}px)`;
          star.style.opacity = '1';
        }, 50);

        stars.push(star);
      }
    };

    const handleMouseLeave = () => {
      removeStars();
    };

    button.addEventListener('mouseover', handleMouseOver);
    button.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup sự kiện khi thành phần bị hủy
    return () => {
      button.removeEventListener('mouseover', handleMouseOver);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  function removeStars() {
    stars.forEach(star => {
      star.style.opacity = '0';
      setTimeout(() => star.remove(), 500);
    });
    stars = [];
  }

  return (
    <div className="container">
      <div className="box">
        <button id="glowButton" ref={buttonRef}>
          Click Me
        </button>
      </div>
    </div>
  );
}

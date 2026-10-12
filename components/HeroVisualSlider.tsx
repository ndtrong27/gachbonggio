'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface HeroSlideItem {
  id: string;
  category: string;
  badge: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  tag: string;
  link: string;
}

interface HeroVisualSliderProps {
  slides: HeroSlideItem[];
  intervalMs?: number;
}

export default function HeroVisualSlider({
  slides,
  intervalMs = 4000,
}: HeroVisualSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto rotate timer
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, slides.length, intervalMs, nextSlide]);

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="hero-slider-wrap"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Luân phiên sản phẩm tiêu biểu"
    >
      <div className="hero-card-featured hero-slider-card">
        {/* Category Overlay Badge */}
        <div className="hero-badge-overlay">
          <span className="pulse-dot" aria-hidden="true" />
          <span>{currentSlide.badge}</span>
        </div>

        {/* Image Container with Cross-Fade */}
        <div className="hero-slider-image-viewport">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.id}
                className={`hero-slider-slide ${isActive ? 'active' : ''}`}
                aria-hidden={!isActive}
              >
                <Image
                  src={slide.imageUrl}
                  alt={`${slide.name} - ${slide.category}`}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            );
          })}

          {/* Prev / Next manual controls */}
          <button
            type="button"
            className="hero-slider-nav-btn prev"
            onClick={prevSlide}
            aria-label="Sản phẩm trước"
          >
            &#8249;
          </button>
          <button
            type="button"
            className="hero-slider-nav-btn next"
            onClick={nextSlide}
            aria-label="Sản phẩm kế tiếp"
          >
            &#8248;
          </button>
        </div>

        {/* Slide Info & Action */}
        <div className="hero-slider-info">
          <div className="hero-slider-text">
            <div className="hero-slider-category-tag">
              {currentSlide.category}
            </div>
            <h4 className="hero-slider-product-name">{currentSlide.name}</h4>
            <p className="hero-slider-subtitle">{currentSlide.subtitle}</p>
          </div>

          <Link href={currentSlide.link} className="btn btn-primary hero-slider-action-btn">
            {currentSlide.tag} &darr;
          </Link>
        </div>

        {/* Interactive Indicator Dots */}
        <div className="hero-slider-dots">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                className={`hero-slider-dot ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Xem ${slide.category}`}
              >
                <span className="dot-pill" />
                <span className="dot-label">{slide.category.replace('Bông gió ', '')}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

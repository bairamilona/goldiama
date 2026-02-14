import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  blurDataURL?: string;
  objectFit?: 'cover' | 'contain';
  aspectRatio?: string;
  width?: number;  // ✨ Явная ширина для предотвращения CLS
  height?: number; // ✨ Явная высота для предотвращения CLS
  priority?: boolean; // ✨ Для hero и critical изображений
  webpSrc?: string; // ✨ WebP версия
  avifSrc?: string; // ✨ AVIF версия (еще лучше сжатие)
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  blurDataURL,
  objectFit = 'cover',
  aspectRatio = '1/1',
  width,
  height,
  priority = false,
  webpSrc,
  avifSrc
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // priority изображения грузятся сразу
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Если priority - не используем IntersectionObserver
    if (priority) return;
    
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Начинаем загружать за 200px
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div 
      ref={imgRef}
      className={`relative ${className}`}
      style={{
        // Резервируем место для изображения (предотвращает CLS)
        ...(width && height ? { aspectRatio: `${width}/${height}` } : {})
      }}
    >
      {/* Placeholder пока грузится */}
      {!isLoaded && blurDataURL && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url(${blurDataURL})` }}
        />
      )}

      {/* Main Image с поддержкой modern formats */}
      {isInView && (
        <picture>
          {/* AVIF - лучшее сжатие (Chrome 85+, Firefox 93+) */}
          {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
          
          {/* WebP - хорошее сжатие (все современные браузеры) */}
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          
          {/* PNG/JPG fallback для старых браузеров */}
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'} // priority грузится немедленно
            onLoad={() => setIsLoaded(true)}
            width={width}
            height={height}
            className="w-full h-full"
            style={{
              objectFit,
              objectPosition: 'center'
            }}
          />
        </picture>
      )}
    </div>
  );
}
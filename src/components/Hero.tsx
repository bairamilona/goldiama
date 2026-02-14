import { useState, useEffect, useRef, memo } from "react";
import "./Hero.css";

const GoldiamaHero = memo(function GoldiamaHero() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const hasScrolledRef = useRef(false);
  const targetVideoTimeRef = useRef(0);
  const [isInitialized, setIsInitialized] = useState(false); // ✅ Отложенная инициализация

  // ✅ Отложенная инициализация - запускаем через 100ms после монтирования
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Loop первых 8 кадров видео (туда-обратно) - только когда НЕ было скролла
  useEffect(() => {
    if (!isInitialized) return; // ✅ Не запускаем до инициализации
    
    const video = videoRef.current;
    if (!video || scrollProgress > 0 || hasScrolledRef.current) return;

    let animationId: number;
    const loopDuration = 0.27;
    let startTime = Date.now();
    let isDriftActive = false;

    const animateVideo = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = (elapsed % 4) / 4;
      const eased = -(Math.cos(Math.PI * progress) - 1) / 2;
      
      video.currentTime = eased * loopDuration;
      animationId = requestAnimationFrame(animateVideo);
    };

    const startAnimation = () => {
      if (!isDriftActive) {
        video.pause();
        video.classList.add('goldiama-hero__video--drift');
        isDriftActive = true;
        animateVideo();
      }
    };

    if (video.readyState >= 2) {
      startAnimation();
    } else {
      video.addEventListener('loadeddata', startAnimation, { once: true });
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      video.classList.remove('goldiama-hero__video--drift');
    };
  }, [scrollProgress, isInitialized]);

  // Эффект "люка" с трёхслойным параллаксом + синхронизация видео
  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const hero = heroRef.current;
        const content = contentRef.current;
        const video = videoRef.current;
        if (!hero) return;

        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        const progress = Math.min(scrollY / vh, 1);
        
        setScrollProgress(progress);
        
        // Hero уезжает быстрее (скорость 2x)
        const heroSpeed = 2;
        const heroTranslateY = Math.min((scrollY / vh) * 100 * heroSpeed, 100);
        hero.style.transform = `translateY(-${heroTranslateY}vh)`;
        
        // Контент уезжает медленнее (скорость 0.5x)
        if (content) {
          const contentSpeed = 0.5;
          const contentTranslateY = (scrollY / vh) * 100 * contentSpeed;
          content.style.transform = `translateY(-${contentTranslateY}vh)`;
        }
        
        // Синхронизация видео со скроллом
        if (video && video.duration && !isNaN(video.duration)) {
          video.pause();
          video.classList.remove('goldiama-hero__video--drift');
          
          const videoSpeed = 4;
          targetVideoTimeRef.current = Math.min(progress * video.duration * videoSpeed, video.duration);
        }
        
        hasScrolledRef.current = true;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Плавная интерполяция времени видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationId: number;

    const smoothVideoUpdate = () => {
      if (!hasScrolledRef.current) {
        animationId = requestAnimationFrame(smoothVideoUpdate);
        return;
      }

      const targetTime = targetVideoTimeRef.current;
      const currentTime = video.currentTime;
      const lerpFactor = 0.6;
      const newTime = currentTime + (targetTime - currentTime) * lerpFactor;
      
      video.currentTime = newTime;
      animationId = requestAnimationFrame(smoothVideoUpdate);
    };

    smoothVideoUpdate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const handleFilmClick = () => {
    setShowVideoModal(true);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('[Goldiama Hero] Видео-миниатюра не загрузилась:', e);
  };

  return (
    <>
      <section className="goldiama-hero" ref={heroRef} id="goldiama-hero-section">
        {/* Фоновое видео */}
        <video
          ref={videoRef}
          className="goldiama-hero__video"
          muted
          playsInline
          preload="metadata"
          id="goldiama-hero-video"
        >
          <source src="https://github.com/bairamilona/goldiama/raw/refs/heads/main/premium_cinematic_product_video_of_a_goldiama_gold_bar_star_1.mp4" type="video/mp4" />
        </video>

        <div className="goldiama-hero__overlay" />
        <div className="goldiama-hero__noise" />

        <div className="goldiama-hero__content" ref={contentRef}>
          <h1 className="goldiama-hero__title">
            <span className="goldiama-hero__title-line goldiama-hero__title-line--left">An Emblem of Purity</span>
            <span className="goldiama-hero__title-line goldiama-hero__title-line--center goldiama-hero__title-line--italic">Precision</span>
            <span className="goldiama-hero__title-line goldiama-hero__title-line--right">And Protection</span>
          </h1>

          {/* Превью видео слева внизу */}
          <div className="goldiama-hero__film" onClick={handleFilmClick}>
            <div className="goldiama-hero__film-preview">
              <video 
                autoPlay
                loop
                muted
                playsInline
                className="goldiama-hero__film-preview-video"
                onError={handleVideoError}
              >
                <source src="https://github.com/bairamilona/goldiama/raw/refs/heads/main/2026-02-13%2014.27.08.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="goldiama-hero__film-text">
              <p className="goldiama-hero__film-text-label">WATCH THE FILM</p>
              <p className="goldiama-hero__film-text-duration">(PLAY) <span>30m 36s</span></p>
            </div>
          </div>

          {/* Описание справа внизу */}
          <div className="goldiama-hero__desc">
            <p className="goldiama-hero__desc-text">Each Goldiama creation is more than an investment — it's an heirloom of faith and precision. From the Eagle of Trust coin to our meticulously sculpted 999.9 gold bars, every piece is born from the union of advanced minting technology and artistic mastery</p>
            <a href="#story" className="goldiama-hero__link">DISCOVER OUR STORY</a>
          </div>
        </div>
      </section>

      {/* Модальное окно с полным видео */}
      {showVideoModal && (
        <div className="goldiama-hero-modal" onClick={() => setShowVideoModal(false)} id="goldiama-hero-modal">
          <div className="goldiama-hero-modal__content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="goldiama-hero-modal__close"
              onClick={() => setShowVideoModal(false)}
              aria-label="Close video"
            >
              ×
            </button>
            <div className="goldiama-hero-modal__player">
              <video 
                controls 
                autoPlay
                style={{ width: '100%', maxWidth: '1200px', borderRadius: '4px' }}
              >
                <source src="https://github.com/bairamilona/goldiama/raw/refs/heads/main/premium_cinematic_product_video_of_a_goldiama_gold_bar_star_1.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default GoldiamaHero;

// Named export для совместимости
export { GoldiamaHero as Hero };
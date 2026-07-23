import React, { useEffect, useRef } from 'react';

interface HeroProps {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPrimaryClick, onSecondaryClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // Pause autoplay to allow scroll-driven video scrubbing
    video.pause();

    let animationFrameId: number;
    let targetTime = 0;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height || window.innerHeight;
      
      // Calculate scroll progress through hero section
      const scrollDistance = -rect.top;
      const maxScroll = sectionHeight;
      const progress = Math.max(0, Math.min(1, scrollDistance / maxScroll));

      if (video.duration && !isNaN(video.duration)) {
        targetTime = progress * video.duration;
      }
    };

    const updateVideoTime = () => {
      if (video && video.duration && !isNaN(video.duration)) {
        // Smooth linear interpolation (lerp) for liquid-smooth frame scrubbing
        const diff = targetTime - video.currentTime;
        if (Math.abs(diff) > 0.01) {
          video.currentTime += diff * 0.2;
        }
      }
      animationFrameId = requestAnimationFrame(updateVideoTime);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animationFrameId = requestAnimationFrame(updateVideoTime);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-[#0f172a]">
      {/* Full-screen Scroll-Scrubbed HTML5 Video Background */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover min-h-screen z-0"
      >
        <source
          src="https://assets.mixkit.co/videos/63/63-720.mp4"
          type="video/mp4"
        />
        <source
          src="https://cdn.coverr.co/videos/coverr-a-black-sports-car-on-a-road-5444/1080p.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Centered Hero Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[900px] px-6 mt-32 mb-16">
        
        {/* Headline */}
        <h1 className="font-instrument text-white text-5xl md:text-7xl lg:text-[96px] leading-[1.1] tracking-tight mb-6">
          Drive your dream vehicle instantly <span className="italic font-normal px-1">and</span> hassle-free
        </h1>

        {/* Subtext */}
        <p className="font-inter font-normal text-[18px] text-white/70 max-w-[662px] leading-relaxed mb-10">
          Discover handpicked luxury sedans, electric vehicles, sports coupes, and rugged trucks. Enjoy real-time inventory updates, atomic purchase orders, and 24/7 dealership support.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Button 1: Browse Vehicle Inventory */}
          <button
            onClick={onPrimaryClick}
            className="bg-[#7b39fc] hover:bg-[#6826e3] text-white font-cabin font-medium text-[16px] rounded-[10px] px-8 py-3.5 transition-all shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Browse Vehicle Inventory
          </button>

          {/* Button 2: Get Started Now */}
          <button
            onClick={onSecondaryClick}
            className="bg-[#2b2344] hover:bg-[#392e5a] text-[#f6f7f9] font-cabin font-medium text-[16px] rounded-[10px] px-8 py-3.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

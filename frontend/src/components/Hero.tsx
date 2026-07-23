import React from 'react';

interface HeroProps {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPrimaryClick, onSecondaryClick }) => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-[#0f172a]">
      {/* Full-screen Opaque HTML5 Video Background - Luxury Sports Car Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
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

import { useEffect, useState } from 'react';
import logo from '@/assets/logo.png';

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-background via-primary/10 to-background animate-fade-in">
      <div className="text-center space-y-8 px-4">
        {/* Logo with enhanced animation */}
        <div className="animate-scale-in">
          <div className="relative inline-block">
            {/* Glowing effect */}
            <div className="absolute inset-0 shadow-glow rounded-full blur-2xl animate-pulse opacity-70" />
            {/* Rotating ring effect */}
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-[spin_4s_linear_infinite]" />
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
            
            {/* Logo */}
            <img 
              src={logo} 
              alt="Café By ABUJACAR Logo" 
              className="w-48 h-48 md:w-56 md:h-56 object-contain relative z-10 animate-[bounce_2s_ease-in-out_infinite] drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Welcome text with floating animation */}
        <div className="space-y-5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h1 className="font-serif text-3xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-[bounce_2s_ease-in-out_infinite]">
            Welcome to Café By ABUJACAR
          </h1>
          
          {/* Slogan with slide animation */}
          <p className="text-xl md:text-2xl font-semibold text-primary animate-slide-up" style={{ animationDelay: '0.6s' }}>
            Where Every Sip Tells a Story
          </p>
          
          {/* Sub-slogan */}
          <p className="text-lg md:text-xl font-medium text-foreground/80 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            Premium Coffee & Delights, Crafted with Love
          </p>
          
          {/* Floating delivery message */}
          <p className="text-base md:text-lg text-muted-foreground animate-[bounce_2.5s_ease-in-out_infinite] font-medium" style={{ animationDelay: '1.2s' }}>
            🚚 Order from us and we'll deliver it to your doorstep!
          </p>
        </div>

        {/* Animated loading dots */}
        <div className="flex justify-center space-x-2 animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-glow" />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-glow" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-glow" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

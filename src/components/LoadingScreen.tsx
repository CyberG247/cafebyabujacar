import { useEffect, useState } from 'react';
import logo from '@/assets/logo.jpg';

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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-background via-primary-light/20 to-background animate-fade-in">
      <div className="text-center space-y-6 px-4">
        {/* Logo with animation */}
        <div className="animate-scale-in">
          <div className="relative inline-block">
            <div className="absolute inset-0 shadow-glow rounded-full blur-xl animate-pulse" />
            <img 
              src={logo} 
              alt="Café By ABUJACAR Logo" 
              className="w-40 h-40 md:w-48 md:h-48 object-contain relative z-10 animate-[spin_3s_ease-in-out_infinite]"
            />
          </div>
        </div>

        {/* Welcome text */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h1 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-pulse">
            Welcome to Café By ABUJACAR
          </h1>
          
          {/* Slogan */}
          <p className="text-xl md:text-2xl font-medium text-foreground/90 animate-slide-up" style={{ animationDelay: '1s' }}>
            Where Luxury Meets Flavor
          </p>
          
          {/* Floating delivery message */}
          <p className="text-base md:text-lg text-muted-foreground animate-[bounce_2s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }}>
            Order from us and we'll deliver it to your doorstep!
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2 animate-fade-in" style={{ animationDelay: '2s' }}>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

import { ReactNode, useState, useEffect } from 'react';

interface TransitionGroupProps {
  children: ReactNode;
  currentPage: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
}

export function TransitionGroup({ 
  children, 
  currentPage, 
  direction = 'right',
  duration = 300 
}: TransitionGroupProps) {
  const [displayedPage, setDisplayedPage] = useState(currentPage);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    if (currentPage !== displayedPage) {
      setIsTransitioning(true);
      setTransitionDirection('exit');
      
      const timeout = setTimeout(() => {
        setDisplayedPage(currentPage);
        setTransitionDirection('enter');
        
        // Allow enter animation to complete
        setTimeout(() => {
          setIsTransitioning(false);
        }, duration);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [currentPage, displayedPage, duration]);

  // Determine animation classes based on direction
  const getAnimationClasses = (isExit: boolean) => {
    const baseClasses = 'transition-all duration-300 ease-out';
    
    switch (direction) {
      case 'left':
        return isExit 
          ? `${baseClasses} opacity-0 -translate-x-full`
          : `${baseClasses} opacity-100 translate-x-0`;
      case 'right':
        return isExit 
          ? `${baseClasses} opacity-0 translate-x-full`
          : `${baseClasses} opacity-100 translate-x-0`;
      case 'up':
        return isExit 
          ? `${baseClasses} opacity-0 -translate-y-full`
          : `${baseClasses} opacity-100 translate-y-0`;
      case 'down':
        return isExit 
          ? `${baseClasses} opacity-0 translate-y-full`
          : `${baseClasses} opacity-100 translate-y-0`;
      default:
        return isExit 
          ? `${baseClasses} opacity-0`
          : `${baseClasses} opacity-100`;
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Content is always rendered with transition classes */}
      <div 
        key={currentPage}
        className={`
          ${getAnimationClasses(transitionDirection === 'exit')}
          ${isTransitioning && transitionDirection === 'enter' ? getAnimationClasses(false) : ''}
        `}
      >
        {children}
      </div>
    </div>
  );
}

// Simple fade transition component
interface FadeTransitionProps {
  children: ReactNode;
  show: boolean;
  duration?: number;
}

export function FadeTransition({ children, show, duration = 200 }: FadeTransitionProps) {
  const [display, setDisplay] = useState(show);

  useEffect(() => {
    if (show) {
      setDisplay(true);
    } else {
      const timeout = setTimeout(() => {
        setDisplay(false);
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [show, duration]);

  return (
    <div
      className={`
        transition-opacity duration-200 ease-out
        ${display && show ? 'opacity-100' : 'opacity-0'}
        ${!display ? 'hidden' : ''}
      `}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

// Slide transition component
interface SlideTransitionProps {
  children: ReactNode;
  show: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
}

export function SlideTransition({ 
  children, 
  show, 
  direction = 'right',
  duration = 300 
}: SlideTransitionProps) {
  const [display, setDisplay] = useState(show);

  useEffect(() => {
    if (show) {
      setDisplay(true);
    } else {
      const timeout = setTimeout(() => {
        setDisplay(false);
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [show, duration]);

  const getTransform = (isHidden: boolean) => {
    if (!isHidden) return 'translate-x-0 translate-y-0';
    
    switch (direction) {
      case 'left':
        return '-translate-x-full';
      case 'right':
        return 'translate-x-full';
      case 'up':
        return '-translate-y-full';
      case 'down':
        return 'translate-y-full';
      default:
        return '';
    }
  };

  return (
    <div
      className={`
        absolute inset-0 transition-all ease-out
        ${display ? 'opacity-100' : 'opacity-0'}
        ${show ? getTransform(false) : getTransform(true)}
        ${!display ? 'hidden' : ''}
      `}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

// Stagger children animation
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  animateOnMount?: boolean;
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 50,
  animateOnMount = true 
}: StaggerContainerProps) {
  const [animated, setAnimated] = useState(!animateOnMount);

  useEffect(() => {
    if (animateOnMount) {
      const timeout = setTimeout(() => {
        setAnimated(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [animateOnMount]);

  return (
    <div className="w-full">
      {React.Children.map(children, (child, index) => (
        <div
          className={`
            stagger-item
            ${animated ? 'stagger-item' : 'opacity-0'}
          `}
          style={{ 
            animationDelay: animateOnMount ? `${index * staggerDelay}ms` : '0ms'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

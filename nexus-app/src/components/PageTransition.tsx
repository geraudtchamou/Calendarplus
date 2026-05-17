import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  currentPage: string;
}

export function PageTransition({ children, currentPage }: PageTransitionProps) {
  const [displayedPage, setDisplayedPage] = useState(currentPage);
  const [isExiting, setIsExiting] = useState(false);
  const [previousChildren, setPreviousChildren] = useState<ReactNode>(null);

  useEffect(() => {
    if (currentPage !== displayedPage) {
      // Start exit animation with current children
      setIsExiting(true);
      setPreviousChildren(children);
      
      // Wait for exit animation to complete
      const timeout = setTimeout(() => {
        setDisplayedPage(currentPage);
        setIsExiting(false);
        setPreviousChildren(null);
      }, 300); // Match this with CSS animation duration

      return () => clearTimeout(timeout);
    }
  }, [currentPage, displayedPage, children]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Previous page exiting */}
      {isExiting && previousChildren && (
        <div 
          key="exiting"
          className="absolute inset-0 page-exit overflow-auto"
        >
          {previousChildren}
        </div>
      )}
      
      {/* New page entering or static display */}
      <div 
        key={displayedPage}
        className={!isExiting ? 'page-enter' : 'opacity-0'}
      >
        {children}
      </div>
    </div>
  );
}

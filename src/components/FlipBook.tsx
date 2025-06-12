import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface FlipBookPage {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
}

interface FlipBookProps {
  pages: FlipBookPage[];
  projectName: string;
  onClose?: () => void;
}

export const FlipBook: React.FC<FlipBookProps> = ({ pages, projectName, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout>>();

  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
      }, 300);
    }
  }, [currentPage, pages.length, isFlipping]);

  const prevPage = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsFlipping(false);
      }, 300);
    }
  }, [currentPage, isFlipping]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextPage();
    } else if (isRightSwipe) {
      prevPage();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextPage, prevPage, onClose]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-gray-50 z-50 overflow-hidden"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className={`absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 transition-all duration-300 ${showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{projectName}</h1>
            <p className="text-sm text-gray-600">Page {currentPage + 1} of {pages.length}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full px-4 py-20">
        <div className="relative max-w-6xl w-full h-full">
          {/* Book Container */}
          <div className="relative h-full flex items-center justify-center perspective-1000">
            {/* Current Page */}
            <div className="relative w-full max-w-4xl aspect-[3/2] shadow-2xl rounded-lg overflow-hidden bg-white">
              <div 
                className={`absolute inset-0 transition-transform duration-500 ease-in-out transform-style-preserve-3d ${
                  isFlipping ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front of current page */}
                <div className="absolute inset-0 backface-hidden">
                  <img
                    src={pages[currentPage]?.imageUrl}
                    alt={pages[currentPage]?.title || `Page ${currentPage + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {pages[currentPage]?.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                      <h3 className="text-white text-lg font-medium mb-2">
                        {pages[currentPage].title}
                      </h3>
                      {pages[currentPage]?.description && (
                        <p className="text-white/90 text-sm">
                          {pages[currentPage].description}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Back of current page (next page preview) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  {currentPage < pages.length - 1 && (
                    <img
                      src={pages[currentPage + 1]?.imageUrl}
                      alt={pages[currentPage + 1]?.title || `Page ${currentPage + 2}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>

              {/* Page binding shadow */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Previous Button */}
        {currentPage > 0 && (
          <button
            onClick={prevPage}
            disabled={isFlipping}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-3 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Next Button */}
        {currentPage < pages.length - 1 && (
          <button
            onClick={nextPage}
            disabled={isFlipping}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-3 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* Page Indicators */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (index !== currentPage && !isFlipping) {
                  setIsFlipping(true);
                  setTimeout(() => {
                    setCurrentPage(index);
                    setIsFlipping(false);
                  }, 300);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentPage
                  ? 'bg-blue-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className={`absolute top-20 left-1/2 -translate-x-1/2 transition-all duration-300 ${showControls ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
          Use arrow keys, click buttons, or swipe to navigate
        </div>
      </div>
    </div>
  );
};
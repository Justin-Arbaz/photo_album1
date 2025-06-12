import React, { useState } from 'react';
import { FlipBook } from './FlipBook';
import { sampleProjectData } from '../data/sampleProject';
import { BookOpen, Eye, ArrowRight } from 'lucide-react';

export const ProjectGallery: React.FC = () => {
  const [showFlipBook, setShowFlipBook] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <BookOpen className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Digital Flip Book
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Experience your projects in a beautifully crafted digital flip book with realistic page transitions and immersive full-screen viewing.
            </p>
            
            <div className="mt-10">
              <button
                onClick={() => setShowFlipBook(true)}
                className="group inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:bg-blue-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Eye className="w-5 h-5" />
                View Flip Book
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Project Preview
          </h2>
          <p className="text-lg text-gray-600">
            Get a glimpse of what's inside the flip book
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProjectData.pages.slice(0, 8).map((page, index) => (
            <div
              key={page.id}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => setShowFlipBook(true)}
            >
              <img
                src={page.imageUrl}
                alt={page.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {page.title}
                  </h3>
                  <p className="text-white/80 text-xs">
                    Page {index + 1}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Features
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need for a professional presentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Realistic Page Flips
              </h3>
              <p className="text-gray-600">
                3D page-flip animations that feel natural and engaging
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Full-Screen Viewing
              </h3>
              <p className="text-gray-600">
                Immersive full-screen experience with high-resolution images
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Navigation
              </h3>
              <p className="text-gray-600">
                Arrow keys, touch gestures, and click navigation support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Flip Book Modal */}
      {showFlipBook && (
        <FlipBook
          pages={sampleProjectData.pages}
          projectName={sampleProjectData.projectName}
          onClose={() => setShowFlipBook(false)}
        />
      )}
    </div>
  );
};
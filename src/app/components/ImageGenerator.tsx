'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImages, setShowImages] = useState(false);
  
  // Imágenes de ejemplo para la previsualización
  const placeholderImages = [
    { id: 1, url: 'https://via.placeholder.com/400x400' },
    { id: 2, url: 'https://via.placeholder.com/400x400' },
    { id: 3, url: 'https://via.placeholder.com/400x400' },
    { id: 4, url: 'https://via.placeholder.com/400x400' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setShowImages(true);

    // Simulamos el tiempo de generación de imágenes
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Aquí irá la lógica de generación de imágenes
    console.log('Generando imágenes para:', prompt);
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe la imagen que quieres generar..."
              className="w-full px-4 py-3 rounded-lg bg-purple-50 border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-gray-700 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-md transition-colors ${
                !prompt.trim() || isLoading
                  ? 'bg-purple-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {isLoading ? 'Generando...' : 'Generar'}
            </button>
          </div>
        </form>
      </div>

      {showImages && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {placeholderImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <img
                    src={image.url}
                    alt={`Imagen generada ${image.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGenerator; 
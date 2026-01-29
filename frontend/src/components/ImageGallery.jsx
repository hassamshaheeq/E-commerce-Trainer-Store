import { useState } from 'react';

const ImageGallery = ({ images, productName }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    // View labels for the different angles
    const viewLabels = ['Front View', 'Side View', 'Back View', 'Top View', 'Detail'];

    // Ensure we have at least one image
    const imageArray = images && images.length > 0 ? images : ['/placeholder-shoe.jpg'];

    return (
        <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 shadow-2xl">
                <img
                    src={imageArray[selectedImage]}
                    alt={`${productName} - ${viewLabels[selectedImage] || 'View'}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                />

                {/* View Label Badge */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-gray-600">
                    <span className="text-sm font-semibold">{viewLabels[selectedImage] || 'View'}</span>
                </div>

                {/* Navigation Arrows */}
                {imageArray.length > 1 && (
                    <>
                        <button
                            onClick={() => setSelectedImage((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1))}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all hover:scale-110 border border-gray-600"
                            aria-label="Previous image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setSelectedImage((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1))}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all hover:scale-110 border border-gray-600"
                            aria-label="Next image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Grid */}
            {imageArray.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                    {imageArray.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`group relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${selectedImage === index
                                    ? 'ring-4 ring-primary-500 scale-105 shadow-xl'
                                    : 'ring-2 ring-gray-700 hover:ring-gray-500 hover:scale-105 shadow-md'
                                }`}
                        >
                            <img
                                src={image}
                                alt={`${productName} - ${viewLabels[index] || `View ${index + 1}`}`}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
                            />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                                <span className="text-white text-xs font-semibold">
                                    {viewLabels[index] || `View ${index + 1}`}
                                </span>
                            </div>

                            {/* Active indicator */}
                            {selectedImage === index && (
                                <div className="absolute top-2 right-2 w-3 h-3 bg-primary-500 rounded-full shadow-lg animate-pulse" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Image Counter */}
            {imageArray.length > 1 && (
                <div className="text-center">
                    <span className="text-sm text-gray-400">
                        {selectedImage + 1} / {imageArray.length}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;

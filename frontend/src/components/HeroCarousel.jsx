import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const DEFAULT_SLIDES = [
    { _id: 'd1', image: '/images/hero/mens_shoes.png' },
    { _id: 'd2', image: '/images/hero/womens_shoes.png' },
    { _id: 'd3', image: '/images/hero/kids_shoes.png' }
];

const HeroCarousel = () => {
    const [slides, setSlides] = useState([]);
    const [settings, setSettings] = useState({
        title: 'SHOES',
        subtitle: 'NEW ARRIVAL'
    });
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/hero');
            setSlides(response.data.data.slides);
            if (response.data.data.settings) {
                setSettings(response.data.data.settings);
            }
        } catch (error) {
            console.error('Error fetching hero data:', error);
        } finally {
            setLoading(false);
        }
    };

    const activeSlides = slides.length > 0 ? slides : DEFAULT_SLIDES;

    useEffect(() => {
        if (activeSlides.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [activeSlides]);

    if (loading) {
        return (
            <div className="h-[500px] bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-[#1a1a1a]">
            {/* Split Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(105deg, #1a1a1a 0%, #1a1a1a 55%, #f59e0b 55%, #f59e0b 100%)'
                }}
            ></div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 p-6 z-20 flex space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/40 transition-colors">
                    <span className="text-xs">YT</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/40 transition-colors">
                    <span className="text-xs">IG</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/40 transition-colors">
                    <span className="text-xs">FB</span>
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    {/* Left Column: Text */}
                    <div className="flex flex-col justify-center items-start text-white pl-4 md:pl-12">
                        <h3 className="text-orange-500 font-bold tracking-widest text-lg md:text-xl mb-2 uppercase">
                            {settings.subtitle || 'NEW ARRIVAL'}
                        </h3>
                        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter leading-none">
                            {settings.title || 'SHOES'}
                        </h1>
                        <div className="h-1 w-24 bg-orange-500 mb-6"></div>
                        <p className="text-gray-400 mb-8 max-w-md">
                            www.shoestore.com
                        </p>
                        <Link
                            to="/products/latest"
                            className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg flex items-center group"
                        >
                            SHOP NOW
                            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Right Column: Image Carousel */}
                    <div className="relative flex items-center justify-center h-full">
                        {/* Circle Badge */}
                        <div className="absolute top-1/4 left-0 md:left-10 z-20 bg-black text-white rounded-full w-24 h-24 flex flex-col items-center justify-center border-4 border-orange-500 shadow-xl transform -rotate-12">
                            <span className="text-xs font-bold">SAVE</span>
                            <span className="text-2xl font-black text-orange-500">50%</span>
                        </div>

                        {/* Rotating Images */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            {activeSlides.map((slide, index) => (
                                <div
                                    key={slide._id}
                                    className={`absolute transition-all duration-700 ease-in-out transform ${index === currentSlide
                                            ? 'opacity-100 translate-x-0 scale-100 rotate-0'
                                            : 'opacity-0 translate-x-20 scale-90 rotate-12'
                                        }`}
                                >
                                    <img
                                        src={slide.image.startsWith('http') || slide.image.startsWith('/') ? slide.image : `http://localhost:5000${slide.image}`}
                                        alt="Shoe"
                                        className="max-w-[300px] md:max-w-[500px] object-contain drop-shadow-2xl filter"
                                        style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroCarousel;

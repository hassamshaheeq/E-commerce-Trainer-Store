import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminHero = () => {
    const [slides, setSlides] = useState([]);
    const [settings, setSettings] = useState({ title: '', subtitle: '' });
    const [loading, setLoading] = useState(true);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/hero/admin');
            setSlides(response.data.data.slides);
            setSettings(response.data.data.settings);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            await api.put('/hero/settings', settings);
            alert('Settings saved successfully!');
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setSavingSettings(false);
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingImages(true);
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('images', file);
            });

            const response = await api.post('/upload/hero', formData);

            // Create slides for uploaded images
            await api.post('/hero', { images: response.data.data });

            fetchData();
            alert('Images uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.response?.data?.message || error.message || 'Failed to upload images');
        } finally {
            setUploadingImages(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            await api.delete(`/hero/${id}`);
            fetchData();
        } catch (error) {
            alert('Failed to delete image');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-12">
            {/* Section 1: Global Text Settings */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Hero Text Settings</h2>
                <form onSubmit={handleSettingsSubmit} className="space-y-4 max-w-2xl">
                    <Input
                        label="Main Title"
                        value={settings.title}
                        onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                        placeholder="e.g., Step Into Style"
                    />
                    <Input
                        label="Subtitle"
                        value={settings.subtitle}
                        onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                        placeholder="e.g., Discover premium footwear..."
                    />
                    <Button type="submit" variant="primary" disabled={savingSettings}>
                        {savingSettings ? 'Saving...' : 'Save Text Settings'}
                    </Button>
                </form>
            </div>

            {/* Section 2: Image Gallery */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Background Images</h2>
                    <div className="relative">
                        <Button variant="primary" disabled={uploadingImages}>
                            {uploadingImages ? 'Uploading...' : 'Upload Images'}
                        </Button>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={uploadingImages}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {slides.map((slide) => (
                        <div key={slide._id} className="bg-white rounded-xl shadow-lg overflow-hidden group relative">
                            <div className="aspect-w-16 aspect-h-9 h-48">
                                <img
                                    src={slide.image.startsWith('http') ? slide.image : `http://localhost:5000${slide.image}`}
                                    alt="Hero Background"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(slide._id)}
                                    className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transform hover:scale-110 transition-all"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {slides.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <p className="text-gray-500">No images uploaded yet. Upload some images to start the carousel.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHero;

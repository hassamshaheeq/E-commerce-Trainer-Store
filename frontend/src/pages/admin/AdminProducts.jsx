import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'men',
        brand: '',
        price: '',
        images: [''],
        sizes: [{ size: '', stock: '' }],
        featured: false
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                sizes: formData.sizes.map(s => ({ size: s.size, stock: parseInt(s.stock) }))
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, productData);
            } else {
                await api.post('/products', productData);
            }

            fetchProducts();
            setShowModal(false);
            resetForm();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save product');
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

            const response = await api.post('/upload/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update form data with uploaded image paths
            setFormData(prev => ({
                ...prev,
                images: response.data.data
            }));

            alert('Images uploaded successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to upload images');
        } finally {
            setUploadingImages(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete product');
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            description: product.description,
            category: product.category,
            brand: product.brand,
            price: product.price.toString(),
            images: product.images,
            sizes: product.sizes,
            featured: product.featured
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            title: '',
            description: '',
            category: 'men',
            brand: '',
            price: '',
            images: [''],
            sizes: [{ size: '', stock: '' }],
            featured: false
        });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="gradient-text">Manage Products</h1>
                <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    Add New Product
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                            <div className="text-sm text-gray-500">{product.brand}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.totalStock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button onClick={() => openEditModal(product)} className="text-primary-600 hover:text-primary-900">Edit</button>
                                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    <Input label="Brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input-field"
                            rows={3}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field" required>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="children">Children</option>
                            <option value="latest">Latest</option>
                        </select>
                    </div>
                    <Input label="Price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (PNG)</label>
                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.webp"
                            multiple
                            onChange={handleImageUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer border border-gray-300 rounded-lg"
                            disabled={uploadingImages}
                        />
                        {uploadingImages && <p className="text-sm text-gray-500 mt-2">Uploading images...</p>}
                        {formData.images.length > 0 && formData.images[0] && (
                            <div className="mt-3 flex gap-2 flex-wrap">
                                {formData.images.map((img, idx) => (
                                    <img key={idx} src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border" />
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sizes & Stock</label>
                        {formData.sizes.map((size, index) => (
                            <div key={index} className="flex space-x-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Size (e.g. 42, 9, M)"
                                    value={size.size}
                                    onChange={(e) => {
                                        const newSizes = [...formData.sizes];
                                        newSizes[index].size = e.target.value;
                                        setFormData({ ...formData, sizes: newSizes });
                                    }}
                                    className="input-field flex-1"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={size.stock}
                                    onChange={(e) => {
                                        const newSizes = [...formData.sizes];
                                        newSizes[index].stock = e.target.value;
                                        setFormData({ ...formData, sizes: newSizes });
                                    }}
                                    className="input-field w-24"
                                    required
                                    min="0"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newSizes = formData.sizes.filter((_, i) => i !== index);
                                        setFormData({ ...formData, sizes: newSizes });
                                    }}
                                    className="text-red-600 hover:text-red-800 px-2"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFormData({ ...formData, sizes: [...formData.sizes, { size: '', stock: '' }] })}
                            className="mt-2 text-sm"
                        >
                            + Add Size
                        </Button>
                    </div>
                    <div>
                        <label className="flex items-center">
                            <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="mr-2" />
                            <span className="text-sm font-medium text-gray-700">Featured Product</span>
                        </label>
                    </div>
                    <div className="flex space-x-2">
                        <Button type="submit" variant="primary">Save Product</Button>
                        <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminProducts;

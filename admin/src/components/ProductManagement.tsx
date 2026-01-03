import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import axios from 'axios';

/* =======================
   Types
======================= */

interface ProductVariant {
  size: string;
  colors: string[];
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: 'available' | 'sold-out';
  variants: ProductVariant[];
}

/* =======================
   Constants
======================= */

const FASHION_CATEGORIES = [
  'Men - T-Shirts',
  'Men - Hoodie',
  'Men - Sweater',
  'Men - Jeans',
  'Men - Polo',
  'Women - Dress',
  'Women - Shoes',
  'Women - Legging',
  'Women - Skirt',
  'Women - Top',
  'Kids - Shoes',
  'Kids - T-Shirt',
  'Kids - Shorts',
  'Accessories',
  'Bags',
  'Hats',
  'Wallets',
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

/* =======================
   Component
======================= */

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    status: 'available' as 'available' | 'sold-out',
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [currentVariant, setCurrentVariant] = useState({
    size: 'M',
    colors: '',
    imageUrl: '',
  });

  /* =======================
     Effects
  ======================= */

  useEffect(() => {
    const getProductData = async () => {
      try {
        const response = await axios.get<Product[]>('/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
        alert('Cannot load products');
      }
    };

    getProductData();
  }, []);

  /* =======================
     Handlers
  ======================= */

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: FASHION_CATEGORIES[0],
      price: '',
      stock: '',
      image: '',
      status: 'available',
    });
    setVariants([]);
    setCurrentVariant({ size: 'M', colors: '', imageUrl: '' });
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
      status: product.status,
    });
    setVariants(product.variants);
    setCurrentVariant({ size: 'M', colors: '', imageUrl: '' });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm(
      'Are you sure you want to delete this product?'
    );
    if (!ok) return;

    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(`Failed to delete product with id ${id}`, error);
      alert('Failed to delete product');
    }
  };

  const handleAddVariant = () => {
    if (
      !currentVariant.colors.trim() ||
      !currentVariant.imageUrl.trim()
    ) {
      alert('Please fill in colors and image URL for the variant');
      return;
    }

    const colorsArray = currentVariant.colors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    setVariants([
      ...variants,
      {
        size: currentVariant.size,
        colors: colorsArray,
        imageUrl: currentVariant.imageUrl,
      },
    ]);

    setCurrentVariant({ size: 'M', colors: '', imageUrl: '' });
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (variants.length === 0) {
      alert('Please add at least one product variant');
      return;
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      image: formData.image || variants[0].imageUrl,
      status: formData.status,
      variants,
    };

    try {
      if (editingProduct) {
        const res = await axios.put(
          `/api/products/${editingProduct.id}`,
          payload
        );

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? res.data : p
          )
        );
      } else {
        const res = await axios.post('/api/products', payload);
        setProducts((prev) => [...prev, res.data]);
      }

      setShowModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Submit product failed', err);
      alert('Failed to save product');
    }
  };

  /* =======================
     Derived Data
  ======================= */

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  /* =======================
     Render
  ======================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900">
            Fashion Product Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your fashion inventory
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-800 transition-all hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="aspect-square bg-gray-100 relative">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs ${
                  product.status === 'available'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {product.status === 'available'
                  ? 'Available'
                  : 'Sold Out'}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-gray-900 mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {product.category}
              </p>

              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Stock: {product.stock}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">
                  Variants: {product.variants.length}
                </p>
                <div className="flex flex-wrap gap-1">
                  {product.variants.slice(0, 3).map((v, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {v.size}
                    </span>
                  ))}
                  {product.variants.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      +{product.variants.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  <Edit className="w-4 h-4 inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-gray-900 font-bold text-xl">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="e.g. Classic Cotton T-Shirt"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {FASHION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'available' | 'sold-out' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="available">Available</option>
                    <option value="sold-out">Sold Out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="99.99"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Total Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Main Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Variants Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-gray-900 font-medium mb-3">Product Variants</h4>
                
                {/* Existing Variants */}
                {variants.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {variants.map((v, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                        <span className="text-sm">
                          <strong>{v.size}</strong> - {v.colors.join(', ')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Variant */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Size</label>
                    <select
                      value={currentVariant.size}
                      onChange={(e) => setCurrentVariant({ ...currentVariant, size: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      {SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Colors (comma-separated)</label>
                    <input
                      type="text"
                      value={currentVariant.colors}
                      onChange={(e) => setCurrentVariant({ ...currentVariant, colors: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Red, Blue, Black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={currentVariant.imageUrl}
                      onChange={(e) => setCurrentVariant({ ...currentVariant, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="https://..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Add Variant
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

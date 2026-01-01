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
    </div>
  );
}

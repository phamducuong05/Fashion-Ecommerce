import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

const initialProducts: Product[] = [
  { 
    id: 1, 
    name: 'Classic Cotton T-Shirt', 
    category: 'Men - T-Shirts', 
    price: 29.99, 
    stock: 45, 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 
    status: 'available',
    variants: [
      { size: 'M', colors: ['Black', 'White', 'Navy'], imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
      { size: 'L', colors: ['Black', 'White'], imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    ]
  },
  { 
    id: 2, 
    name: 'Floral Summer Dress', 
    category: 'Women - Dress', 
    price: 89.99, 
    stock: 32, 
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 
    status: 'available',
    variants: [
      { size: 'S', colors: ['Floral Blue', 'Floral Pink'], imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400' },
      { size: 'M', colors: ['Floral Blue', 'Floral Pink'], imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400' },
    ]
  },
  { 
    id: 3, 
    name: 'Leather Crossbody Bag', 
    category: 'Bags', 
    price: 129.99, 
    stock: 18, 
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', 
    status: 'available',
    variants: [
      { size: 'One Size', colors: ['Brown', 'Black', 'Tan'], imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
    ]
  },
  { 
    id: 4, 
    name: 'Kids Running Shoes', 
    category: 'Kids - Shoes', 
    price: 49.99, 
    stock: 0, 
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400', 
    status: 'sold-out',
    variants: [
      { size: 'S', colors: ['Blue', 'Pink'], imageUrl: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400' },
      { size: 'M', colors: ['Blue', 'Pink'], imageUrl: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400' },
    ]
  },
];

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleAddVariant = () => {
    if (!currentVariant.colors.trim() || !currentVariant.imageUrl.trim()) {
      alert('Please fill in colors and image URL for the variant');
      return;
    }

    const colorsArray = currentVariant.colors.split(',').map(c => c.trim()).filter(c => c);
    
    setVariants([...variants, {
      size: currentVariant.size,
      colors: colorsArray,
      imageUrl: currentVariant.imageUrl,
    }]);

    setCurrentVariant({ size: 'M', colors: '', imageUrl: '' });
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (variants.length === 0) {
      alert('Please add at least one product variant');
      return;
    }

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                image: formData.image || variants[0].imageUrl,
                status: formData.status,
                variants: variants,
              }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: formData.image || variants[0].imageUrl,
        status: formData.status,
        variants: variants,
      };
      setProducts([...products, newProduct]);
    }
    setShowModal(false);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[#3E2723]">Fashion Product Management</h2>
          <p className="text-sm text-[#6F4E37] mt-1">Manage your fashion inventory</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#FFFEF9] rounded-xl shadow-lg p-6 border border-[#D4A574]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0826D] w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[#D4A574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#FFFEF9] rounded-xl shadow-lg overflow-hidden border border-[#D4A574] hover:shadow-xl transition-all"
          >
            <div className="aspect-square bg-gradient-to-br from-[#FFF8E7] to-[#F5DEB3] relative">
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
                {product.status === 'available' ? 'Available' : 'Sold Out'}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-[#3E2723] mb-1">{product.name}</h3>
              <p className="text-sm text-[#8B6F47] mb-3">{product.category}</p>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#3E2723]">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
              </div>
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Variants: {product.variants.length}</p>
                <div className="flex flex-wrap gap-1">
                  {product.variants.slice(0, 3).map((v, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-[#F5DEB3] text-[#6F4E37] rounded">
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#A0826D] to-[#8B6F47] text-white rounded-lg hover:shadow-md transition-all"
                >
                  <Edit className="w-4 h-4 inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-[#D4A574]">
              <h3 className="text-[#3E2723]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {FASHION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'available' | 'sold-out' })
                    }
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="available">Available</option>
                    <option value="sold-out">Sold Out</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Product Variants Section */}
              <div className="border-t border-[#D4A574] pt-6">
                <h4 className="text-[#3E2723] mb-4">Product Variants</h4>
                
                {/* Add Variant Form */}
                <div className="bg-[#FFF8E7] rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Size</label>
                      <select
                        value={currentVariant.size}
                        onChange={(e) => setCurrentVariant({ ...currentVariant, size: e.target.value })}
                        className="w-full px-3 py-2 border border-[#D4A574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0826D]"
                      >
                        {SIZES.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Colors (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="e.g., Black, White, Navy"
                        value={currentVariant.colors}
                        onChange={(e) => setCurrentVariant({ ...currentVariant, colors: e.target.value })}
                        className="w-full px-3 py-2 border border-[#D4A574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0826D]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Image URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={currentVariant.imageUrl}
                        onChange={(e) => setCurrentVariant({ ...currentVariant, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-[#D4A574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0826D]"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-4 py-2 bg-[#8B6F47] text-white rounded-lg hover:bg-[#6F4E37] transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add Variant
                  </button>
                </div>

                {/* Variants List */}
                {variants.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {variants.map((variant, index) => (
                      <div key={index} className="flex items-center justify-between bg-white border border-[#D4A574] rounded-lg p-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-3 py-1 bg-[#F5DEB3] text-[#4E342E] rounded text-sm">
                              Size: {variant.size}
                            </span>
                            <span className="text-sm text-gray-700">
                              Colors: {variant.colors.join(', ')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            Image: {variant.imageUrl}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#D4A574]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-[#C19A6B] text-[#4E342E] rounded-lg hover:bg-[#FFF8E7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
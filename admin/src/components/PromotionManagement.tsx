import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Tag, Calendar, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import axios from 'axios';

interface PromotionResponse {
  discount: Discount[];
  banner: Banner[];
}

interface Discount {
  id: number;
  code: string;
  description: string;
  percentOff: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
}

export function PromotionManagement() {
  const [activeTab, setActiveTab] = useState<'discounts' | 'banners'>('discounts');
  const [isLoading, setIsLoading] = useState(true);
  
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [discountFormData, setDiscountFormData] = useState({
    code: '',
    description: '',
    percentOff: '',
    startDate: '',
    endDate: '',
    active: true,
  });

  const [banners, setBanners] = useState<Banner[]>([]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    active: false,
  });

  useEffect(() => {
    const getPromotionData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<PromotionResponse>('/api/promotion');
        setDiscounts(response.data.discount);
        setBanners(response.data.banner);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch promotion data');
      } finally {
        setIsLoading(false);
      }
    };

    getPromotionData();
  }, []);

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const handleAddDiscount = () => {
    setEditingDiscount(null);
    setDiscountFormData({
      code: '',
      description: '',
      percentOff: '',
      startDate: '',
      endDate: '',
      active: true,
    });
    setShowDiscountModal(true);
  };

  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
    setDiscountFormData({
      code: discount.code,
      description: discount.description,
      percentOff: discount.percentOff.toString(),
      startDate: formatDateForInput(discount.startDate),
      endDate: formatDateForInput(discount.endDate),
      active: discount.active,
    });
    setShowDiscountModal(true);
  };

  const handleDeleteDiscount = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) {
      return;
    }

    try {
      await axios.delete(`/api/promotion/discount/${id}`);
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete discount.');
    }
  };

  const handleSubmitDiscount = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      code: discountFormData.code,
      description: discountFormData.description,
      percentOff: Number(discountFormData.percentOff),
      startDate: discountFormData.startDate,
      endDate: discountFormData.endDate,
      active: discountFormData.active,
    };

    try {
      if (editingDiscount) {
        const response = await axios.put<Discount>(
          `/api/promotion/discount/${editingDiscount.id}`,
          payload
        );
        setDiscounts((prev) =>
          prev.map((d) => (d.id === editingDiscount.id ? response.data : d))
        );
      } else {
        const response = await axios.post<Discount>('/api/promotion/discount', payload);
        setDiscounts((prev) => [...prev, response.data]);
      }
      setShowDiscountModal(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save discount');
    }
  };

  const handleAddBanner = () => {
    setEditingBanner(null);
    setBannerFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      buttonText: '',
      buttonLink: '',
      active: false,
    });
    setShowBannerModal(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      active: banner.active,
    });
    setShowBannerModal(true);
  };

  const handleDeleteBanner = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      await axios.delete(`/api/promotion/banner/${id}`);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete banner');
    }
  };

  const handleSubmitBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = { ...bannerFormData };

    try {
      if (editingBanner) {
        const response = await axios.put<Banner>(
            `/api/promotion/banner/${editingBanner.id}`, 
            payload
        );
        setBanners((prev) =>
          prev.map((b) => (b.id === editingBanner.id ? response.data : b))
        );
      } else {
        const response = await axios.post<Banner>('/api/promotion/banner', payload);
        setBanners((prev) => [...prev, response.data]);
      }
      setShowBannerModal(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save banner');
    }
  };

  const handleSetActiveBanner = async (id: number) => {
    try {
        const targetBanner = banners.find(b => b.id === id);
        if(!targetBanner) return;

        await axios.put(`/api/promotion/banner/${id}`, {
            ...targetBanner,
            active: true
        });

        setBanners((prev) =>
            prev.map((b) => ({
                ...b,
                active: b.id === id,
            }))
        );
    } catch (error) {
        console.error(error);
        alert('Failed to update active banner');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6F4E37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[#3E2723] mb-2 font-bold text-2xl">Promotion Management</h2>
          <p className="text-[#6F4E37]">Manage discounts and homepage banners</p>
        </div>
      </div>

      <div className="bg-[#FFFEF9] rounded-xl shadow-lg border border-[#D4A574] overflow-hidden">
        <div className="flex border-b border-[#D4A574]">
          <button
            onClick={() => setActiveTab('discounts')}
            className={`flex-1 px-6 py-4 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'discounts'
                ? 'bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white'
                : 'text-[#6F4E37] hover:bg-[#FFF8E7]'
            }`}
          >
            <Tag className="w-5 h-5" />
            Discount Codes
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex-1 px-6 py-4 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'banners'
                ? 'bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white'
                : 'text-[#6F4E37] hover:bg-[#FFF8E7]'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            Homepage Banners
          </button>
        </div>

        {activeTab === 'discounts' && (
          <div className="p-6">
            <div className="flex justify-end mb-6">
              <button
                onClick={handleAddDiscount}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Discount
              </button>
            </div>

            <div className="space-y-4">
              {discounts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No discounts found.</p>
              ) : (
                discounts.map((discount) => (
                  <div
                    key={discount.id}
                    className="bg-gradient-to-br from-[#FFF8E7]/50 to-[#F5DEB3]/50 rounded-lg border border-[#C19A6B] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-[#3E2723] font-semibold">{discount.code}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            discount.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {discount.active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-3 py-1 bg-[#E8D4B0] text-[#6F4E37] rounded-full text-xs font-bold">
                            {discount.percentOff}% OFF
                          </span>
                        </div>
                        <p className="text-[#4E342E] mb-3">{discount.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>From: {new Date(discount.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>To: {new Date(discount.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditDiscount(discount)}
                          className="px-4 py-2 bg-gradient-to-r from-[#A0826D] to-[#8B6F47] text-white rounded-lg hover:shadow-md transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(discount.id)}
                          className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="p-6">
            <div className="flex justify-end mb-6">
              <button
                onClick={handleAddBanner}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Banner
              </button>
            </div>

            <div className="space-y-4">
              {banners.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No banners found.</p>
              ) : (
                banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="bg-white rounded-lg border border-[#C19A6B] overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-[3/1] bg-gradient-to-br from-[#FFF8E7] to-[#F5DEB3] relative group">
                      <ImageWithFallback
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                      {banner.active && (
                        <div className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white rounded-full text-sm shadow-lg font-medium">
                          Active on Homepage
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-[#3E2723] mb-1 font-bold text-lg">{banner.title}</h3>
                      <p className="text-[#6F4E37] mb-3">{banner.subtitle}</p>
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">Button: "{banner.buttonText}"</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">Link: {banner.buttonLink}</p>
                        </div>
                        <div className="flex gap-2">
                          {!banner.active && (
                            <button
                              onClick={() => handleSetActiveBanner(banner.id)}
                              className="px-4 py-2 bg-green-100 text-green-700 border border-green-200 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                            >
                              Set Active
                            </button>
                          )}
                          <button
                            onClick={() => handleEditBanner(banner)}
                            className="px-4 py-2 bg-gradient-to-r from-[#A0826D] to-[#8B6F47] text-white rounded-lg hover:shadow-md transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-[#D4A574]">
              <h3 className="text-[#3E2723] text-xl font-bold">
                {editingDiscount ? 'Edit Discount' : 'Add New Discount'}
              </h3>
              <button
                onClick={() => setShowDiscountModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitDiscount} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code</label>
                  <input
                    type="text"
                    required
                    value={discountFormData.code}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g., WINTER25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Percent Off (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={discountFormData.percentOff}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, percentOff: e.target.value })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  value={discountFormData.description}
                  onChange={(e) => setDiscountFormData({ ...discountFormData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D4A574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0826D]"
                  placeholder="Describe the discount promotion"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={discountFormData.startDate}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    required
                    value={discountFormData.endDate}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
                <input
                  type="checkbox"
                  id="discount-active"
                  checked={discountFormData.active}
                  onChange={(e) => setDiscountFormData({ ...discountFormData, active: e.target.checked })}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-400 rounded cursor-pointer"
                />
                <label htmlFor="discount-active" className="text-sm text-gray-700 cursor-pointer select-none">
                  Active (immediately available to customers)
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#D4A574]">
                <button
                  type="button"
                  onClick={() => setShowDiscountModal(false)}
                  className="flex-1 px-4 py-2 border border-[#C19A6B] text-[#4E342E] rounded-lg hover:bg-[#FFF8E7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingDiscount ? 'Update Discount' : 'Add Discount'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBannerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-[#D4A574]">
              <h3 className="text-[#3E2723] text-xl font-bold">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h3>
              <button
                onClick={() => setShowBannerModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitBanner} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Title</label>
                <input
                  type="text"
                  required
                  value={bannerFormData.title}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D4A574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0826D]"
                  placeholder="e.g., Winter Collection 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  required
                  value={bannerFormData.subtitle}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D4A574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0826D]"
                  placeholder="Brief description or tagline"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  required
                  value={bannerFormData.imageUrl}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D4A574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A0826D]"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x400px</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    required
                    value={bannerFormData.buttonText}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, buttonText: e.target.value })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g., Shop Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                  <input
                    type="text"
                    required
                    value={bannerFormData.buttonLink}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, buttonLink: e.target.value })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g., /collections/winter"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
                <input
                  type="checkbox"
                  id="banner-active"
                  checked={bannerFormData.active}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, active: e.target.checked })}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-400 rounded cursor-pointer"
                />
                <label htmlFor="banner-active" className="text-sm text-gray-700 cursor-pointer select-none">
                  Set as active banner on homepage
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#D4A574]">
                <button
                  type="button"
                  onClick={() => setShowBannerModal(false)}
                  className="flex-1 px-4 py-2 border border-[#C19A6B] text-[#4E342E] rounded-lg hover:bg-[#FFF8E7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8B6F47] to-[#6F4E37] text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingBanner ? 'Update Banner' : 'Add Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Tag, Calendar, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
  active: boolean;
}

export function PromotionManagement() {
  const [activeTab, setActiveTab] = useState<'discounts' | 'banners'>(
    'discounts'
  );
  const [isLoading, setIsLoading] = useState(true);

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [editingDiscount, setEditingDiscount] =
    useState<Discount | null>(null);
  const [discountForm, setDiscountForm] = useState({
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
  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    active: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const discountRes = await axios.get<Discount[]>('/api/discounts');
        const bannerRes = await axios.get<Banner[]>('/api/banners');
        setDiscounts(discountRes.data);
        setBanners(bannerRes.data);
      } catch {
        alert('Failed to fetch promotion data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDateForInput = (date: string) =>
    date ? date.split('T')[0] : '';

  const handleAddDiscount = () => {
    setEditingDiscount(null);
    setDiscountForm({
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
    setDiscountForm({
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
      await axios.delete(`/api/discounts/${id}`);
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    } catch {
      alert('Failed to delete discount');
    }
  };

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      code: discountForm.code,
      description: discountForm.description,
      percentOff: Number(discountForm.percentOff),
      startDate: discountForm.startDate,
      endDate: discountForm.endDate,
      active: discountForm.active,
    };

    try {
      if (editingDiscount) {
        const res = await axios.put<Discount>(
          `/api/discounts/${editingDiscount.id}`,
          payload
        );
        setDiscounts((prev) =>
          prev.map((d) => (d.id === editingDiscount.id ? res.data : d))
        );
      } else {
        const res = await axios.post<Discount>(
          '/api/discounts',
          payload
        );
        setDiscounts((prev) => [...prev, res.data]);
      }
      setShowDiscountModal(false);
    } catch {
      alert('Failed to save discount');
    }
  };

  const handleAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      active: false,
    });
    setShowBannerModal(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      description: banner.subtitle,
      imageUrl: banner.imageUrl,
      linkUrl: '',
      active: banner.active,
    });
    setShowBannerModal(true);
  };

  const handleDeleteBanner = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }
    try {
      await axios.delete(`/api/banners/${id}`);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert('Failed to delete banner');
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: bannerForm.title,
      subtitle: bannerForm.description,
      imageUrl: bannerForm.imageUrl,
      active: bannerForm.active,
    };

    try {
      if (editingBanner) {
        const res = await axios.put<Banner>(
          `/api/banners/${editingBanner.id}`,
          payload
        );
        setBanners((prev) =>
          prev.map((b) => (b.id === editingBanner.id ? res.data : b))
        );
      } else {
        const res = await axios.post<Banner>('/api/banners', payload);
        setBanners((prev) => [...prev, res.data]);
      }
      setShowBannerModal(false);
    } catch {
      alert('Failed to save banner');
    }
  };

  const handleSetActiveBanner = async (id: number) => {
    const banner = banners.find((b) => b.id === id);
    if (!banner) return;

    try {
      await axios.put(`/api/banners/${id}`, {
        ...banner,
        active: true,
      });
      setBanners((prev) =>
        prev.map((b) => ({ ...b, active: b.id === id }))
      );
    } catch {
      alert('Failed to update banner');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2 font-bold text-2xl">Promotion Management</h2>
          <p className="text-gray-600">Manage discounts and homepage banners</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('discounts')}
            className={`flex-1 px-6 py-4 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'discounts'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Tag className="w-5 h-5" />
            Discount Codes
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex-1 px-6 py-4 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'banners'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            Homepage Banners
          </button>
        </div>

        {/* Discounts Tab */}
        {activeTab === 'discounts' && (
          <div className="p-6">
            <div className="flex justify-end mb-6">
              <button
                onClick={handleAddDiscount}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-800 transition-all"
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
                    className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-gray-900 font-semibold">{discount.code}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            discount.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {discount.active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            {discount.percentOff}% OFF
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{discount.description}</p>
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
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(discount.id)}
                          className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
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

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div className="p-6">
            <div className="flex justify-end mb-6">
              <button
                onClick={handleAddBanner}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-800 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Banner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500 py-8">No banners found.</div>
              ) : (
                banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
                  >
                    <div className="aspect-video bg-gray-100 relative group">
                      <ImageWithFallback
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                        banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {banner.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-gray-900 mb-1 font-bold">{banner.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 flex-1">{banner.subtitle}</p>
                      
                      <div className="flex gap-2 mt-auto">
                        {!banner.active && (
                            <button
                              onClick={() => handleSetActiveBanner(banner.id)}
                              className="px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                            >
                              Set Active
                            </button>
                        )}
                        <button
                          onClick={() => handleEditBanner(banner)}
                          className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4 inline mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
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
      </div>

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-gray-900 font-bold text-xl">
                {editingDiscount ? 'Edit Discount' : 'Add New Discount'}
              </h3>
              <button
                onClick={() => {
                  setShowDiscountModal(false);
                  setEditingDiscount(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleDiscountSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Discount Code</label>
                  <input
                    type="text"
                    required
                    value={discountForm.code}
                    onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. SUMMER2024"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Description</label>
                  <textarea
                    required
                    value={discountForm.description}
                    onChange={(e) => setDiscountForm({ ...discountForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Discount Percentage</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={discountForm.percentOff}
                    onChange={(e) => setDiscountForm({ ...discountForm, percentOff: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Status</label>
                  <select
                    value={discountForm.active ? 'active' : 'inactive'}
                    onChange={(e) => setDiscountForm({ ...discountForm, active: e.target.value === 'active' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Start Date</label>
                  <input
                    type="date"
                    required
                    value={discountForm.startDate}
                    onChange={(e) => setDiscountForm({ ...discountForm, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">End Date</label>
                  <input
                    type="date"
                    required
                    value={discountForm.endDate}
                    onChange={(e) => setDiscountForm({ ...discountForm, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowDiscountModal(false);
                    setEditingDiscount(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                >
                  {editingDiscount ? 'Update Discount' : 'Add Discount'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-gray-900 font-bold text-xl">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h3>
              <button
                onClick={() => {
                  setShowBannerModal(false);
                  setEditingBanner(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleBannerSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Banner Title</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Winter Sale 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Description</label>
                  <textarea
                    required
                    value={bannerForm.description}
                    onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="This will be saved as subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Image URL</label>
                  <input
                    type="url"
                    required
                    value={bannerForm.imageUrl}
                    onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Trường này hiển thị ở UI nhưng không được lưu xuống API theo Logic Code 1 */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Link URL (optional)</label>
                  <input
                    type="url"
                    value={bannerForm.linkUrl}
                    onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Backend logic 1 doesn't support this yet"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Status</label>
                  <select
                    value={bannerForm.active ? 'active' : 'inactive'}
                    onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.value === 'active' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowBannerModal(false);
                    setEditingBanner(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
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

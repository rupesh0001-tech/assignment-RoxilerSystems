import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutGrid,
  FilePlus,
  Search,
  Users,
  Building2,
  Star,
  Clock,
  LogOut,
  KeyRound,
  Plus,
  Loader2,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  UserPlus,
  List,
  MapPin,
  Mail,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';
import { storeApi, type StoreItem } from '../../apis/stores/storeApi';
import { ratingApi, type StoreOwnerReviewData } from '../../apis/ratings/ratingApi';
import { adminApi, type AdminMetrics, type AdminUserItem } from '../../apis/admin/adminApi';
import { PasswordStrength } from '../../components/common/PasswordStrength';

// Curated Sleek Store Images
const STORE_IMAGES = [
  '/assets/hero-image.png',
  '/assets/galleryImage1.png',
  '/assets/galleryImage2.png',
  '/assets/galleryImage3.png',
  '/assets/galleryImage4.png',
];

export const getStoreImage = (name: string, index: number) => {
  const hash = (name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return STORE_IMAGES[(hash + index) % STORE_IMAGES.length];
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Determine active view from URL path
  const currentPath = location.pathname;
  let activeTab: 'overview' | 'browse' | 'top_rated' | 'reviews' | 'admin_stores' | 'admin_users' = 'overview';

  if (currentPath === '/dashboard/browse') {
    activeTab = 'browse';
  } else if (currentPath === '/dashboard/top-rated') {
    activeTab = 'top_rated';
  } else if (currentPath === '/dashboard/reviews') {
    activeTab = 'reviews';
  } else if (currentPath === '/dashboard/stores') {
    activeTab = 'admin_stores';
  } else if (currentPath === '/dashboard/users') {
    activeTab = 'admin_users';
  } else {
    activeTab = 'overview';
  }

  // Stores State
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [storesLoading, setStoresLoading] = useState(false);
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSortBy, setStoreSortBy] = useState<'name' | 'address' | 'rating'>('rating');
  const [storeSortOrder, setStoreSortOrder] = useState<'asc' | 'desc'>('desc');

  // Store Owner State
  const [ownerData, setOwnerData] = useState<StoreOwnerReviewData | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(false);

  // Admin State
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('');
  const [userSortBy, setUserSortBy] = useState<'name' | 'email' | 'address' | 'role'>('name');
  const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('asc');

  // Rating Modal State
  const [ratingModalStore, setRatingModalStore] = useState<StoreItem | null>(null);
  const [selectedScore, setSelectedScore] = useState<number>(5);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingSuccessMessage, setRatingSuccessMessage] = useState('');

  // Admin Create Store Modal
  const [createStoreModalOpen, setCreateStoreModalOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreEmail, setNewStoreEmail] = useState('');
  const [newStoreAddress, setNewStoreAddress] = useState('');
  const [newStoreOwnerId, setNewStoreOwnerId] = useState('');
  const [storeFormError, setStoreFormError] = useState('');
  const [storeFormLoading, setStoreFormLoading] = useState(false);

  // Admin Create User Modal
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserRole, setNewUserRole] = useState<'SYSTEM_ADMIN' | 'STORE_OWNER' | 'NORMAL_USER'>('NORMAL_USER');
  const [userFormError, setUserFormError] = useState('');
  const [userFormLoading, setUserFormLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  // Fetch Stores
  const fetchStores = async () => {
    setStoresLoading(true);
    try {
      const res = await storeApi.getAll({
        search: storeSearch,
        sortBy: activeTab === 'top_rated' ? 'rating' : storeSortBy,
        sortOrder: activeTab === 'top_rated' ? 'desc' : storeSortOrder,
      });
      setStores(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setStoresLoading(false);
    }
  };

  // Fetch Store Owner Reviews
  const fetchOwnerReviews = async () => {
    if (user?.role !== 'STORE_OWNER') return;
    setOwnerLoading(true);
    try {
      const res = await ratingApi.getStoreOwnerReviews();
      setOwnerData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setOwnerLoading(false);
    }
  };

  // Fetch Admin Data
  const fetchAdminData = async () => {
    if (user?.role !== 'SYSTEM_ADMIN') return;
    setAdminUsersLoading(true);
    try {
      const [metricsRes, usersRes] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getUsers({
          search: userSearch,
          role: userRoleFilter || undefined,
          sortBy: userSortBy,
          sortOrder: userSortOrder,
        }),
      ]);
      setAdminMetrics(metricsRes.data.data);
      setAdminUsers(usersRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAdminUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [storeSearch, storeSortBy, storeSortOrder, activeTab]);

  useEffect(() => {
    if (user?.role === 'STORE_OWNER') {
      fetchOwnerReviews();
    }
    if (user?.role === 'SYSTEM_ADMIN') {
      fetchAdminData();
    }
  }, [user, userSearch, userRoleFilter, userSortBy, userSortOrder]);

  // Handle Rating Submit
  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModalStore) return;
    setRatingSubmitting(true);
    try {
      await ratingApi.submitRating(ratingModalStore.id, selectedScore);
      setRatingSuccessMessage(`Rating of ${selectedScore}★ saved for ${ratingModalStore.name}!`);
      await fetchStores();
      setTimeout(() => {
        setRatingModalStore(null);
        setRatingSuccessMessage('');
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setRatingSubmitting(false);
    }
  };

  // Handle Admin Create Store
  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoreFormError('');
    if (!newStoreName || !newStoreEmail || !newStoreAddress) {
      setStoreFormError('All fields are required');
      return;
    }
    setStoreFormLoading(true);
    try {
      await storeApi.create({
        name: newStoreName,
        email: newStoreEmail,
        address: newStoreAddress,
        ownerId: newStoreOwnerId || undefined,
      });
      setCreateStoreModalOpen(false);
      setNewStoreName('');
      setNewStoreEmail('');
      setNewStoreAddress('');
      setNewStoreOwnerId('');
      fetchStores();
      if (user?.role === 'SYSTEM_ADMIN') fetchAdminData();
    } catch (err: any) {
      setStoreFormError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setStoreFormLoading(false);
    }
  };

  // Handle Admin Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError('');
    if (newUserName.length < 6 || newUserName.length > 60) {
      setUserFormError('Name must be between 6 and 60 characters');
      return;
    }
    if (!newUserAddress || newUserAddress.length > 400) {
      setUserFormError('Address is required and must not exceed 400 characters');
      return;
    }
    if (
      newUserPassword.length < 8 ||
      newUserPassword.length > 16 ||
      !/[A-Z]/.test(newUserPassword) ||
      !/[^A-Za-z0-9]/.test(newUserPassword)
    ) {
      setUserFormError(
        'Password must be 8-16 chars with at least 1 uppercase and 1 special char'
      );
      return;
    }

    setUserFormLoading(true);
    try {
      await adminApi.createUser({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        address: newUserAddress,
        role: newUserRole,
      });
      setCreateUserModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserAddress('');
      fetchAdminData();
    } catch (err: any) {
      setUserFormError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setUserFormLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Browse Stores',
      desc: 'Discover and rate top-rated neighborhood stores.',
      icon: <FilePlus size={20} />,
      color: 'purple',
      to: '/dashboard/browse',
    },
    {
      title: 'Top Rated',
      desc: 'Explore stores with the highest verified rating scores.',
      icon: <Flame size={20} />,
      color: 'orange',
      to: '/dashboard/top-rated',
    },
    {
      title: 'Search Directory',
      desc: 'Search stores by name, email, and address quickly.',
      icon: <Search size={20} />,
      color: 'emerald',
      to: '/dashboard/browse',
    },
    {
      title:
        user?.role === 'SYSTEM_ADMIN'
          ? 'User Management'
          : user?.role === 'STORE_OWNER'
          ? 'Customer Reviews'
          : 'My Reviews',
      desc:
        user?.role === 'SYSTEM_ADMIN'
          ? 'Manage system accounts and platform listings.'
          : user?.role === 'STORE_OWNER'
          ? 'View customer reviewer metrics and scores.'
          : 'Track all your submitted ratings and feedback.',
      icon: <Building2 size={20} />,
      color: 'blue',
      to:
        user?.role === 'SYSTEM_ADMIN'
          ? '/dashboard/users'
          : '/dashboard/reviews',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Background Subtle Radial Dot Grid */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#001BB7 0.5px, transparent 0.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Sidebar with dynamic active links */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-30 shrink-0 h-full select-none`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 font-bold text-xl tracking-tight text-black">
            <span>RateHub</span>
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block mb-1"></span>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Dashboard Section */}
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 block mb-2">
              DASHBOARD
            </span>
            <Link
              to="/dashboard"
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition text-left ${
                activeTab === 'overview'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
            >
              <LayoutGrid size={18} />
              <span>Overview</span>
            </Link>
          </div>

          {/* Stores & Ratings Section */}
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 block mb-2">
              STORES & RATINGS
            </span>
            <div className="space-y-1 text-sm font-medium text-gray-600">
              <Link
                to="/dashboard/browse"
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left ${
                  activeTab === 'browse'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Search size={18} className={activeTab === 'browse' ? 'text-blue-600' : 'text-gray-400'} />
                <span>Browse Stores</span>
              </Link>

              <Link
                to="/dashboard/top-rated"
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left ${
                  activeTab === 'top_rated'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Flame size={18} className={activeTab === 'top_rated' ? 'text-blue-600' : 'text-gray-400'} />
                <span>Top Rated</span>
              </Link>

              <Link
                to="/dashboard/reviews"
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left ${
                  activeTab === 'reviews'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Star size={18} className={activeTab === 'reviews' ? 'text-blue-600' : 'text-gray-400'} />
                <span>{user?.role === 'STORE_OWNER' ? 'Customer Reviews' : 'My Reviews'}</span>
              </Link>
            </div>
          </div>

          {/* Administration Section */}
          {user?.role === 'SYSTEM_ADMIN' && (
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 block mb-2">
                ADMINISTRATION
              </span>
              <div className="space-y-1 text-sm font-medium text-gray-600">
                <Link
                  to="/dashboard/stores"
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left ${
                    activeTab === 'admin_stores'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <Building2 size={18} className={activeTab === 'admin_stores' ? 'text-blue-600' : 'text-gray-400'} />
                  <span>Store Directory</span>
                </Link>
                <Link
                  to="/dashboard/users"
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition text-left ${
                    activeTab === 'admin_users'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <Users size={18} className={activeTab === 'admin_users' ? 'text-blue-600' : 'text-gray-400'} />
                  <span>User Management</span>
                </Link>
              </div>
            </div>
          )}

          {/* Settings Section */}
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 block mb-2">
              SETTINGS
            </span>
            <div className="space-y-1 text-sm font-medium text-gray-600">
              <Link
                to="/change-password"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-gray-100 hover:text-black transition"
              >
                <KeyRound size={18} className="text-gray-400" />
                <span>Change Password</span>
              </Link>
            </div>
          </div>
        </div>

        {/* User Card at bottom */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 border border-gray-200/60 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-900 truncate">
                {user?.name || 'Rupesh Jagtap'}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                {user?.role === 'SYSTEM_ADMIN'
                  ? 'System Admin'
                  : user?.role === 'STORE_OWNER'
                  ? 'Store Owner'
                  : 'Normal User'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="text-sm font-semibold text-gray-700">
              {activeTab === 'overview'
                ? 'Dashboard Overview'
                : activeTab === 'browse'
                ? 'Browse All Stores'
                : activeTab === 'top_rated'
                ? 'Top Rated Stores'
                : activeTab === 'reviews'
                ? user?.role === 'STORE_OWNER'
                  ? 'Customer Reviews'
                  : 'My Submitted Ratings'
                : activeTab === 'admin_stores'
                ? 'Store Directory (Admin)'
                : 'User Management (Admin)'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-100 shadow-sm cursor-pointer"
              >
                {getInitials(user?.name)}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-blue-600 font-medium truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/change-password"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <KeyRound size={14} />
                    <span>Change Password</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Content Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-10 max-w-6xl w-full mx-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Quick Actions */}
              <div>
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
                  QUICK ACTIONS
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.title}
                      to={action.to}
                      className="text-left flex flex-col items-start p-6 rounded-2xl border border-gray-200 bg-white hover:border-blue-500/50 hover:shadow-md transition-all group shadow-xs cursor-pointer"
                    >
                      <div
                        className={`p-3 rounded-xl transition-all group-hover:scale-110 mb-4 ${
                          action.color === 'purple'
                            ? 'bg-purple-50 text-purple-600'
                            : action.color === 'blue'
                            ? 'bg-blue-50 text-blue-600'
                            : action.color === 'emerald'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-orange-50 text-orange-600'
                        }`}
                      >
                        {action.icon}
                      </div>
                      <h3 className="font-bold text-black text-sm mb-1">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {action.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Admin Platform Metrics if Admin */}
              {user?.role === 'SYSTEM_ADMIN' && adminMetrics && (
                <div>
                  <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
                    ADMIN PLATFORM STATS
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Total Registered Users</span>
                        <p className="text-3xl font-bold text-black mt-2">{adminMetrics.totalUsers}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users size={22} />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Total Registered Stores</span>
                        <p className="text-3xl font-bold text-black mt-2">{adminMetrics.totalStores}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Building2 size={22} />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Total Ratings Submitted</span>
                        <p className="text-3xl font-bold text-black mt-2">{adminMetrics.totalRatings}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Star size={22} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Versions / Ratings Card matching screenshot */}
              <div>
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
                  RECENT RATINGS & REVIEWS
                </h2>
                <div className="rounded-2xl border border-gray-200 bg-white p-12 flex flex-col items-center justify-center text-center shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <Clock size={24} />
                  </div>
                  <h3 className="text-base font-bold text-black mb-1">
                    {user?.role === 'STORE_OWNER'
                      ? `${ownerData?.totalRatings || 0} Ratings Received for Your Store`
                      : 'Explore Neighborhood Stores'}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
                    {user?.role === 'STORE_OWNER'
                      ? 'View reviewer names, ratings, and customer feedback breakdown in real time.'
                      : 'Discover verified registered stores, browse reviews, and submit your 1 to 5 star scores.'}
                  </p>
                  <Link
                    to={user?.role === 'STORE_OWNER' ? '/dashboard/reviews' : '/dashboard/browse'}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95 inline-block"
                  >
                    {user?.role === 'STORE_OWNER'
                      ? 'View Customer Feedback'
                      : 'Browse & Rate Stores'}
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: STORES BROWSER / TOP RATED / ADMIN STORES */}
          {(activeTab === 'browse' || activeTab === 'top_rated' || activeTab === 'admin_stores') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    {activeTab === 'top_rated'
                      ? 'Top Rated Stores'
                      : activeTab === 'admin_stores'
                      ? 'Store Directory Management'
                      : 'Explore Registered Stores'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {activeTab === 'top_rated'
                      ? 'Highest rated cafes, boutiques, and bookshops'
                      : 'Search, explore, and rate neighborhood businesses on RateHub'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Toggle: Cards vs Table */}
                  <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/80">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        viewMode === 'cards'
                          ? 'bg-white text-blue-600 shadow-xs'
                          : 'text-gray-500 hover:text-black'
                      }`}
                      title="Card Grid View"
                    >
                      <LayoutGrid size={15} />
                      <span className="hidden sm:inline">Cards</span>
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        viewMode === 'table'
                          ? 'bg-white text-blue-600 shadow-xs'
                          : 'text-gray-500 hover:text-black'
                      }`}
                      title="Table List View"
                    >
                      <List size={15} />
                      <span className="hidden sm:inline">Table</span>
                    </button>
                  </div>

                  {user?.role === 'SYSTEM_ADMIN' && (
                    <button
                      onClick={() => setCreateStoreModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer w-fit"
                    >
                      <Plus size={16} />
                      <span>Add Store</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Search and Sort Controls */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Name or Address..."
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-black focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <SlidersHorizontal size={14} />
                    <span>Sort by:</span>
                  </div>
                  <select
                    value={storeSortBy}
                    onChange={(e) => setStoreSortBy(e.target.value as any)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:outline-hidden"
                  >
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                    <option value="address">Address</option>
                  </select>
                  <button
                    onClick={() => setStoreSortOrder(storeSortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                    title="Toggle Sort Order"
                  >
                    <ArrowUpDown size={14} />
                  </button>
                </div>
              </div>

              {/* STORES CONTENT */}
              {storesLoading ? (
                <div className="p-16 text-center text-gray-400 flex items-center justify-center gap-2 bg-white rounded-2xl border border-gray-200">
                  <Loader2 size={20} className="animate-spin text-blue-600" />
                  <span>Loading stores directory...</span>
                </div>
              ) : stores.length === 0 ? (
                <div className="p-16 text-center text-gray-500 text-sm bg-white rounded-2xl border border-gray-200">
                  No stores found matching your search.
                </div>
              ) : viewMode === 'cards' ? (
                /* CARD GRID VIEW WITH SLEEK STORE IMAGES */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores.map((store, index) => (
                    <div
                      key={store.id}
                      className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col group"
                    >
                      {/* Store Image Frame */}
                      <div className="h-44 w-full relative overflow-hidden bg-gray-100">
                        <img
                          src={getStoreImage(store.name, index)}
                          alt={store.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Rating Badge */}
                        <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1">
                          <Star size={13} className="fill-amber-500 text-amber-500" />
                          <span className="font-bold text-xs text-gray-900">
                            {store.averageRating || '0.0'}
                          </span>
                          <span className="text-[10px] text-gray-400">({store.totalRatings})</span>
                        </div>
                      </div>

                      {/* Store Details Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="font-bold text-base text-black group-hover:text-blue-600 transition-colors line-clamp-1">
                            {store.name}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1.5">
                            <MapPin size={13} className="text-gray-400 shrink-0" />
                            <span className="truncate">{store.address}</span>
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                            <Mail size={13} className="text-gray-400 shrink-0" />
                            <span className="truncate">{store.email}</span>
                          </p>
                        </div>

                        {/* User Rating Status & Action Button */}
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                          <div className="text-xs">
                            {store.userRating ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg text-[11px]">
                                <Star size={11} className="fill-blue-600 text-blue-600" />
                                Your Score: {store.userRating}★
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[11px] italic">Not rated</span>
                            )}
                          </div>

                          {user?.role === 'NORMAL_USER' && (
                            <button
                              onClick={() => {
                                setRatingModalStore(store);
                                setSelectedScore(store.userRating || 5);
                              }}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-95"
                            >
                              {store.userRating ? 'Modify Rating' : 'Rate Store'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* TABLE LIST VIEW */
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="px-6 py-3.5">Store Details</th>
                          <th className="px-6 py-3.5">Contact Email</th>
                          <th className="px-6 py-3.5">Address</th>
                          <th className="px-6 py-3.5">Overall Rating</th>
                          <th className="px-6 py-3.5">My Rating</th>
                          <th className="px-6 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {stores.map((store, index) => (
                          <tr key={store.id} className="hover:bg-gray-50/70 transition">
                            <td className="px-6 py-4 font-bold text-black flex items-center gap-3">
                              <img
                                src={getStoreImage(store.name, index)}
                                alt=""
                                className="w-10 h-10 rounded-xl object-cover shrink-0"
                              />
                              <div>
                                <p className="font-bold text-black">{store.name}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{store.email}</td>
                            <td className="px-6 py-4 text-gray-600">{store.address}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg">
                                <Star size={12} className="fill-amber-500 text-amber-500" />
                                {store.averageRating || '0.0'}
                                <span className="text-[10px] text-gray-400 font-normal">
                                  ({store.totalRatings})
                                </span>
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {store.userRating ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg">
                                  <Star size={12} className="fill-blue-600 text-blue-600" />
                                  {store.userRating}★
                                </span>
                              ) : (
                                <span className="text-gray-400 italic">Not rated</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {user?.role === 'NORMAL_USER' && (
                                <button
                                  onClick={() => {
                                    setRatingModalStore(store);
                                    setSelectedScore(store.userRating || 5);
                                  }}
                                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition cursor-pointer"
                                >
                                  {store.userRating ? 'Modify' : 'Rate'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REVIEWS TAB (Customer Reviews for Store Owner / My Ratings for Normal User) */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-black">
                  {user?.role === 'STORE_OWNER' ? 'Customer Feedback & Reviews' : 'My Submitted Ratings'}
                </h2>
                <p className="text-xs text-gray-500">
                  {user?.role === 'STORE_OWNER'
                    ? 'Verified customer ratings and review submissions for your store'
                    : 'Manage and modify your past reviews across stores'}
                </p>
              </div>

              {user?.role === 'STORE_OWNER' ? (
                <>
                  {/* Store Average Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Average Store Rating</span>
                        <p className="text-3xl font-bold text-black mt-2">
                          {ownerData?.averageRating || '0.0'}{' '}
                          <span className="text-sm font-normal text-gray-400">/ 5.0</span>
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Star size={24} className="fill-amber-500 text-amber-500" />
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Total Customer Ratings</span>
                        <p className="text-3xl font-bold text-black mt-2">
                          {ownerData?.totalRatings || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users size={24} />
                      </div>
                    </div>
                  </div>

                  {/* Reviewers Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="text-sm font-bold text-black">Customer Ratings List</h3>
                      <p className="text-xs text-gray-500">
                        Names, contact emails, addresses, and scores of customers who reviewed your store
                      </p>
                    </div>

                    {ownerLoading ? (
                      <div className="p-12 text-center text-gray-400">Loading reviews...</div>
                    ) : (ownerData?.ratings.length || 0) === 0 ? (
                      <div className="p-12 text-center text-gray-500 text-sm">
                        No customers have submitted ratings for your store yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                            <tr>
                              <th className="px-6 py-3.5">Customer Name</th>
                              <th className="px-6 py-3.5">Email</th>
                              <th className="px-6 py-3.5">Address</th>
                              <th className="px-6 py-3.5">Rating</th>
                              <th className="px-6 py-3.5 text-right">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700">
                            {ownerData?.ratings.map((r) => (
                              <tr key={r.id} className="hover:bg-gray-50/70 transition">
                                <td className="px-6 py-4 font-bold text-black">{r.user.name}</td>
                                <td className="px-6 py-4 text-gray-500">{r.user.email}</td>
                                <td className="px-6 py-4 text-gray-600">{r.user.address}</td>
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg">
                                    <Star size={12} className="fill-amber-500 text-amber-500" />
                                    {r.value} Stars
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-400">
                                  {new Date(r.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Normal User Ratings List */
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-black">Your Reviews</h3>
                    <p className="text-xs text-gray-500">
                      Stores you have rated on RateHub
                    </p>
                  </div>

                  <div className="p-6">
                    {stores.filter((s) => s.userRating).length === 0 ? (
                      <div className="text-center py-12 text-gray-500 text-sm">
                        You haven't submitted ratings for any stores yet.{' '}
                        <Link to="/dashboard/browse" className="text-blue-600 font-semibold hover:underline">
                          Browse stores to rate now
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stores
                          .filter((s) => s.userRating)
                          .map((store, index) => (
                            <div
                              key={store.id}
                              className="p-5 rounded-2xl border border-gray-200 bg-white flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={getStoreImage(store.name, index)}
                                  alt=""
                                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                                />
                                <div>
                                  <h4 className="font-bold text-sm text-black">{store.name}</h4>
                                  <p className="text-xs text-gray-500">{store.address}</p>
                                  <span className="inline-flex items-center gap-1 font-bold text-blue-600 text-xs mt-1">
                                    <Star size={12} className="fill-blue-600" />
                                    Your Score: {store.userRating}★
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setRatingModalStore(store);
                                  setSelectedScore(store.userRating || 5);
                                }}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition cursor-pointer"
                              >
                                Modify
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADMIN USERS MANAGEMENT */}
          {activeTab === 'admin_users' && user?.role === 'SYSTEM_ADMIN' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-black">User Management</h2>
                  <p className="text-xs text-gray-500">
                    Manage system administrators, store owners, and normal users
                  </p>
                </div>

                <button
                  onClick={() => setCreateUserModalOpen(true)}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer w-fit"
                >
                  <UserPlus size={16} />
                  <span>Add New User</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Name, Email or Address..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-black focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:outline-hidden"
                  >
                    <option value="">All Roles</option>
                    <option value="SYSTEM_ADMIN">Admin</option>
                    <option value="STORE_OWNER">Store Owner</option>
                    <option value="NORMAL_USER">Normal User</option>
                  </select>

                  <select
                    value={userSortBy}
                    onChange={(e) => setUserSortBy(e.target.value as any)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:outline-hidden"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="address">Sort by Address</option>
                    <option value="role">Sort by Role</option>
                  </select>

                  <button
                    onClick={() => setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                    title="Toggle Sort Order"
                  >
                    <ArrowUpDown size={14} />
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                {adminUsersLoading ? (
                  <div className="p-12 text-center text-gray-400">Loading user records...</div>
                ) : adminUsers.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 text-sm">
                    No users found matching your search.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="px-6 py-3.5">Full Name</th>
                          <th className="px-6 py-3.5">Email</th>
                          <th className="px-6 py-3.5">Address</th>
                          <th className="px-6 py-3.5">Role</th>
                          <th className="px-6 py-3.5">Store & Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {adminUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50/70 transition">
                            <td className="px-6 py-4 font-bold text-black">{u.name}</td>
                            <td className="px-6 py-4 text-gray-500">{u.email}</td>
                            <td className="px-6 py-4 text-gray-600">{u.address}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  u.role === 'SYSTEM_ADMIN'
                                    ? 'bg-purple-100 text-purple-700'
                                    : u.role === 'STORE_OWNER'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {u.role === 'SYSTEM_ADMIN'
                                  ? 'Admin'
                                  : u.role === 'STORE_OWNER'
                                  ? 'Store Owner'
                                  : 'Normal User'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {u.store ? (
                                <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
                                  {u.store.name}
                                  <span className="text-amber-600 font-bold ml-1">
                                    ★ {u.store.rating || '0.0'}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* RATING SUBMISSION MODAL */}
      {ratingModalStore && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-black">Rate {ratingModalStore.name}</h3>
                <p className="text-xs text-gray-500">{ratingModalStore.address}</p>
              </div>
              <button
                onClick={() => setRatingModalStore(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {ratingSuccessMessage ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{ratingSuccessMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-6">
                <div className="space-y-2 text-center py-4">
                  <label className="text-xs font-semibold text-gray-600 block">
                    Choose Your 1 to 5 Star Rating:
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setSelectedScore(score)}
                        className={`p-3 rounded-2xl transition cursor-pointer ${
                          selectedScore >= score
                            ? 'bg-amber-100 text-amber-500 scale-105'
                            : 'bg-gray-100 text-gray-300'
                        }`}
                      >
                        <Star size={24} className={selectedScore >= score ? 'fill-amber-500' : ''} />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-800 mt-2 block">
                    {selectedScore} out of 5 Stars
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRatingModalStore(null)}
                    className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={ratingSubmitting}
                    className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {ratingSubmitting && <Loader2 size={14} className="animate-spin" />}
                    <span>Submit Rating</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ADMIN CREATE STORE MODAL */}
      {createStoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-black">Add New Store</h3>
                <p className="text-xs text-gray-500">Register a store on RateHub</p>
              </div>
              <button
                onClick={() => setCreateStoreModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {storeFormError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium">
                {storeFormError}
              </div>
            )}

            <form onSubmit={handleCreateStore} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Store Name</label>
                <input
                  type="text"
                  placeholder="e.g. Modern Artisan Bakery"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-black focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Contact Email</label>
                <input
                  type="email"
                  placeholder="contact@store.com"
                  value={newStoreEmail}
                  onChange={(e) => setNewStoreEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-black focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Address (Max 400 chars)</label>
                <textarea
                  rows={2}
                  placeholder="123 Main Street, Central Plaza"
                  value={newStoreAddress}
                  onChange={(e) => setNewStoreAddress(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-black focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Assign Store Owner (Optional)</label>
                <select
                  value={newStoreOwnerId}
                  onChange={(e) => setNewStoreOwnerId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-black focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a registered Store Owner</option>
                  {adminUsers
                    .filter((u) => u.role === 'STORE_OWNER')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateStoreModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={storeFormLoading}
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  {storeFormLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>Create Store</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN CREATE USER MODAL */}
      {createUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-black">Add New User</h3>
                <p className="text-xs text-gray-500">Create an Admin, Store Owner or Normal User</p>
              </div>
              <button
                onClick={() => setCreateUserModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {userFormError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium">
                {userFormError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-700">Full Name</label>
                  <span className="text-[10px] text-gray-400">{newUserName.length}/60 (Min 6)</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Jonathan Alexander Miller"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-black focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-black focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">User Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-black focus:ring-2 focus:ring-purple-500"
                >
                  <option value="NORMAL_USER">Normal User</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="SYSTEM_ADMIN">System Administrator</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Address (Max 400 chars)</label>
                <textarea
                  rows={2}
                  placeholder="742 Evergreen Terrace, Sector 4"
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-black focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-black focus:ring-2 focus:ring-purple-500"
                />
                <PasswordStrength password={newUserPassword} />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateUserModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userFormLoading}
                  className="w-1/2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  {userFormLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

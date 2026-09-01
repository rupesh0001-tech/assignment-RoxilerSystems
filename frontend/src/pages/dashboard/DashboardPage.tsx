import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutGrid,
  FilePlus,
  Edit,
  Search,
  Users,
  Building2,
  Star,
  Clock,
  Sparkles,
  RefreshCw,
  LogOut,
  KeyRound,
  ExternalLink,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const quickActions = [
    {
      title: 'Browse Stores',
      desc: 'Discover and rate top-rated neighborhood stores.',
      icon: <FilePlus size={20} />,
      color: 'purple',
      href: '/',
    },
    {
      title: 'Write Review',
      desc: 'Submit transparent 1 to 5 star verified store ratings.',
      icon: <Edit size={20} />,
      color: 'blue',
      href: '/',
    },
    {
      title: 'Search Directory',
      desc: 'Search stores by name, email, and address quickly.',
      icon: <Search size={20} />,
      color: 'emerald',
      href: '/',
    },
    {
      title: 'Store Analytics',
      desc: 'View reviewer metrics, averages, and store stats.',
      icon: <Building2 size={20} />,
      color: 'orange',
      href: '/dashboard',
    },
  ];

  const sampleStores = [
    {
      id: '1',
      name: 'Brew & Bloom Specialty Cafe',
      email: 'owner@brewnbloom.com',
      address: '142 Market Street, Arts District',
      rating: 4.8,
      totalRatings: 34,
    },
    {
      id: '2',
      name: 'Artisan Boutique Apparel',
      email: 'contact@artisanboutique.com',
      address: '88 Fashion Avenue, Midtown',
      rating: 4.6,
      totalRatings: 21,
    },
    {
      id: '3',
      name: 'The Book & Brew Corner',
      email: 'hello@bookandbrew.com',
      address: '52 University Way, Westside',
      rating: 4.9,
      totalRatings: 58,
    },
  ];

  const filteredStores = sampleStores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Sidebar matching screenshot */}
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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm transition"
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
                to="/"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-gray-100 hover:text-black transition"
              >
                <Search size={18} className="text-gray-400" />
                <span>Browse Stores</span>
              </Link>
              <Link
                to="/"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-gray-100 hover:text-black transition"
              >
                <Star size={18} className="text-gray-400" />
                <span>Top Rated</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-gray-100 hover:text-black transition"
              >
                <ShieldCheck size={18} className="text-gray-400" />
                <span>My Reviews</span>
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
                  to="/dashboard"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-gray-100 hover:text-black transition"
                >
                  <Building2 size={18} className="text-gray-400" />
                  <span>Store Directory</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-gray-100 hover:text-black transition"
                >
                  <Users size={18} className="text-gray-400" />
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
              <Link
                to="/"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-gray-100 hover:text-black transition"
              >
                <ExternalLink size={18} className="text-gray-400" />
                <span>Landing Page</span>
              </Link>
            </div>
          </div>
        </div>

        {/* User Card at bottom matching screenshot */}
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
        {/* Header matching screenshot */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="text-sm font-semibold text-gray-700">
              Dashboard Overview
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Verified Credits Badge matching screenshot */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/70 border border-amber-200/70 text-amber-900 font-bold text-xs shadow-xs">
              <Coins size={14} className="text-amber-500" />
              <span>5.0 Credits</span>
            </div>

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

        {/* Dashboard Main Content matching screenshot */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-10 max-w-6xl w-full mx-auto">
          {/* Quick Actions */}
          <div>
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
              QUICK ACTIONS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.href}
                  className="text-left flex flex-col items-start p-6 rounded-2xl border border-gray-200 bg-white hover:border-blue-500/50 hover:shadow-md transition-all group shadow-xs"
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
                No Reviews Submitted Yet
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
                Explore registered neighborhood stores and submit your first verified 1 to 5 star rating.
              </p>
              <Link
                to="/"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                Browse & Rate Stores
              </Link>
            </div>
          </div>

          {/* Bottom 2-Column: Sync Profile & Tracker matching screenshot */}
          <div>
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
              SYNC STORE DIRECTORY & RATING METRICS
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sync Card */}
              <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs mb-3">
                    <Sparkles size={16} className="animate-pulse" />
                    <span>Store Directory Active</span>
                  </div>
                  <h3 className="text-base font-bold text-black mb-2">
                    Your Store Reviews & Ratings are Synced
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    You can discover verified stores, submit transparent 1-to-5 star scores, and modify your past reviews anytime. Use the sync button below to refresh real-time metrics.
                  </p>
                </div>

                <div className="relative z-10">
                  <Link
                    to="/"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <RefreshCw size={14} />
                    <span>Sync Changes</span>
                  </Link>
                </div>
              </div>

              {/* Right Limits / Stats Tracker Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs mb-4">
                    <Sparkles size={16} />
                    <span>Rating Activity Tracker</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                        <span>Ratings Submitted</span>
                        <span className="text-black font-bold">5</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: '60%' }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                        <span>Average Score Given</span>
                        <span className="text-blue-600 font-bold">4.8 / 5.0</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: '96%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] text-gray-500 flex justify-between">
                  <span>Stores Explored</span>
                  <span className="font-bold text-gray-800">12 Stores</span>
                </div>
              </div>
            </div>
          </div>

          {/* Searchable Stores Directory Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-black">
                  Registered Stores Directory
                </h3>
                <p className="text-xs text-gray-500">
                  Search stores by name, email, or address
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-black focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Store Name</th>
                    <th className="px-6 py-3.5">Contact Email</th>
                    <th className="px-6 py-3.5">Address</th>
                    <th className="px-6 py-3.5">Rating</th>
                    <th className="px-6 py-3.5 text-right">Reviews</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-bold text-black">
                        {store.name}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{store.email}</td>
                      <td className="px-6 py-4 text-gray-600">{store.address}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg">
                          <Star size={12} className="fill-amber-500 text-amber-500" />
                          {store.rating}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-500">
                        {store.totalRatings} reviews
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

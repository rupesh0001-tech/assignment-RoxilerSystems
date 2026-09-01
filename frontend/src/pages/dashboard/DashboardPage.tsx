import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Star,
  Users,
  LogOut,
  KeyRound,
  Bell,
  ChevronDown,
  Building2,
  TrendingUp,
  MapPin,
  ExternalLink,
  Sparkles,
  Search,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  // Sample data for demo listings
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
      {/* Background Radial Dots */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#7c3aed 0.5px, transparent 0.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Sidebar matching design.txt */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20 shrink-0`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          {sidebarOpen ? (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                R
              </div>
              <span className="font-bold text-lg text-black">
                Rate<span className="text-purple-600">Hub</span>
              </span>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm mx-auto shadow-sm">
              R
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-purple-50 text-purple-700 font-semibold text-sm transition"
          >
            <TrendingUp size={18} className="text-purple-600" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link
            to="/change-password"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-600 hover:text-black hover:bg-gray-100 font-medium text-sm transition"
          >
            <KeyRound size={18} className="text-gray-400" />
            {sidebarOpen && <span>Change Password</span>}
          </Link>

          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-600 hover:text-black hover:bg-gray-100 font-medium text-sm transition"
          >
            <ExternalLink size={18} className="text-gray-400" />
            {sidebarOpen && <span>Landing Page</span>}
          </Link>
        </nav>

        {/* User Card at bottom */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
              {getInitials(user?.name)}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-purple-600 font-semibold uppercase tracking-wider">
                  {user?.role === 'SYSTEM_ADMIN'
                    ? 'Admin'
                    : user?.role === 'STORE_OWNER'
                    ? 'Store Owner'
                    : 'Normal User'}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Header matching design.txt */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-black">Dashboard Overview</h1>
            <p className="text-xs text-gray-500">
              Signed in as{' '}
              <span className="font-semibold text-purple-600">
                {user?.role === 'SYSTEM_ADMIN'
                  ? 'System Administrator'
                  : user?.role === 'STORE_OWNER'
                  ? 'Store Owner'
                  : 'Normal User'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-100 rounded-xl transition cursor-pointer border border-gray-200"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {getInitials(user?.name)}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-semibold text-gray-900 block leading-tight">
                    {user?.name?.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5 z-30">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Account</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-purple-600 font-medium">
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

        {/* Dashboard Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Welcome Banner matching design.txt */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm backdrop-blur-xl">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-purple-100">
                  <Sparkles size={22} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Welcome, {user?.name}!
                  </h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{user?.address}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/change-password"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
                >
                  Change Password
                </Link>
                <Link
                  to="/"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  Explore Directory
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats Tracker matching design.txt */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
              Platform Metrics & Stats
            </h3>

            {user?.role === 'SYSTEM_ADMIN' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      Total Registered Users
                    </span>
                    <p className="text-3xl font-bold text-black mt-2">3</p>
                    <span className="text-[11px] text-green-600 font-semibold mt-1 inline-block">
                      +100% Verified
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      Total Stores Registered
                    </span>
                    <p className="text-3xl font-bold text-black mt-2">3</p>
                    <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">
                      All Active
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      Submitted Store Ratings
                    </span>
                    <p className="text-3xl font-bold text-black mt-2">113</p>
                    <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
                      1-5 Star Scale
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Star size={24} />
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'STORE_OWNER' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      Average Store Rating
                    </span>
                    <p className="text-3xl font-bold text-black mt-2">
                      {user?.storeInfo?.averageRating || '4.8'}{' '}
                      <span className="text-sm font-normal text-gray-400">
                        / 5.0
                      </span>
                    </p>
                    <span className="text-[11px] text-green-600 font-semibold mt-1 inline-block">
                      Excellent Standing
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                    <Star size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      Total Customer Reviews
                    </span>
                    <p className="text-3xl font-bold text-black mt-2">
                      {user?.storeInfo?.totalRatings || '34'}
                    </p>
                    <span className="text-[11px] text-blue-600 font-semibold mt-1 inline-block">
                      Verified Shoppers
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users size={24} />
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'NORMAL_USER' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      My Submitted Ratings
                    </span>
                    <p className="text-3xl font-bold text-black mt-2">5</p>
                    <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">
                      Active Reviews
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Star size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      Average Score Given
                    </span>
                    <p className="text-3xl font-bold text-black mt-2">
                      4.7 <span className="text-sm text-gray-400 font-normal">/ 5.0</span>
                    </p>
                    <span className="text-[11px] text-green-600 font-semibold mt-1 inline-block">
                      High Quality Feedback
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">
                      Stores Explored
                    </span>
                    <p className="text-3xl font-bold text-black mt-2">12</p>
                    <span className="text-[11px] text-blue-600 font-semibold mt-1 inline-block">
                      In Your Neighborhood
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Cards matching design.txt */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Link
                to="/"
                className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-5 text-white shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between h-32"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Browse Stores</span>
                  <Plus size={18} />
                </div>
                <p className="text-xs text-purple-100">
                  Find & rate neighborhood cafes and boutiques
                </p>
              </Link>

              <Link
                to="/change-password"
                className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-5 text-white shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between h-32"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Security & Password</span>
                  <KeyRound size={18} />
                </div>
                <p className="text-xs text-blue-100">
                  Update your authentication credentials securely
                </p>
              </Link>

              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-5 text-white shadow-sm flex flex-col justify-between h-32">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Verified Ratings</span>
                  <Star size={18} />
                </div>
                <p className="text-xs text-emerald-100">
                  All 1-to-5 star scores are cryptographically tracked
                </p>
              </div>
            </div>
          </div>

          {/* Stores Directory Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-black">
                  Registered Stores Directory
                </h3>
                <p className="text-xs text-gray-500">
                  Search stores by name, email, or address
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-black focus:outline-hidden focus:ring-2 focus:ring-purple-500/50"
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
                    <th className="px-6 py-3.5">Average Rating</th>
                    <th className="px-6 py-3.5 text-right">Reviews</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-semibold text-black">
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
                        {store.totalRatings} ratings
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

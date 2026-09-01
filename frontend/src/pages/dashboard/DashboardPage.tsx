import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Store,
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
} from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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

  const SIDEBAR_ITEMS = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: TrendingUp,
      badge: null,
    },
    {
      label: 'Change Password',
      href: '/change-password',
      icon: KeyRound,
      badge: null,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <Store className="w-6 h-6 text-blue-400" />
              <span>RateHub</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition text-slate-200 hover:text-white group text-sm font-medium"
              >
                <Icon className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-white" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}

          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition text-slate-200 hover:text-white group text-sm font-medium"
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-white" />
            {sidebarOpen && <span>Landing Page</span>}
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition text-slate-200 hover:text-white text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Role:{' '}
              <span className="font-semibold text-blue-600">
                {user?.role}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                  {getInitials(user?.name)}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-sm font-medium text-gray-800 block leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-xs text-gray-500 block leading-tight">
                    {user?.email}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                    <p className="text-xs text-blue-600 font-medium">{user?.role}</p>
                  </div>
                  <Link
                    to="/change-password"
                    onClick={() => setProfileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-2">
                {user?.role === 'SYSTEM_ADMIN'
                  ? 'System Administrator'
                  : user?.role === 'STORE_OWNER'
                  ? 'Store Owner'
                  : 'Normal User'}
              </div>
              <h3 className="text-xl font-bold text-gray-900">Welcome, {user?.name}!</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                {user?.address}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/change-password"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
              >
                Change Password
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Role Stats Section matching design.txt */}
          {user?.role === 'SYSTEM_ADMIN' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Users Card */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
                    </div>
                    <Users className="w-10 h-10 text-blue-500 opacity-40" />
                  </div>
                </div>

                {/* Total Stores Card */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Stores</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
                    </div>
                    <Store className="w-10 h-10 text-purple-500 opacity-40" />
                  </div>
                </div>

                {/* Total Ratings Card */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Ratings</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
                    </div>
                    <Star className="w-10 h-10 text-orange-500 opacity-40" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {user?.role === 'STORE_OWNER' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Store Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Average Rating Card */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Average Store Rating</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {user?.storeInfo?.averageRating || '4.5'}{' '}
                        <span className="text-lg text-gray-500 font-normal">/ 5.0</span>
                      </p>
                    </div>
                    <Star className="w-10 h-10 text-green-500 opacity-40" />
                  </div>
                </div>

                {/* Total Ratings Count */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Customer Ratings</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {user?.storeInfo?.totalRatings || '2'}
                      </p>
                    </div>
                    <Building2 className="w-10 h-10 text-blue-500 opacity-40" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {user?.role === 'NORMAL_USER' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">User Activity</h3>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    Ready to rate your favorite stores?
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Explore registered local businesses, submit ratings, and share genuine feedback.
                  </p>
                </div>
                <Link
                  to="/"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition"
                >
                  Browse Stores
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

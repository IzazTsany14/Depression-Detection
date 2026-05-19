import React from 'react';
import { Link } from 'react-router';
import { Brain, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { ProfileAvatar } from './ProfileAvatar';

export const Header: React.FC = () => {
  const { user, isGuest, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-gray-900">MindCheck</span>
              <p className="text-xs text-gray-500">Deteksi Dini Depresi</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            {(!user || user.role === 'student') && (
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                Tentang DASS-21
              </Link>
            )}
            {user && !isGuest && user.role === 'student' && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/guide" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Panduan
                </Link>
              </>
            )}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard Admin
              </Link>
            )}
            {user && user.role === 'bk' && (
              <Link to="/bk" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard BK
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            {user && !isGuest ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Link
                    to={user.role === 'admin' ? '/admin' : user.role === 'bk' ? '/bk' : '/dashboard'}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ProfileAvatar
                      profilePicture={user.profile_picture}
                      className="w-9 h-9"
                      iconClassName="w-5 h-5 text-blue-700"
                      fallbackClassName="bg-blue-100"
                      alt={`Foto profil ${user.name}`}
                    />
                    <div className="text-left">
                      <span className="text-sm font-medium text-gray-700 block">{user.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{user.role === 'bk' ? 'Konselor BK' : user.role}</span>
                    </div>
                  </Link>
                  {user.role === 'student' && (
                    <Link to="/student/profile">
                      <Button variant="outline" size="sm">
                        Profil
                      </Button>
                    </Link>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                    Login
                  </Button>
                </Link>
                
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 ml-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beranda
              </Link>
              {(!user || user.role === 'student') && (
                <Link
                  to="/about"
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tentang DASS-21
                </Link>
              )}
              {user && !isGuest && user.role === 'student' && (
                <>
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/guide"
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Panduan
                  </Link>
                </>
              )}
              {user && user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard Admin
                </Link>
              )}
              {user && user.role === 'bk' && (
                <Link
                  to="/bk"
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard BK
                </Link>
              )}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {user && !isGuest ? (
                  <>
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium text-gray-700">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user.role === 'bk' ? 'Konselor BK' : user.role}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-center bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >Login</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};







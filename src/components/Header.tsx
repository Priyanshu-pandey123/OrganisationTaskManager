import { Link } from 'react-router-dom';
import { Menu, X, Layers } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Layers className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <span className="text-2xl font-bold text-gray-900">
             Task Manager
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Services
            </Link>
            <Link to="/#products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Products
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contact
            </Link>
            <Link
              to="/contact"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/#services"
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/#products"
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/contact"
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/contact"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}


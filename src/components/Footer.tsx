import { Link } from 'react-router-dom';
import { Linkedin, Github, Twitter, Mail, Phone, MapPin, Layers } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Layers className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Mishra IT
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Delivering cutting-edge IT solutions for crypto, remittance, and enterprise needs.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#services" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/#products" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">Blockchain Solutions</li>
              <li className="text-gray-600 text-sm">Crypto Exchanges</li>
              <li className="text-gray-600 text-sm">Remittance Systems</li>
              <li className="text-gray-600 text-sm">SAAS/PAAS Development</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-600 text-sm">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>contact@mishrait.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 text-sm">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © 2025 Mishra IT Solutions. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


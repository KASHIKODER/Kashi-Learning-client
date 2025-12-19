import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin, 
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowUp
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-0 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{animationDelay: '4s'}}></div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                EduLearn
              </span>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transform your career with our world-class online courses. Learn from industry experts and join thousands of successful students worldwide.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: FiFacebook, href: "#", color: "hover:text-blue-400" },
                { icon: FiTwitter, href: "#", color: "hover:text-sky-400" },
                { icon: FiInstagram, href: "#", color: "hover:text-pink-400" },
                { icon: FiLinkedin, href: "#", color: "hover:text-blue-300" },
                { icon: FiYoutube, href: "#", color: "hover:text-red-400" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-white/20 border border-white/10`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Courses", href: "/courses" },
                { name: "About Us", href: "/about" },
                { name: "Pricing", href: "/pricing" },
                { name: "Blog", href: "/blog" },
                { name: "Careers", href: "/careers" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Categories
            </h3>
            <ul className="space-y-3">
              {[
                "Web Development",
                "Data Science",
                "Mobile Development",
                "UI/UX Design",
                "Digital Marketing",
                "Business",
                "Photography",
                "Music & Arts"
              ].map((category, index) => (
                <li key={index}>
                  <Link 
                    href={`/courses?category=${category.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300 mt-1">
                  <FiMail className="text-blue-400" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href="mailto:kashikoder@gmail.com" className="text-gray-300 hover:text-white transition-colors duration-300">
                    kashikoder@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300 mt-1">
                  <FiPhone className="text-green-400" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <a href="tel:+11234567890" className="text-gray-300 hover:text-white transition-colors duration-300">
                    +91 7307******
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300 mt-1">
                  <FiMapPin className="text-purple-400" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-gray-300">
                    D, 37/49, Godowlia Rd, Harha,<br />
                     Varanasi, Uttar Pradesh 221001
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter Signup - Fixed Width */}
            <div className="mt-6 w-full">
              <h4 className="text-sm font-semibold mb-3 text-gray-300">Stay Updated</h4>
              <div className="flex flex-col space-y-3 w-full">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div> 

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EduLearn. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex space-x-6 text-sm">
            {[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
              { name: "Cookie Policy", href: "/cookies" },
            ].map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center hover:shadow-lg transition-all duration-300 group"
          >
            <FiArrowUp className="text-white group-hover:-translate-y-1 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-40 left-1/4 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-pulse" style={{animationDelay: '2s'}}></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
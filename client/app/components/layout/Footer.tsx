import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import Link from "next/link";

const FooterLogo = () => (
  <svg viewBox="0 0 120 40" className="h-10">
    <text
      x="0"
      y="28"
      fontFamily="Arial"
      fontSize="24"
      fontWeight="bold"
      fill="currentColor"
    >
      kgkraft
    </text>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-950 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
      <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>

      <div className="max-w-8xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-16 pb-16 border-b border-gray-800/80">
          {/* Logo and description */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center">
              <div className="text-white mr-2">
                <FooterLogo />
              </div>
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
              <span className="ml-2 text-sm font-medium tracking-wider text-gray-400 uppercase">
                Premium Store
              </span>
            </div>

            <p className="text-gray-400 mt-6 text-sm leading-relaxed">
              Discover high-quality, handcrafted products at kgkraft. Shop with
              confidence and enjoy premium selections tailored just for you.
            </p>

            <div className="mt-8 flex flex-col space-y-4">
              <div className="flex items-start">
                <MapPin
                  size={18}
                  className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-gray-400">
                  123 Commerce Street, Shopping District, 10001
                </p>
              </div>
              <div className="flex items-center">
                <Phone
                  size={18}
                  className="text-indigo-400 mr-3 flex-shrink-0"
                />
                <p className="text-sm text-gray-400">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center">
                <Mail
                  size={18}
                  className="text-indigo-400 mr-3 flex-shrink-0"
                />
                <p className="text-sm text-gray-400">support@kgkraft.com</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-span-1 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  title: "Shop",
                  links: [
                    "New Arrivals",
                    "Best Sellers",
                    "Featured Products",
                    "Collections",
                    "Gift Cards",
                    "Sale & Clearance",
                  ],
                },
                {
                  title: "Company",
                  links: [
                    "About Us",
                    "Our Story",
                    "Sustainability",
                    "Careers",
                    "Press & Media",
                    "Partner With Us",
                  ],
                },
                {
                  title: "Customer Service",
                  links: [
                    "Help Center",
                    "Shipping Information",
                    "Returns & Exchanges",
                    "Order Tracking",
                    "Size Guide",
                    "Contact Support",
                  ],
                },
              ].map((section, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-lg text-white mb-6 relative inline-block">
                    {section.title}
                    <span className="absolute -bottom-2 left-0 h-0.5 w-8 bg-indigo-500"></span>
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, idx) => (
                      <li key={idx}>
                        <Link
                          href="#"
                          className="text-gray-400 hover:text-white text-sm flex items-center group transition-all duration-200"
                        >
                          <span className="h-1 w-0 bg-indigo-500 rounded-full mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-200"></span>
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-semibold text-lg text-white mb-6 relative inline-block">
              Stay Updated
              <span className="absolute -bottom-2 left-0 h-0.5 w-8 bg-indigo-500"></span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Subscribe to get exclusive offers and updates on new products.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-md transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-gray-500 text-xs">
                By subscribing, you agree to our Privacy Policy.
              </p>
            </form>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-300 mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-3">
                {[
                  {
                    icon: <Facebook size={18} />,
                    name: "Facebook",
                    bg: "bg-blue-600",
                  },
                  {
                    icon: <Twitter size={18} />,
                    name: "Twitter",
                    bg: "bg-sky-500",
                  },
                  {
                    icon: <Instagram size={18} />,
                    name: "Instagram",
                    bg: "bg-pink-600",
                  },
                  {
                    icon: <Youtube size={18} />,
                    name: "YouTube",
                    bg: "bg-red-600",
                  },
                ].map((social, idx) => (
                  <Link
                    key={idx}
                    href="#"
                    aria-label={social.name}
                    className={`${social.bg} p-2.5 rounded-full text-white hover:opacity-90 hover:scale-110 transition-all duration-200`}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods and copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            {["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"].map(
              (method, idx) => (
                <div key={idx} className="text-xs text-gray-500 font-medium">
                  {method}
                </div>
              )
            )}
          </div>

          <div className="flex flex-col md:flex-row text-center md:text-left items-center space-y-2 md:space-y-0 md:space-x-8 text-sm">
            <p className="text-gray-400">
              © {currentYear} kgkraft. All rights reserved.
            </p>
            <div className="flex space-x-4 text-gray-500">
              {["Terms", "Privacy", "Cookies"].map((item, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

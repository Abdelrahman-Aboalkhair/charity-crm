"use client";

import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      {/* Header Section */}
      <motion.div className="text-center" initial="hidden" animate="visible">
        <Heart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to Our Donor Management System
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Streamline your charity&apos;s impact with our intuitive CRM. Manage
          donors, track contributions, and make a difference.
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        className="mt-8"
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;

import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout cho CANDIDATE - chỉ có Header và Footer, không có sidebar
 * CANDIDATE chỉ cần xem việc làm, apply, và quản lý hồ sơ cá nhân
 * Màu accent: Blue (#2563eb)
 */
const CandidateLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Accent Bar - Blue for Candidate */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-1 w-full"></div>
      
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CandidateLayout;


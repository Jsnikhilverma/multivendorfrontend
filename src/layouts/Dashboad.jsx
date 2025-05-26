import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import routes from "../../routes";
import DashboardNavbar from "../layout/dashboard-navbar";
import { useState } from "react";

import UserDetail from "@/pages/dashboard/users/UserDetail";
import AudiobookDetail from "@/pages/dashboard/audio/AudiobookDetail";
import VideoDetail from "@/pages/dashboard/video/VideoDetail";
import TestimonailDetail from "@/pages/dashboard/testimonials/TestimonialDetail";
import AudioPackageDetail from "@/pages/dashboard/audioPackage/AudioPackageDetail";
import ProductDetailPage from "@/pages/dashboard/product/ProductDetailPage"
import UserDetailPage from "@/pages/dashboard/users/UserDetailPage";
import CatelogDetailPage from "@/pages/dashboard/catelog/CatelogDetailPage";
import Catelogpdf from "@/pages/dashboard/catelog/Catelogpdf";

const Dashboard = () => {
  // Local state for toggling sidebar visibility on mobile
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-blue-gray-50/50">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isOpen ? "w-72" : "w-0"
        } md:w-72`}
      >
        <Sidebar routes={routes} isOpen={isOpen} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:ml-4 h-screen overflow-y-auto transition-all duration-300">
        <DashboardNavbar isOpen={isOpen} setIsOpen={setIsOpen} />
        <Routes>
          {/* Redirect /dashboard to /dashboard/home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/user-detail/:id" element={<UserDetail />} />
          <Route path="/audio-detail/:id" element={<AudiobookDetail />} />
          <Route path="/video-detail/:id" element={<VideoDetail />} />
          <Route path="/testimonials-detail/:id" element={<TestimonailDetail />} />
          <Route path="/product-package-detail/:id" element={<AudioPackageDetail />} />
          <Route path="/product-detail/:id" element={<ProductDetailPage />} />
          <Route path="/user/:id" element={<UserDetailPage />} />
          <Route path="/catelog/:id" element={<CatelogDetailPage />} />
          <Route path="/catelogpdf/:id" element={<Catelogpdf />} />
          
          


          {routes.map(({ layout, pages }) =>
            layout === "dashboard"
              ? pages.map(({ path, element, subPages }) => (
                  <>
                    <Route
                      key={path}
                      path={path.replace("/", "")}
                      element={element}
                    />
                    {/* Handle subpages routing */}
                    {subPages?.map((subPage) => (
                      <Route
                        key={subPage.path}
                        path={subPage.path}
                        element={subPage.element || <div>Not Implemented</div>}
                      />
                    ))}
                  </>
                ))
              : null
          )}
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;

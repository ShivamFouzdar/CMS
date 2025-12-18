import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Home from './pages/Home';
import AboutPage from './pages/About';
import ServicesPage from './pages/Services';
import ContactPage from './pages/Contact';
import { Reviews } from './pages/Reviews';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CaseStudies from './pages/CaseStudies';
import BPOServices from './pages/services/BPOServices';
import KPOServices from './pages/services/KPOServices';
import LegalServices from './pages/services/LegalServices';
import Recruitment from './pages/services/Recruitment';
import ITServices from './pages/services/ITServices';
import BrandPromotion from './pages/services/BrandPromotion';
import JobApplicants from './pages/admin/JobApplicants';
import AdminReviews from './pages/admin/Reviews';
import Leads from './pages/admin/ContactSubmissions';
import Settings from './pages/admin/Settings';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Layout with header and footer
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Auth layout (no header/footer)
function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">{children}</div>;
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900">
      <Router>
        <AnalyticsProvider>
          <ScrollToTop />
          <Routes>
            {/* Public routes with layout */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/case-studies" element={<CaseStudies />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/services/bpo" element={<BPOServices />} />
                    <Route path="/services/kpo" element={<KPOServices />} />
                    <Route path="/services/legal" element={<LegalServices />} />
                    <Route path="/services/recruitment" element={<Recruitment />} />
                    <Route path="/services/it" element={<ITServices />} />
                    <Route path="/services/brand-promotion" element={<BrandPromotion />} />
                  </Routes>
                </Layout>
              }
            />

            {/* Auth routes - no layout */}
            <Route path="/auth" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/auth/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/auth/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

            {/* Admin routes - protected */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/job-applicants"
              element={
                <ProtectedRoute>
                  <JobApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute>
                  <AdminReviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads"
              element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnalyticsProvider>
      </Router>
    </div>
  );
}

export default App;

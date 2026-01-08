import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { NotificationProvider } from '@/context/NotificationContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Lazy load public pages
const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/About'));
const ServicesPage = lazy(() => import('./pages/Services'));
const ContactPage = lazy(() => import('./pages/Contact'));
const TeamPage = lazy(() => import('./pages/Team'));
const Reviews = lazy(() => import('./pages/Reviews').then(module => ({ default: module.Reviews })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const BPOServices = lazy(() => import('./pages/services/BPOServices'));
const KPOServices = lazy(() => import('./pages/services/KPOServices'));
const LegalServices = lazy(() => import('./pages/services/LegalServices'));
const Recruitment = lazy(() => import('./pages/services/Recruitment'));
const ITServices = lazy(() => import('./pages/services/ITServices'));
const BrandPromotion = lazy(() => import('./pages/services/BrandPromotion'));
const CustomerSupport = lazy(() => import('./pages/services/CustomerSupport'));
const LoginPage = lazy(() => import('./pages/auth/Login'));
const RegisterPage = lazy(() => import('./pages/auth/Register'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

// Lazy load admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const JobApplicants = lazy(() => import('./pages/admin/JobApplicants'));
const AdminReviews = lazy(() => import('./pages/admin/Reviews'));
const Leads = lazy(() => import('./pages/admin/ContactSubmissions'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const AdminServices = lazy(() => import('./pages/admin/Services'));
const AdminProfile = lazy(() => import('./pages/admin/Profile'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));

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
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner size="lg" fullScreen={false} />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

// Auth layout (no header/footer)
function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <Suspense fallback={<LoadingSpinner size="lg" fullScreen />}>
        {children}
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300">
        <Router>
          <NotificationProvider>
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
                        <Route path="/team" element={<TeamPage />} />
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
                        <Route path="/services/support" element={<CustomerSupport />} />
                      </Routes>
                    </Layout>
                  }
                />

                {/* Auth routes - no layout */}
                <Route path="/auth" element={<AuthLayout><LoginPage /></AuthLayout>} />
                <Route path="/auth/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
                <Route path="/auth/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
                <Route path="/maintenance" element={<AuthLayout><Maintenance /></AuthLayout>} />

                {/* Admin routes - protected with lazy loading */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner size="lg" fullScreen />}>
                        <AdminDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner size="lg" fullScreen />}>
                        <AdminDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/job-applicants"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner size="lg" fullScreen />}>
                        <JobApplicants />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reviews"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner size="lg" fullScreen />}>
                        <AdminReviews />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/leads"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner size="lg" fullScreen />}>
                        <Leads />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner size="lg" fullScreen />}>
                        <Settings />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/services"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner size="lg" fullScreen />}>
                        <AdminServices />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/profile"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner size="lg" fullScreen />}>
                        <AdminProfile />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner size="lg" fullScreen />}>
                        <AdminUsers />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </AnalyticsProvider>
          </NotificationProvider>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;

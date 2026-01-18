import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { useEffect } from "react";

const Landing = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-page bg-white min-vh-100 overflow-hidden">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent py-4 position-absolute top-0 w-100 z-3">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <div className="flex-shrink-0">
              <img
                src="/assets/logo.png"
                alt="Logo"
                style={{ width: "40px", height: "40px" }}
              />
            </div>
            <span className="fw-bold fs-4 tracking-tight text-dark">
              Expense <span className="text-primary">Manager</span>
            </span>
          </Link>
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#landingNavbar"
            aria-controls="landingNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="landingNavbar">
            <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-3 ms-auto mt-3 mt-lg-0 align-items-center">
              <Link
                to="/login"
                className="btn btn-link text-dark text-decoration-none fw-bold small px-4 w-100 w-lg-auto"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary-gradient px-4 py-2 rounded-pill shadow-sm fw-bold border-0 w-100 w-lg-auto text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section pt-5 mt-5">
        <div className="container">
          <div className="row align-items-center min-vh-75 pt-5">
            <div className="col-lg-6 mb-5 mb-lg-0 text-center text-lg-start">
              <span className="badge bg-primary-soft text-primary px-3 py-2 rounded-pill mb-4 fw-bold animate-fade-in">
                <i className="bi bi-stars me-2"></i>
                The Smarter Way to Save
              </span>
              <h1
                className="display-3 fw-bold tracking-tight text-dark mb-4 animate-slide-up"
                style={{ lineHeight: 1.1 }}
              >
                Master Your Finances with{" "}
                <span className="text-primary-gradient">Expense Manager</span>
              </h1>
              <p className="lead text-muted mb-5 animate-slide-up-delay pe-lg-5">
                Take control of your spending, set ambitious savings goals, and
                visualize your financial future with our beautiful, easy-to-use
                platform.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start animate-slide-up-delay-2">
                <Link
                  to="/register"
                  className="btn btn-primary-gradient px-5 py-3 rounded-pill shadow-lg fw-bold border-0"
                >
                  Start Saving for Free
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline-light text-dark border-2 px-5 py-3 rounded-pill fw-bold"
                >
                  Live Demo
                </Link>
              </div>
              <div className="mt-5 d-flex align-items-center justify-content-center justify-content-lg-start gap-4 text-muted small animate-fade-in-long">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-shield-check text-success fs-5"></i>
                  Bank-level Security
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-graph-up-arrow text-primary fs-5"></i>
                  Real-time Insights
                </div>
              </div>
            </div>
            <div className="col-lg-6 position-relative animate-fade-in-right">
              <div className="hero-image-wrapper p-4">
                <div
                  className="blob-bg position-absolute top-50 start-50 translate-middle"
                  style={{
                    width: "120%",
                    height: "120%",
                    background:
                      "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
                    zIndex: -1,
                  }}
                ></div>
                <img
                  src="/assets/landing-hero.png"
                  alt="Financial Dashboard Illustration"
                  className="img-fluid rounded-4 floating-animation"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light-subtle">
        <div className="container py-5">
          <div className="text-center mb-5 pb-lg-4">
            <h2 className="fw-bold display-5 mb-3 text-dark">
              Everything you need to thrive
            </h2>
            <p
              className="text-muted mx-auto lead"
              style={{ maxWidth: "600px" }}
            >
              Powerful tools that give you a complete picture of your financial
              health, all in one place.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 rounded-4 shadow-sm p-4 text-center hover-up transition-all">
                <div
                  className="bg-primary-soft text-primary p-3 rounded-4 mx-auto mb-4"
                  style={{ width: "fit-content" }}
                >
                  <i className="bi bi-wallet2 fs-2"></i>
                </div>
                <h5 className="fw-bold mb-3">Expense Tracking</h5>
                <p className="text-muted small mb-0">
                  Log your daily spending across categories and sources. Import
                  reports seamlessly via PDF or Excel.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 rounded-4 shadow-sm p-4 text-center hover-up transition-all">
                <div
                  className="bg-success-soft text-success p-3 rounded-4 mx-auto mb-4"
                  style={{ width: "fit-content" }}
                >
                  <i className="bi bi-bullseye fs-2"></i>
                </div>
                <h5 className="fw-bold mb-3">Goal Management</h5>
                <p className="text-muted small mb-0">
                  Set savings targets for vacations, homes, or emergencies.
                  Track your progress with beautiful visualizations.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 rounded-4 shadow-sm p-4 text-center hover-up transition-all">
                <div
                  className="bg-warning-soft text-warning p-3 rounded-4 mx-auto mb-4"
                  style={{ width: "fit-content" }}
                >
                  <i className="bi bi-pie-chart fs-2"></i>
                </div>
                <h5 className="fw-bold mb-3">Smart Budgets</h5>
                <p className="text-muted small mb-0">
                  Stay within your limits. Set monthly or weekly budgets and get
                  notified before you overspend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="stats-section py-5 bg-dark">
        <div className="container py-4 text-center">
          <div className="row align-items-center">
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <div className="text-white h2 fw-bold mb-1">10k+</div>
              <div className="text-muted small">Active Users</div>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <div className="text-white h2 fw-bold mb-1">₹50Cr+</div>
              <div className="text-muted small">Expenses Tracked</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-white h2 fw-bold mb-1">99.9%</div>
              <div className="text-muted small">Data Security</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-white h2 fw-bold mb-1">4.9/5</div>
              <div className="text-muted small">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer py-5 border-top border-light">
        <div className="container text-center">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
            <div className="flex-shrink-0">
              <img
                src="/assets/logo.png"
                alt="Logo"
                style={{ width: "32px", height: "32px" }}
              />
            </div>
            <span className="fw-bold text-dark">Expense Manager</span>
          </div>
          <p className="text-muted small mb-4">
            &copy; 2026 Expense Manager. Built for the future of finance.
          </p>
          <div className="d-flex justify-content-center gap-4 text-muted small fw-medium">
            <Link
              to="/"
              className="text-decoration-none text-muted hover-primary"
            >
              Privacy
            </Link>
            <Link
              to="/"
              className="text-decoration-none text-muted hover-primary"
            >
              Terms
            </Link>
            <Link
              to="/"
              className="text-decoration-none text-muted hover-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>

      <style>{`
        .bg-primary-soft { background-color: rgba(99, 102, 241, 0.1); }
        .bg-success-soft { background-color: rgba(34, 197, 94, 0.1); }
        .bg-warning-soft { background-color: rgba(245, 158, 11, 0.1); }
        
        .hero-section { background: radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0) 40%); }
        
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up-delay {
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
        }
        .animate-slide-up-delay-2 {
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1s ease-out 0.4s forwards;
        }
        .animate-fade-in-long {
          opacity: 0;
          animation: fadeIn 1.5s ease-out 0.6s forwards;
        }
        .animate-fade-in-right {
          opacity: 0;
          animation: fadeInRight 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .hover-up:hover { transform: translateY(-10px); }
        .transition-all { transition: all 0.3s ease-in-out; }
        .min-vh-75 { min-height: 75vh; }
        .extra-small { font-size: 0.75rem; }
        .tracking-tight { letter-spacing: -0.025em; }
        .hover-primary:hover { color: var(--primary-color) !important; }
      `}</style>
    </div>
  );
};

export default Landing;

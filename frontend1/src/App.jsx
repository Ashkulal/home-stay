import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import FloatingContact from "./components/FloatingContact";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Peaks = lazy(() => import("./pages/Peaks"));
const Activities = lazy(() => import("./pages/Activities"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-forest-950">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/peaks" element={<Peaks />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={
                    <div className="min-h-[60vh] flex items-center justify-center px-4">
                      <div className="text-center">
                        <h1 className="text-8xl font-bold text-gold-500 mb-4">404</h1>
                        <p className="text-xl text-gray-400 mb-6">Page not found</p>
                        <a href="/" className="bg-gold-500 text-forest-900 px-6 py-3 rounded-full font-bold hover:bg-gold-400 transition-colors">
                          Go Home
                        </a>
                      </div>
                    </div>
                  } />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <FloatingContact />
            <Chatbot />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

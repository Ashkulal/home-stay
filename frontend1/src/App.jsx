import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import FloatingContact from "./components/FloatingContact";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Peaks from "./pages/Peaks";
import Activities from "./pages/Activities";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-forest-950">
            <Navbar />
            <main className="flex-grow">
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

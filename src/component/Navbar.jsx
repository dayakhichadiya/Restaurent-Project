
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logo.jpg'; 

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-black/60 backdrop-blur-md fixed top-0 left-0 w-full z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <img 
                        src={logo} 
                        alt="logo" 
                        className="w-12 h-12 object-contain rounded-full border-2 border-yellow-400 transition-transform duration-300 hover:scale-110" 
                    />
                    <span className="text-2xl font-extrabold text-yellow-400 tracking-wide hover:text-white transition duration-300">
                        🍴 Lithos Bar and Grill
                    </span>
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex gap-10 text-white font-medium text-lg">
                    <Link to="/" className="hover:text-yellow-300 transition duration-200">Home</Link>
                    <Link to="/menu" className="hover:text-yellow-300 transition duration-200">Menu</Link>
                    <Link to="/dashboard" className="hover:text-yellow-300 transition duration-200">Dashboard</Link>
                </nav>

                {/* Mobile Button */}
                <div className="md:hidden">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        className="text-yellow-400 hover:text-white transition"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            className="w-7 h-7"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M4 6h16M4 12h16M4 18h16" 
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-black/90 backdrop-blur-md absolute top-full left-0 w-full flex flex-col items-center gap-4 py-4 text-white text-lg z-40 shadow-md">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-300">Home</Link>
                    <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-300">Menu</Link>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-300">Dashboard</Link>
                </nav>
            )}
        </header>
    );
}

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import "./home.css"
import heroImage from "@/uploads/builder.png";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function HomePage() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-slate-50 ">
      {/* Header/Navigation */}
      <header className=" border-b border-slate-100 py-4 absolute w-full rounded-[27px] backdrop-blur-[22px] bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center ">
          <div className="flex items-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">Portfolio</span>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 text-slate-300 hover:text-primary transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <a href="#features" className="text-white hover:text-indigo-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#themes" className="text-white hover:text-indigo-400 transition-colors">
                  Themes
                </a>
              </li>
              {user ? (
                <li>
                  <Link href="/dashboard">
                    <span className="text-white font-medium hover:text-indigo-400 transition-colors cursor-pointer">
                      Dashboard
                    </span>
                  </Link>
                </li>
              ) : (
                <li>
                  <Link href="/auth">
                    <span className="text-white font-medium transition-colors cursor-pointer hover:text-indigo-400">
                      Login / Register
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-100 shadow-lg z-50">
            <nav className="p-4">
              <ul className="flex flex-col space-y-3">
                <li>
                  <a 
                    href="#features" 
                    className="text-white hover:text-primary transition-colors block py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a 
                    href="#themes" 
                    className="text-white hover:text-primary transition-colors block py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Themes
                  </a>
                </li>
                {user ? (
                  <li className="py-2">
                    <Link href="/dashboard">
                      <span 
                        className="text-white font-medium hover:text-primary/80 transition-colors cursor-pointer block"
                        onClick={() => setMenuOpen(false)}
                      >
                        Dashboard
                      </span>
                    </Link>
                  </li>
                ) : (
                  <li className="py-2">
                    <Link href="/auth">
                      <span 
                        className="text-blue-500 font-medium hover:text-primary/80 transition-colors cursor-pointer block"
                        onClick={() => setMenuOpen(false)}
                      >
                        Login / Register
                      </span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="h-screen mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-[url('./uploads/backwave.jpg')] bg-cover bg-center">
        <div className="flex flex-wrap items-center justify-center flex-row 
                        p-10 md:p-20 sm:p-8 xs:p-4
                        h-[80vh] md:h-auto sm:h-auto">
        {/* <div className="flex flex-col md:flex-row items-center justify-between   h-screen translate-x-1/2 translate-y-1/2"></div> */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl text-white font-bold mb-6 leading-tight">
              Create Your Professional Portfolio <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">in Minutes</span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-lg">
              Showcase your work, experience, and skills with a beautiful portfolio website that stands out from the crowd.
            </p>
            <div className="flex space-x-4">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 cursor-pointer">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button size="lg" className="bg-slate-200 relative h-12 w-40 overflow-hidden border border-indigo-600 text-indigo-600 shadow-2xl transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm before:bg-indigo-600 before:duration-300 before:ease-out hover:text-white hover:shadow-indigo-600 hover:before:h-40 hover:before:w-40 hover:before:opacity-80 hover:bg-primary/90 cursor-pointer">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="md:w-1/2 relative">
            {/* <img src={heroImage} alt="Hero" className="w-full" /> */}
            <DotLottieReact
      src="https://lottie.host/6334ce49-1827-4e32-91b4-fb26f0733f77/ep0KD8KdiQ.lottie"
      loop
      autoplay
    />
            {/* <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="aspect-video bg-slate-100 rounded-md mb-4"></div>
              <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-3"></div>
              <div className="h-4 bg-slate-100 rounded-full w-full mb-2"></div>
              <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/5 rounded-full"></div> */}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">Key Features</h2>
            <p className="mt-4 text-lg text-white max-w-2xl mx-auto">
              Everything you need to create a stunning portfolio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-slate-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional Themes</h3>
              <p className="text-white">
                Choose from a variety of beautiful, professionally designed themes for your portfolio.
              </p>
            </div>
            
            <div className="p-6 border border-slate-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Customizable Sections</h3>
              <p className="text-white">
                Add your personal details, experience, projects, and skills with our easy-to-use builder.
              </p>
            </div>
            
            <div className="p-6 border border-slate-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Export to PDF</h3>
              <p className="text-white">
                Download your portfolio as a PDF to share with potential employers or clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Themes Preview Section */}
      <div id="themes" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">Beautiful Themes</h2>
            <p className="mt-4 text-lg text-white max-w-2xl mx-auto">
              Choose from a variety of professionally designed themes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 'elegant',
                name: 'Elegant',
                description: 'Sophisticated design with a premium feel',
                image: 'https://images.unsplash.com/photo-1571624436279-b272aff752b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80'
              },
              {
                id: 'modern',
                name: 'Modern',
                description: 'Contemporary design with bold colors and clean layout',
                image: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80'
              },
              {
                id: 'nature',
                name: 'Nature',
                description: 'Organic, earthy design for environment-focused professionals',
                image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80'
              }
            ].map((theme) => (
              <div key={theme.id} className="bg-black border border-slate-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={theme.image} 
                    alt={`${theme.name} theme preview`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{theme.name}</h3>
                  <p className="text-slate-600 mb-4">
                    {theme.description}
                  </p>
                  {user ? (
                    <a href={`/api/try-theme/${theme.id}`}>
                      <Button variant="default" className="w-full cursor-pointer bg-primary hover:bg-primary/90">
                        Try This Theme
                      </Button>
                    </a>
                  ) : (
                    <Link href="/auth">
                      <Button variant="default" className="w-full cursor-pointer bg-primary hover:bg-primary/90">
                        Sign In to Try
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-primary/5 bg-[url('./uploads/boxwave.png')] bg-cover bg-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Create Your Professional Portfolio?
          </h2>
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have created stunning portfolios with Folio.
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-primary hover:bg-primary/90 cursor-pointer">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-2xl font-bold text-white">Portfolio</span>
              <p className="text-slate-400 mt-2">Build your professional portfolio in minutes.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved. By Bhupinder Singh</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

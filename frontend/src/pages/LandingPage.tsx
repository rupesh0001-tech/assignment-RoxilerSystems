import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);

  // Navbar scroll effect matching script.js
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Horizontal scroll for gallery section matching script.js
  useEffect(() => {
    const handleGalleryScroll = () => {
      if (!galleryContainerRef.current || !galleryTrackRef.current) return;
      const rect = galleryContainerRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const totalHeight = rect.height;
      const scrolled = -rect.top;
      const maxScroll = totalHeight - viewHeight;

      if (maxScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
      const limit = Math.max(
        0,
        galleryTrackRef.current.scrollWidth - window.innerWidth
      );
      galleryTrackRef.current.style.transform = `translateX(-${
        progress * limit
      }px)`;
    };

    window.addEventListener('scroll', handleGalleryScroll, { passive: true });
    window.addEventListener('resize', handleGalleryScroll);
    setTimeout(handleGalleryScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleGalleryScroll);
      window.removeEventListener('resize', handleGalleryScroll);
    };
  }, []);

  const whyChooseUsData = [
    {
      title: 'Verified Store Reviews & Ratings',
      description:
        'Access a curated directory of verified local stores, ensuring unbiased 1-to-5 star ratings and total transparency.',
      image: '/assets/house.png',
    },
    {
      title: 'Expert Store Insights & Discovery',
      description:
        'Make informed shopping decisions with detailed store performance ratings, reviewer history, and neighborhood trends.',
      image: '/assets/galleryImage1.png',
    },
    {
      title: 'Seamless Rating & Feedback System',
      description:
        'Easily rate stores from 1 to 5 stars, modify previous scores, and share genuine reviews anytime through an intuitive portal.',
      image: '/assets/galleryImage2.png',
    },
    {
      title: 'Store Owner Analytics & Reports',
      description:
        'Store owners access dedicated real-time hubs displaying average store ratings, customer feedback breakdown, and reviewer data.',
      image: '/assets/galleryImage3.png',
    },
    {
      title: 'Dedicated Platform Administration',
      description:
        'System administrators maintain platform integrity with complete oversight, store listings management, and sorting controls.',
      image: '/assets/galleryImage4.png',
    },
  ];

  const testimonialsCol1 = [
    {
      name: 'Michael Anderson',
      location: 'Downtown Arts District',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=120&h=120&q=80',
      text: 'The rating process was completely seamless. Found the highest rated specialty cafe in town through RateHub.',
    },
    {
      name: 'Sarah Thompson',
      location: 'Central Avenue',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=120&h=120&q=80',
      text: 'Transparent, reliable, and verified. RateHub helped us discover top artisan boutiques in our neighborhood.',
    },
    {
      name: 'Emma Rodriguez',
      location: 'Westside Market',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=120&h=120&q=80',
      text: 'From searching stores to submitting my 5-star rating, everything was handled smoothly. Great platform!',
    },
  ];

  const testimonialsCol2 = [
    {
      name: 'David Wilson',
      location: 'Verified Store Owner',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=120&h=120&q=80',
      text: 'As a store owner, seeing our average rating and reviewer breakdown in real-time has elevated our service.',
    },
    {
      name: 'Daniel Kim',
      location: 'Uptown Plaza',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?fit=crop&w=120&h=120&q=80',
      text: 'Honest reviews and authentic customer scores. Searching by store address and name is remarkably fast.',
    },
    {
      name: 'James Parker',
      location: 'Metro District',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=120&h=120&q=80',
      text: 'RateHub makes rating stores straightforward. The registration and authentication are fast and secure.',
    },
  ];

  return (
    <div className="font-sans antialiased text-zinc-900 bg-white">
      {/* Navbar matching html */}
      <nav
        id="navbar"
        className={`fixed z-50 flex items-center justify-between left-1/2 -translate-x-1/2 transition-all duration-500 p-4 ${
          isScrolled
            ? 'md:w-5xl w-[calc(100vw-14px)] bg-white/60 backdrop-blur-2xl rounded-full mt-4 pl-6 shadow'
            : 'md:px-16 lg:px-24 xl:px-32 w-full'
        }`}
      >
        <Link to="/">
          <img
            id="navbar-logo"
            src="/assets/logo.svg"
            alt="Logo"
            className={`transition-all duration-500 ${
              isScrolled ? 'invert opacity-80' : ''
            }`}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 md:gap-10 text-sm">
          <a
            href="#"
            className={`nav-link transition-colors duration-500 ${
              isScrolled
                ? 'text-zinc-800 hover:text-zinc-600'
                : 'text-white hover:text-white/90'
            }`}
          >
            Home
          </a>
          <a
            href="#stores"
            className={`nav-link transition-colors duration-500 ${
              isScrolled
                ? 'text-zinc-800 hover:text-zinc-600'
                : 'text-white hover:text-white/90'
            }`}
          >
            Stores
          </a>
          <a
            href="#features"
            className={`nav-link transition-colors duration-500 ${
              isScrolled
                ? 'text-zinc-800 hover:text-zinc-600'
                : 'text-white hover:text-white/90'
            }`}
          >
            Features
          </a>
          <a
            href="#reviews"
            className={`nav-link transition-colors duration-500 ${
              isScrolled
                ? 'text-zinc-800 hover:text-zinc-600'
                : 'text-white hover:text-white/90'
            }`}
          >
            Reviews
          </a>
          <a
            href="#contact"
            className={`nav-link transition-colors duration-500 ${
              isScrolled
                ? 'text-zinc-800 hover:text-zinc-600'
                : 'text-white hover:text-white/90'
            }`}
          >
            Contact
          </a>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className={`px-5 py-2.5 text-sm font-medium transition-all duration-500 cursor-pointer ${
              isScrolled
                ? 'text-zinc-800 hover:text-zinc-600'
                : 'text-white hover:text-white/90'
            }`}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            id="get-started-btn"
            className={`px-6 py-2.5 text-sm font-medium cursor-pointer transition-all duration-500 ${
              isScrolled
                ? 'bg-zinc-900 text-white hover:bg-zinc-800 rounded-full'
                : 'bg-zinc-50 text-zinc-800 hover:bg-zinc-200 rounded-md'
            }`}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          id="mobile-menu-toggle"
          className={`md:hidden p-2 rounded-md aspect-square font-medium transition cursor-pointer ${
            isScrolled ? 'text-zinc-800' : 'text-white'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12h16" />
            <path d="M4 18h16" />
            <path d="M4 6h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu-overlay"
        className={`md:hidden fixed top-0 z-50 left-0 transition-all duration-300 overflow-hidden h-full bg-black/90 backdrop-blur flex-col justify-center flex items-center gap-6 text-sm ${
          mobileMenuOpen ? 'w-full' : 'w-0'
        }`}
      >
        <a
          href="#"
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-nav-link text-white hover:text-white/90 text-base"
        >
          Home
        </a>
        <a
          href="#stores"
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-nav-link text-white hover:text-white/90 text-base"
        >
          Stores
        </a>
        <a
          href="#features"
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-nav-link text-white hover:text-white/90 text-base"
        >
          Features
        </a>
        <a
          href="#reviews"
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-nav-link text-white hover:text-white/90 text-base"
        >
          Reviews
        </a>
        <Link
          to="/login"
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-nav-link text-white hover:text-white/90 text-base"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          onClick={() => setMobileMenuOpen(false)}
          className="px-6 py-2.5 rounded-md bg-white text-zinc-900 font-medium mt-2"
        >
          Create Account
        </Link>
        <button
          onClick={() => setMobileMenuOpen(false)}
          id="mobile-menu-close"
          className="bg-white text-zinc-800 p-2 rounded-md aspect-square font-medium transition cursor-pointer mt-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section
          className="relative flex flex-col items-center min-h-screen justify-center bg-black bg-cover bg-center bg-no-repeat px-4 w-full"
          style={{ backgroundImage: "url('/assets/hero-image.png')" }}
        >
          {/* Badge / Info Label */}
          <div className="bg-white/20 backdrop-blur text-sm text-white pl-2 pr-4 py-1 rounded-full flex items-center gap-2 border border-white/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-home"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <p>Verified Store Ratings & Review Platform</p>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-[64px] text-zinc-50 font-medium max-w-3xl text-center mt-5 leading-tight">
            Find and Rate the Best Local Stores in Town
          </h1>

          {/* Subtitle */}
          <p className="text-white max-w-120 text-center mt-3 text-sm md:text-base">
            Discover exceptional businesses, verified 1-to-5 star ratings, and transparent feedback tailored to your community.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <Link
              to="/register"
              className="bg-zinc-50 hover:bg-zinc-200 px-6 py-2.5 rounded-md text-zinc-800 text-sm font-medium cursor-pointer transition"
            >
              Explore Stores
            </Link>

            {/* Animated Button */}
            <Link
              to="/login"
              className="border border-slate-200 text-zinc-50 px-5 py-2.5 rounded-md text-sm font-medium cursor-pointer transition group"
            >
              <div className="relative overflow-hidden">
                <span className="block transition-transform duration-200 group-hover:-translate-y-full">
                  Sign In
                </span>
                <span className="absolute top-0 left-0 block transition-transform duration-200 group-hover:translate-y-0 translate-y-full">
                  Sign In
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-25 px-4 md:px-16 lg:px-24 xl:px-32 w-full">
          <div className="flex flex-col items-start max-w-3xl">
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 bg-zinc-900"></span>
              <span className="text-sm text-zinc-900">PREMIUM STORE RATINGS</span>
            </div>
            <h2 className="text-5xl md:text-6xl text-zinc-900 mt-8 leading-tight max-w-152.5">
              Rate Top Stores With Confidence
            </h2>

            <p className="text-zinc-500 text-sm md:text-base mt-3 max-w-130">
              Discover exceptional local businesses, genuine customer reviews, and a seamless rating experience tailored to your standards.
            </p>

            <Link
              to="/register"
              className="mt-7 bg-zinc-950 hover:bg-zinc-900 text-white px-7 py-3 rounded-full text-sm transition cursor-pointer inline-block"
            >
              Get Started
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-30 mt-16 md:mt-20">
            <div className="flex flex-col justify-center">
              <span className="text-4xl md:text-5xl text-zinc-900">1,200+</span>
              <span className="text-sm text-zinc-600 mt-4">STORES REGISTERED</span>
            </div>

            <div className="flex flex-col justify-center md:border-l md:border-zinc-200 md:pl-25">
              <span className="text-4xl md:text-5xl text-zinc-900">45,000+</span>
              <span className="text-sm text-zinc-600 mt-4">RATINGS SUBMITTED</span>
            </div>

            <div className="flex flex-col justify-center md:border-l md:border-zinc-200 md:pl-25">
              <span className="text-4xl md:text-5xl text-zinc-900">99.4%</span>
              <span className="text-sm text-zinc-600 mt-4">VERIFIED CUSTOMER REVIEWS</span>
            </div>
          </div>
        </section>

        {/* Gallery Section with Horizontal Scroll */}
        <section
          id="gallery-container"
          ref={galleryContainerRef}
          className="relative h-[180vh] w-full"
        >
          <div className="sticky top-0 h-screen overflow-hidden flex items-center">
            <div
              id="gallery-track"
              ref={galleryTrackRef}
              className="flex gap-5 px-4 md:px-16 lg:px-24 xl:px-32 py-16 md:py-20 will-change-transform transition-transform duration-300 ease-out"
            >
              <img
                src="/assets/galleryImage1.png"
                alt="Store 1"
                className="w-91 h-114.25 object-cover shrink-0 pointer-events-none rounded-lg"
              />
              <img
                src="/assets/galleryImage2.png"
                alt="Store 2"
                className="w-91 h-114.25 object-cover shrink-0 pointer-events-none rounded-lg"
              />
              <img
                src="/assets/galleryImage3.png"
                alt="Store 3"
                className="w-91 h-114.25 object-cover shrink-0 pointer-events-none rounded-lg"
              />
              <img
                src="/assets/galleryImage4.png"
                alt="Store 4"
                className="w-91 h-114.25 object-cover shrink-0 pointer-events-none rounded-lg"
              />
              <img
                src="/assets/galleryImage1.png"
                alt="Store 5"
                className="w-91 h-114.25 object-cover shrink-0 pointer-events-none rounded-lg"
              />
              <img
                src="/assets/galleryImage2.png"
                alt="Store 6"
                className="w-91 h-114.25 object-cover shrink-0 pointer-events-none rounded-lg"
              />
              <img
                src="/assets/galleryImage3.png"
                alt="Store 7"
                className="w-91 h-114.25 object-cover shrink-0 pointer-events-none rounded-lg"
              />
              <img
                src="/assets/galleryImage4.png"
                alt="Store 8"
                className="w-91 h-114.25 object-cover shrink-0 pointer-events-none rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us Section with Interactive Accordion */}
        <section
          id="features"
          className="py-16 mt-28 px-4 md:px-16 lg:px-24 xl:px-32 w-full bg-gray-50"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
            {/* Left Column */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 bg-zinc-900"></span>
                <span className="text-sm text-zinc-900">WHY CHOOSE US</span>
              </div>
              <h2 className="text-3xl md:text-[40px] text-zinc-900 mt-4 leading-tight font-medium max-w-100">
                Rate and Manage Stores With Complete Confidence
              </h2>

              {/* Accordion Container */}
              <div
                id="accordion-container"
                className="flex flex-col gap-4 mt-12 md:mt-16 w-full"
              >
                {whyChooseUsData.map((item, index) => {
                  const isOpen = activeAccordion === index;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-sm border border-zinc-100/50 overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setActiveAccordion(isOpen ? null : index)
                        }
                        className="w-full flex items-center justify-between p-4 md:py-4 md:px-6 text-left hover:bg-zinc-50/30 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm md:text-base text-zinc-800 font-medium">
                            {item.title}
                          </span>
                        </div>
                        <div className="toggle-icons">
                          {isOpen ? (
                            <svg
                              className="size-4 text-zinc-700"
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14" />
                            </svg>
                          ) : (
                            <svg
                              className="size-4 text-zinc-700"
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14" />
                              <path d="M12 5v14" />
                            </svg>
                          )}
                        </div>
                      </button>
                      <div
                        className={`accordion-content ${
                          isOpen ? 'is-open' : ''
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="p-4 md:px-10 pt-0 text-xs md:text-sm text-zinc-500 leading-relaxed bg-zinc-50/10">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column Dynamic Image Frame */}
            <div className="flex flex-col justify-between">
              <p className="text-zinc-500 text-sm md:text-base max-w-115 md:mt-20 mb-8">
                Our verified store directory and rating tools empower consumers and business owners with reliable, high-integrity metrics.
              </p>

              <div
                id="image-frame"
                className="relative w-121.5 h-102.75 rounded-xl overflow-hidden shadow-sm bg-zinc-100 max-w-full"
              >
                <img
                  src={
                    activeAccordion !== null
                      ? whyChooseUsData[activeAccordion].image
                      : '/assets/house.png'
                  }
                  alt="Store Highlight"
                  className="accordion-img visible-img"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section matching html marquee structure */}
        <section
          id="reviews"
          className="py-20 md:py-40 px-4 md:px-16 lg:px-24 xl:px-32 w-full bg-gray-50 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-2 justify-start items-start">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col items-start mt-20">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 bg-zinc-900"></span>
                <span className="text-sm text-zinc-900">REVIEWS</span>
              </div>
              <div className="w-37 h-[1.5px] bg-gradient-to-r from-[#030303] to-transparent mt-3.5"></div>
              <h2 className="text-3xl md:text-[34px]/12 text-zinc-900 mt-5 leading-tight font-medium max-w-100">
                Trusted by Shoppers. Proven by Ratings.
              </h2>
              <p className="text-zinc-500 text-sm md:text-base mt-2.5 max-w-85">
                Honest words from verified customers and registered store owners.
              </p>
            </div>

            {/* Right Column - Marquee Scroll Area */}
            <div className="lg:col-span-7 relative h-130 md:h-145 overflow-hidden flex justify-center md:justify-start gap-5 mt-10 lg:mt-0">
              {/* Overlay shadow & fade masks */}
              <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.05)]"></div>
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-10"></div>

              {/* Column 1 (Scrolls Upwards) */}
              <div className="overflow-hidden h-full flex flex-col">
                <div
                  id="marquee-col-1"
                  className="flex flex-col gap-5 animate-marquee-up py-2"
                >
                  {[...testimonialsCol1, ...testimonialsCol1].map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-6 rounded-xl flex flex-col gap-4 w-70 sm:w-[320px] select-none shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="size-11 rounded-full object-cover shrink-0"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-800">
                              {item.name}
                            </span>
                            <span className="text-xs text-zinc-600 mt-0.5">
                              {item.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array(5)
                            .fill(0)
                            .map((_, sIdx) => (
                              <svg
                                key={sIdx}
                                width="11"
                                height="10"
                                viewBox="0 0 11 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.746.346a.5.5 0 0 1 .95 0l.89 2.739a.5.5 0 0 0 .476.345h2.88a.5.5 0 0 1 .293.905L7.906 6.028a.5.5 0 0 0-.182.559l.89 2.738a.5.5 0 0 1-.77.56L5.516 8.191a.5.5 0 0 0-.588 0l-2.33 1.693a.5.5 0 0 1-.77-.559l.89-2.738a.5.5 0 0 0-.181-.56L.207 4.336a.5.5 0 0 1 .294-.905h2.88a.5.5 0 0 0 .475-.345z"
                                  fill="#ff8904"
                                />
                              </svg>
                            ))}
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-500">
                          {item.text}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Column 2 (Scrolls Downwards) */}
              <div className="overflow-hidden h-full hidden sm:flex flex-col">
                <div
                  id="marquee-col-2"
                  className="flex flex-col gap-5 animate-marquee-down py-2"
                >
                  {[...testimonialsCol2, ...testimonialsCol2].map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-6 rounded-xl flex flex-col gap-4 w-70 sm:w-[320px] select-none shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="size-11 rounded-full object-cover shrink-0"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-800">
                              {item.name}
                            </span>
                            <span className="text-xs text-zinc-600 mt-0.5">
                              {item.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array(5)
                            .fill(0)
                            .map((_, sIdx) => (
                              <svg
                                key={sIdx}
                                width="11"
                                height="10"
                                viewBox="0 0 11 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.746.346a.5.5 0 0 1 .95 0l.89 2.739a.5.5 0 0 0 .476.345h2.88a.5.5 0 0 1 .293.905L7.906 6.028a.5.5 0 0 0-.182.559l.89 2.738a.5.5 0 0 1-.77.56L5.516 8.191a.5.5 0 0 0-.588 0l-2.33 1.693a.5.5 0 0 1-.77-.559l.89-2.738a.5.5 0 0 0-.181-.56L.207 4.336a.5.5 0 0 1 .294-.905h2.88a.5.5 0 0 0 .475-.345z"
                                  fill="#ff8904"
                                />
                              </svg>
                            ))}
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-500">
                          {item.text}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section with layered rotated images matching html */}
        <section className="py-36 px-4 md:px-16 lg:px-24 xl:px-32 w-full flex flex-col items-center justify-center text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="relative w-full max-w-150 h-50 md:h-55 mb-12 flex justify-center items-center overflow-hidden md:overflow-visible group/cta-images select-none">
              <img
                src="/assets/galleryImage1.png"
                alt="Store 1"
                className="absolute w-62.75 h-34.75 object-cover rounded-[10px] transition-all duration-500 ease-out z-0 origin-bottom-right -rotate-12 -translate-x-28.75 translate-y-4 group-hover/cta-images:-translate-x-38.75 group-hover/cta-images:rotate-[-16deg] group-hover/cta-images:translate-y-2"
              />
              <img
                src="/assets/galleryImage3.png"
                alt="Store 3"
                className="absolute w-62 h-34 object-cover rounded-[10px] transition-all duration-500 ease-out z-0 origin-bottom-left rotate-12 translate-x-28.75 translate-y-4 group-hover/cta-images:translate-x-38.75 group-hover/cta-images:rotate-16 group-hover/cta-images:translate-y-2"
              />
              <img
                src="/assets/galleryImage2.png"
                alt="Store 2"
                className="absolute w-62 h-34 object-cover rounded-[10px] transition-all duration-500 ease-out z-10 -translate-y-2.5 group-hover/cta-images:-translate-y-5.5 group-hover/cta-images:scale-105"
              />
            </div>

            <h2 className="text-3xl md:text-[40px] text-zinc-800 tracking-tight max-w-130 mb-3 font-medium">
              Find the Perfect Store for Your Needs
            </h2>

            <p className="text-zinc-500 text-sm max-w-100 mb-7">
              Explore rated cafes, artisan fashion boutiques, and specialty shops in the most vibrant neighborhoods.
            </p>

            <Link
              to="/register"
              className="bg-black hover:bg-zinc-900 text-white text-sm px-5 py-3.5 rounded-lg transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <span>Browse Stores</span>
              <svg
                className="transition-transform duration-200 group-hover:translate-x-1"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m12 5.336 2.667 2.667L12 10.669M1.334 8h13.333"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </section>

        {/* Contact Section matching html */}
        <section
          id="contact"
          className="py-20 w-full flex items-center justify-center"
        >
          <div className="max-w-5xl w-full mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Form */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 bg-zinc-900"></span>
                <span className="text-sm text-zinc-900">CONTACT</span>
              </div>

              <h2 className="text-3xl md:text-[40px]/11 text-zinc-900 mt-5 leading-tight font-medium max-w-100">
                Connect with us <br />to learn more
              </h2>

              <form
                className="mt-15 flex flex-col gap-6"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm text-zinc-600 mb-2">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      placeholder="Michael Anderson"
                      className="w-full border border-zinc-200 rounded-sm px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-300 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm text-zinc-600 mb-2">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      placeholder="michael@example.com"
                      className="w-full border border-zinc-200 rounded-sm px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-300 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-zinc-600 mb-2">
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    placeholder="E.g. Inquiries regarding store registration or rating moderation"
                    className="w-full border border-zinc-200 rounded-sm px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-300 transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="mt-2">
                  <button
                    type="submit"
                    className="bg-black hover:bg-zinc-900 text-white text-xs px-6 py-3.5 rounded-full transition-colors duration-200 cursor-pointer"
                  >
                    GET STARTED
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Key Details Image Card */}
            <div className="relative overflow-hidden group flex justify-center">
              <div className="relative w-95.5 h-113.75 overflow-hidden rounded-xl">
                <img
                  src="/assets/house.png"
                  alt="Contact Store Hub"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none brightness-80"
                />

                <div className="absolute bottom-10 left-10 flex flex-col gap-2.5 z-10">
                  <span className="text-base text-white font-semibold">
                    KEY DETAILS
                  </span>
                  <div className="flex flex-col gap-1 text-sm text-white">
                    <p>Monday-Friday: 10 AM - 6 PM</p>
                    <p>Saturday: 10 AM - 4 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section matching html */}
        <footer className="bg-black text-white pt-12 md:pt-16 pb-8 mt-32 px-4 md:px-16 lg:px-24 xl:px-32 w-full overflow-hidden relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
              {/* Left Brand Details */}
              <div className="lg:col-span-7 flex flex-col items-start gap-6">
                <Link to="/" className="select-none">
                  <img src="/assets/logo.svg" alt="RateHub" />
                </Link>
                <p className="text-zinc-300 text-sm/5.5 max-w-md">
                  Helping customers, store owners, and administrators discover and share verified ratings with confidence.
                </p>
              </div>

              {/* Right Link Columns */}
              <div className="lg:col-span-5 flex justify-between gap-8 flex-wrap">
                <div className="flex flex-col gap-5">
                  <span className="text-white text-sm font-semibold">Explore</span>
                  <div className="flex flex-col gap-3 text-xs text-zinc-300">
                    <Link to="/" className="hover:text-white transition">
                      Home
                    </Link>
                    <Link to="/login" className="hover:text-white transition">
                      Store Sign In
                    </Link>
                    <Link to="/register" className="hover:text-white transition">
                      User Registration
                    </Link>
                    <a href="#reviews" className="hover:text-white transition">
                      Reviews
                    </a>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <span className="text-white text-sm font-semibold">Company</span>
                  <div className="flex flex-col gap-3 text-xs text-zinc-300">
                    <a href="#" className="hover:text-white transition">
                      About Us
                    </a>
                    <a href="#" className="hover:text-white transition">
                      FAQ
                    </a>
                    <a href="#" className="hover:text-white transition">
                      Support
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-zinc-800"></div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 text-xs text-zinc-300">
              <p>Copyright 2026 © RateHub All Rights Reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Home Page with Interactive Hero Slideshow and Featured Catalog
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideTimerRef = useRef(null);

  const [allProducts, setAllProducts] = useState([]);

  // Curated hero slideshow showcasing trending products and special offers
  const rawSlides = [
    {
      keyword: 'Sony WH-1000XM5',
      fallbackId: '6ae20f37085517ebbc2dcefa',
      badge: '🔥 SPECIAL OFFER • 33% OFF',
      title: 'Sony WH-1000XM5 Wireless Headphones',
      description: 'Industry-leading noise cancellation with two processors and 8 microphones. Experience unmatched audio clarity at an exclusive reduced price.',
      price: '₹19,990',
      originalPrice: '₹29,990',
      discount: '33% OFF',
      tag: 'Special Offer',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      ctaText: 'Claim Discount',
    },
    {
      keyword: 'AeroPress Original',
      fallbackId: '6ae20f37085517ebbc2dcf01',
      badge: '⚡ SPECIAL OFFER • 38% OFF',
      title: 'AeroPress Coffee Maker & Chamber',
      description: 'Patented 3-in-1 brew technology for exceptionally smooth, rich, grit-free coffee in 1 minute. Price reduced for coffee lovers.',
      price: '₹2,499',
      originalPrice: '₹3,999',
      discount: '38% OFF',
      tag: 'Special Offer',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      ctaText: 'Claim Discount',
    },
    {
      keyword: 'Nike Air Max 270',
      fallbackId: '6ae20f37085517ebbc2dceff',
      badge: '✨ SPECIAL OFFER • 25% OFF',
      title: 'Nike Air Max 270 React Running Shoes',
      description: 'Lightweight multi-layered breathable mesh upper with vibrant aesthetics and plush bounce-back stride. Now at a discounted price.',
      price: '₹8,995',
      originalPrice: '₹11,995',
      discount: '25% OFF',
      tag: 'Special Offer',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      ctaText: 'Claim Discount',
    },
    {
      keyword: 'Minimalist Titanium',
      fallbackId: '6ae20f37085517ebbc2dcf00',
      badge: '🏷️ SPECIAL OFFER • 38% OFF',
      title: 'Minimalist Titanium Chronograph Watch',
      description: '40mm matte titanium case with scratch-resistant sapphire crystal and Japanese quartz movement. Heavily discounted with doorstep delivery.',
      price: '₹8,999',
      originalPrice: '₹14,500',
      discount: '38% OFF',
      tag: 'Special Offer',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      ctaText: 'Claim Discount',
    },
  ];

  // Resolve link to product description page using live DB match or fallback ID
  const slides = rawSlides.map((slide) => {
    const matched = allProducts.find((p) =>
      p.name?.toLowerCase().includes(slide.keyword.toLowerCase())
    );
    const productId = matched ? matched._id : slide.fallbackId;
    return {
      ...slide,
      link: `/products/${productId}`,
    };
  });

  // Auto-advance slideshow every 5 seconds unless hovered
  useEffect(() => {
    if (!isPaused) {
      slideTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [isPaused, slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    const fetchCatalogData = async () => {
      try {
        const [featRes, allRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products?limit=50'),
        ]);
        setFeaturedProducts(featRes.data.products || []);
        setAllProducts(allRes.data.products || []);
      } catch (err) {
        console.error('Failed to load products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogData();
  }, []);

  const categories = [
    {
      name: 'Electronics',
      icon: 'bi-laptop',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      count: 'Top Gadgets & Audio',
    },
    {
      name: 'Fashion',
      icon: 'bi-bag',
      img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
      count: 'Apparel & Footwear',
    },
    {
      name: 'Home & Kitchen',
      icon: 'bi-cup-hot',
      img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      count: 'Coffee & Cookware',
    },
    {
      name: 'Sports & Fitness',
      icon: 'bi-heart-pulse',
      img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
      count: 'Gear & Accessories',
    },
  ];

  const active = slides[currentSlide];

  return (
    <div className="pb-5">
      {/* Interactive Hero Slideshow for Trending & Discounted Products */}
      <section className="container my-4">
        <div
          className="hero-gradient p-4 p-md-5 rounded-4 shadow-sm position-relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ minHeight: '440px' }}
        >
          <div className="row align-items-center g-4 position-relative" style={{ zIndex: 2 }}>
            <div className="col-lg-7 text-white">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Link to={active.link} className="text-decoration-none">
                  <span className="badge bg-white text-primary fw-bold px-3 py-2 rounded-pill shadow-sm">
                    {active.badge}
                  </span>
                </Link>
                <span className="badge bg-dark bg-opacity-25 text-white px-2 py-1 rounded-pill small">
                  {active.tag}
                </span>
              </div>
              <Link to={active.link} className="text-decoration-none text-white">
                <h1 className="display-5 fw-extrabold mb-3 text-white">
                  {active.title}
                </h1>
              </Link>
              <p className="lead mb-4 text-white opacity-90" style={{ maxWidth: '620px' }}>
                {active.description}
              </p>
              <div className="d-flex align-items-baseline gap-3 mb-4">
                <span className="fs-2 fw-bold text-white">{active.price}</span>
                <span className="fs-5 text-white-50 text-decoration-line-through">{active.originalPrice}</span>
                <span className="badge bg-white text-danger fw-bold px-2 py-1 rounded-2">{active.discount}</span>
              </div>
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <Link to={active.link} className="btn btn-light btn-lg text-primary fw-bold px-4 shadow-sm">
                  {active.ctaText} <i className="bi bi-arrow-right ms-1"></i>
                </Link>
                <Link to="/products" className="btn btn-outline-light btn-lg px-4">
                  Browse All Deals
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center d-none d-lg-block">
              <Link to={active.link} className="text-decoration-none">
                <div className="position-relative d-inline-block">
                  <img
                    src={active.image}
                    alt={active.title}
                    className="img-fluid rounded-4 shadow-lg border border-light border-opacity-25"
                    style={{ maxHeight: '330px', width: '420px', objectFit: 'cover', transition: 'all 0.5s ease-in-out' }}
                  />
                  <div
                    className="position-absolute bottom-0 start-50 translate-middle-x mb-3 px-3 py-1 rounded-pill bg-dark bg-opacity-75 text-white small fw-semibold"
                  >
                    <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
                    Special Offer • Click to View
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Slideshow Navigation Buttons */}
          <button
            onClick={handlePrevSlide}
            aria-label="Previous slide"
            className="btn btn-light btn-sm rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2 shadow-sm d-flex align-items-center justify-content-center"
            style={{ width: '42px', height: '42px', zIndex: 3, opacity: 0.9 }}
          >
            <i className="bi bi-chevron-left text-primary fs-5"></i>
          </button>
          <button
            onClick={handleNextSlide}
            aria-label="Next slide"
            className="btn btn-light btn-sm rounded-circle position-absolute top-50 end-0 translate-middle-y me-2 shadow-sm d-flex align-items-center justify-content-center"
            style={{ width: '42px', height: '42px', zIndex: 3, opacity: 0.9 }}
          >
            <i className="bi bi-chevron-right text-primary fs-5"></i>
          </button>

          {/* Slideshow Pagination Indicator Dots */}
          <div
            className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2"
            style={{ zIndex: 3 }}
          >
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="border-0 rounded-pill transition"
                style={{
                  width: currentSlide === idx ? '28px' : '10px',
                  height: '10px',
                  backgroundColor: currentSlide === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="container my-5">
        <div className="row g-3 text-center">
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm border border-light h-100">
              <i className="bi bi-truck fs-2 text-primary mb-2 d-block"></i>
              <h6 className="fw-bold mb-1">Free Delivery</h6>
              <p className="text-muted small mb-0">On all orders above ₹500</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm border border-light h-100">
              <i className="bi bi-shield-check fs-2 text-success mb-2 d-block"></i>
              <h6 className="fw-bold mb-1">Secure</h6>
              <p className="text-muted small mb-0">UPI, Cards & 256-bit SSL</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm border border-light h-100">
              <i className="bi bi-arrow-repeat fs-2 text-warning mb-2 d-block"></i>
              <h6 className="fw-bold mb-1">7 Days Returns</h6>
              <p className="text-muted small mb-0">Hassle-free refunds</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm border border-light h-100">
              <i className="bi bi-headset fs-2 text-info mb-2 d-block"></i>
              <h6 className="fw-bold mb-1">24/7 Support</h6>
              <p className="text-muted small mb-0">Dedicated helpline & email</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-primary text-uppercase fw-bold small">Explore By Category</span>
            <h2 className="fw-bold mb-0">Popular Categories</h2>
          </div>
          <Link to="/products" className="text-decoration-none fw-semibold">
            View All <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="row g-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="text-decoration-none text-dark"
              >
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 product-card">
                  <div style={{ height: '160px', overflow: 'hidden' }}>
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body p-3 text-center">
                    <h6 className="fw-bold mb-1">{cat.name}</h6>
                    <span className="text-muted small">{cat.count}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-primary text-uppercase fw-bold small">Handpicked For You</span>
            <h2 className="fw-bold mb-0">Featured Products</h2>
          </div>
          <Link to="/products" className="text-decoration-none fw-semibold">
            Browse All Products <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading products...</span>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

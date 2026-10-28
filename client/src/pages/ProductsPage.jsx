// Products Catalog Page with Modernized Sort Controls
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  const sortOptions = [
    { value: 'newest', label: 'Newest Arrivals', icon: 'bi-sparkles' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'bi-sort-numeric-down' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'bi-sort-numeric-up-alt' },
    { value: 'rating', label: 'Highest Rated', icon: 'bi-star-fill' },
  ];

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Read URL query params
  const currentCategory = searchParams.get('category') || 'all';
  const currentKeyword = searchParams.get('keyword') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        setCategories(res.data.categories || []);
      } catch (e) {}
    };
    fetchCategories();
  }, []);

  // Fetch products when query params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (currentCategory && currentCategory !== 'all') {
          queryParams.set('category', currentCategory);
        }
        if (currentKeyword) {
          queryParams.set('keyword', currentKeyword);
        }
        if (currentSort) {
          queryParams.set('sort', currentSort);
        }
        queryParams.set('page', currentPage);
        queryParams.set('limit', 12);

        const res = await api.get(`/products?${queryParams.toString()}`);
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages || 1);
        setTotalProducts(res.data.totalProducts || 0);
      } catch (err) {
        console.error('Error fetching catalog:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentKeyword, currentSort, currentPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 whenever filters change
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb & Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">
            {currentCategory !== 'all' ? currentCategory : 'All Products'}
          </h2>
          <p className="text-muted small mb-0">
            Showing {products.length} of {totalProducts} items available
            {currentKeyword && <span> for keyword "<strong>{currentKeyword}</strong>"</span>}
          </p>
        </div>

        {/* Modernized Sort Controls */}
        <div className="position-relative mt-3 mt-md-0" ref={sortDropdownRef}>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small fw-semibold text-nowrap d-none d-sm-inline">
              <i className="bi bi-filter-right me-1 text-primary"></i>Sort:
            </span>
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="btn btn-white bg-white border rounded-pill shadow-sm px-3 py-2 d-flex align-items-center gap-2 text-dark fw-semibold"
              style={{ minWidth: '190px', transition: 'all 0.2s ease' }}
            >
              <i className={`${sortOptions.find((o) => o.value === currentSort)?.icon || 'bi-sparkles'} text-primary`}></i>
              <span className="small flex-grow-1 text-start">
                {sortOptions.find((o) => o.value === currentSort)?.label || 'Newest Arrivals'}
              </span>
              <i className={`bi bi-chevron-${isSortOpen ? 'up' : 'down'} text-muted small ms-1`}></i>
            </button>
          </div>

          {isSortOpen && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-1"
              style={{ width: '220px', zIndex: 1050 }}
            >
              {sortOptions.map((opt) => {
                const isSelected = currentSort === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      updateParam('sort', opt.value);
                      setIsSortOpen(false);
                    }}
                    className="w-100 text-start border-0 rounded-2 px-3 py-2 small d-flex align-items-center justify-content-between my-1"
                    style={{
                      backgroundColor: isSelected ? '#fff7ed' : 'transparent',
                      color: isSelected ? '#ea580c' : '#374151',
                      fontWeight: isSelected ? '700' : '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <i className={`${opt.icon} ${isSelected ? 'text-primary' : 'text-muted'}`}></i>
                      {opt.label}
                    </span>
                    {isSelected && <i className="bi bi-check-lg text-primary fw-bold"></i>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Left Sidebar Filter */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 sticky-top" style={{ top: '80px' }}>
            <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center">
              <span>Categories</span>
              {currentCategory !== 'all' && (
                <button
                  onClick={() => updateParam('category', 'all')}
                  className="btn btn-link btn-sm p-0 text-decoration-none text-danger small"
                >
                  Clear
                </button>
              )}
            </h6>

            <div className="list-group list-group-flush small">
              <button
                type="button"
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 border-0 rounded-2 ${
                  currentCategory === 'all' ? 'bg-primary text-white fw-bold' : ''
                }`}
                onClick={() => updateParam('category', 'all')}
              >
                <span>All Categories</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 border-0 rounded-2 ${
                    currentCategory === cat.name ? 'bg-primary text-white fw-bold' : ''
                  }`}
                  onClick={() => updateParam('category', cat.name)}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`badge rounded-pill ${
                      currentCategory === cat.name ? 'bg-light text-primary' : 'bg-light text-secondary'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Keyword Clear if present */}
            {currentKeyword && (
              <div className="mt-4 pt-3 border-top">
                <span className="small text-muted d-block mb-2">Search Filter:</span>
                <span className="badge bg-secondary p-2 d-inline-flex align-items-center gap-1">
                  "{currentKeyword}"
                  <i
                    className="bi bi-x-circle cursor-pointer"
                    onClick={() => updateParam('keyword', '')}
                  ></i>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="col-lg-9">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading products...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm border p-4">
              <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
              <h5>No Products Found</h5>
              <p className="text-muted small">
                We couldn't find any products matching your current filters. Try selecting a different category or clearing search terms.
              </p>
              <button
                onClick={() => {
                  setSearchParams({});
                }}
                className="btn btn-outline-primary btn-sm mt-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {products.map((product) => (
                  <div key={product._id} className="col">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-5">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => updateParam('page', currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <li
                          key={pageNum}
                          className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => updateParam('page', pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}

                    <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => updateParam('page', currentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

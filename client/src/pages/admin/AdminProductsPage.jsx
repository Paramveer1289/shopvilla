// Admin Products Management Page
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    description: '',
    price: '',
    deliveryCharge: '0',
    category: 'Electronics',
    stock: '',
    imageUrl: '',
  };
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products?limit=100');
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData(initialForm);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setIsEditing(true);
    setEditId(p._id);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      deliveryCharge: p.deliveryCharge || 0,
      category: p.category,
      stock: p.stock,
      imageUrl: p.images?.[0] || '',
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      deliveryCharge: Number(formData.deliveryCharge) || 0,
      category: formData.category,
      stock: Number(formData.stock),
      images: [formData.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
    };

    try {
      setSubmitting(true);
      if (isEditing) {
        await api.put(`/products/${editId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowModal(false);
      await fetchProducts();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-0">Manage Products Catalog</h2>
          <p className="text-muted small mb-0">{products.length} active inventory items listed</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-plus-lg"></i> Add New Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted text-uppercase">
                <tr>
                  <th style={{ width: '35%' }}>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Delivery</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://via.placeholder.com/80'}
                          alt={p.name}
                          className="rounded-3 border"
                          style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                        />
                        <div>
                          <span className="fw-bold d-block text-truncate" style={{ maxWidth: '280px' }}>
                            {p.name}
                          </span>
                          <span className="text-muted small">ID: {p._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge-category">{p.category}</span>
                    </td>

                    <td className="fw-semibold">₹{p.price.toLocaleString('en-IN')}</td>

                    <td>
                      {p.deliveryCharge > 0 ? (
                        <span className="badge bg-light text-secondary border small">₹{p.deliveryCharge}</span>
                      ) : (
                        <span className="badge bg-success-subtle text-success small">FREE</span>
                      )}
                    </td>

                    <td>
                      <span className={`badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}`}>
                        {p.stock} units
                      </span>
                    </td>

                    <td>
                      <span className="small fw-semibold text-warning">
                        ★ {p.ratingAverage || 0}
                      </span>
                      <span className="text-muted small ms-1">({p.ratingCount || 0})</span>
                    </td>

                    <td className="text-end">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="btn btn-outline-secondary btn-sm me-2"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="btn btn-outline-danger btn-sm"
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {errorMsg && (
                    <div className="alert alert-danger py-2 small" role="alert">
                      {errorMsg}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Product Title *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Category *</label>
                      <select
                        className="form-select form-select-sm"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                        <option value="Sports & Fitness">Sports & Fitness</option>
                        <option value="Books">Books</option>
                        <option value="Beauty">Beauty</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Price (INR) *</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label small fw-semibold">Delivery (₹)</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm"
                        value={formData.deliveryCharge}
                        onChange={(e) => setFormData({ ...formData, deliveryCharge: e.target.value })}
                        placeholder="0 for FREE"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Stock Quantity *</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Image URL *</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        placeholder="https://images.unsplash.com/..."
                        required
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description *</label>
                      <textarea
                        rows="4"
                        className="form-control form-control-sm"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-sm px-4"
                  >
                    {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;

// Admin Dashboard Page
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading administrative analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
        <div>
          <span className="badge bg-warning text-dark mb-1">Administrative Console</span>
          <h2 className="fw-bold mb-0">ShopVilla Store Analytics</h2>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/admin/products" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-box-seam me-1"></i> Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-receipt me-1"></i> Manage Orders
          </Link>
          <Link to="/admin/customers" className="btn btn-primary btn-sm">
            <i className="bi bi-people me-1"></i> Customers
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="row g-3 mb-4">
        {/* Total Revenue */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">Total Revenue</span>
              <div className="rounded-circle bg-success-subtle text-success p-2">
                <i className="bi bi-currency-rupee fs-5"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-success">
              ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
            </h3>
            <span className="text-muted small">From confirmed customer orders</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">Total Orders</span>
              <div className="rounded-circle bg-primary-light text-primary p-2">
                <i className="bi bi-bag-check fs-5"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-primary">
              {stats?.totalCompletedOrders || 0}
            </h3>
            <span className="text-muted small">Processed on platform</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="col-12 col-sm-6 col-lg-3">
          <Link to="/admin/customers" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 hover-shadow transition">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold">Total Customers</span>
                <div className="rounded-circle bg-info-subtle text-info p-2">
                  <i className="bi bi-people fs-5"></i>
                </div>
              </div>
              <h3 className="fw-bold mb-1 text-info">
                {stats?.totalCustomers || 0}
              </h3>
              <span className="text-muted small">Registered buyer accounts &rarr;</span>
            </div>
          </Link>
        </div>

        {/* Low Stock Alerts */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">Low Stock Warnings</span>
              <div className="rounded-circle bg-danger-subtle text-danger p-2">
                <i className="bi bi-exclamation-triangle fs-5"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-danger">
              {stats?.lowStockCount || 0}
            </h3>
            <span className="text-muted small">&le; 5 units in inventory</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left: Low Stock Table */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Inventory Stock Alerts</h5>
              <Link to="/admin/products" className="small text-decoration-none">
                Update Inventory <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {(!stats?.lowStockProducts || stats.lowStockProducts.length === 0) ? (
              <p className="text-muted small mb-0">All product stock levels are healthy.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th className="text-end">Stock Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockProducts.map((p) => (
                      <tr key={p._id}>
                        <td className="fw-semibold text-truncate" style={{ maxWidth: '220px' }}>
                          {p.name}
                        </td>
                        <td>
                          <span className="badge-category">{p.category}</span>
                        </td>
                        <td>₹{p.price.toLocaleString('en-IN')}</td>
                        <td className="text-end">
                          <span className={`badge ${p.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {p.stock} units
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Orders Overview */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Recent Customer Orders</h5>
              <Link to="/admin/orders" className="small text-decoration-none">
                View All <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {(!stats?.recentOrders || stats.recentOrders.length === 0) ? (
              <p className="text-muted small mb-0">No orders recorded yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th className="text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((ord) => (
                      <tr key={ord._id}>
                        <td className="font-monospace">#{ord._id.slice(-6)}</td>
                        <td>{ord.user?.name || 'Customer'}</td>
                        <td className="fw-bold">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {ord.paymentMethod}
                          </span>
                        </td>
                        <td className="text-end">
                          <span className="badge bg-primary">{ord.orderStatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Catalog by Category</h5>

            <div className="d-flex flex-column gap-3">
              {stats?.categoryStats?.map((c) => (
                <div key={c._id} className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-folder2 text-primary fs-5"></i>
                    <span className="fw-bold">{c._id}</span>
                  </div>
                  <span className="badge bg-white text-dark border px-3 py-2 fs-6">
                    {c.count} items
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

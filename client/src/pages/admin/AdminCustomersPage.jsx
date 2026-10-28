// Admin Customers Directory Page
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/customers');
      setCustomers(res.data.customers || res.data.data?.customers || []);
    } catch (err) {
      console.error('Failed to load customer list:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter customers by search term and email verification status
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterVerified === 'verified') return matchesSearch && cust.isVerified;
    if (filterVerified === 'unverified') return matchesSearch && !cust.isVerified;
    return matchesSearch;
  });

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
        <div>
          <span className="badge bg-warning text-dark mb-1">Customer Relationship Management</span>
          <h2 className="fw-bold mb-0">Registered Customers</h2>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/admin/dashboard" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-speedometer2 me-1"></i> Dashboard
          </Link>
          <Link to="/admin/orders" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-receipt me-1"></i> Orders
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span className="text-muted small fw-semibold">Total Registered Users</span>
            <h3 className="fw-bold text-dark mt-1 mb-0">{customers.length}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span className="text-muted small fw-semibold">Verified Accounts</span>
            <h3 className="fw-bold text-success mt-1 mb-0">
              {customers.filter((c) => c.isVerified).length}
            </h3>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span className="text-muted small fw-semibold">Awaiting Verification</span>
            <h3 className="fw-bold text-warning mt-1 mb-0">
              {customers.filter((c) => !c.isVerified).length}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by customer name, email, or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <select
                className="form-select"
                value={filterVerified}
                onChange={(e) => setFilterVerified(e.target.value)}
              >
                <option value="all">All Verification Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>
            <div className="col-12 col-md-3 text-md-end text-muted small">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          </div>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-uppercase text-muted">
                <th className="ps-4">Customer</th>
                <th>Phone</th>
                <th>Account Status</th>
                <th>Addresses</th>
                <th>Orders Placed</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading customers...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="bi bi-people fs-1 text-muted d-block mb-2"></i>
                    No customers found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: '40px', height: '40px', fontSize: '15px' }}
                        >
                          {cust.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{cust.name}</div>
                          <div className="text-muted small">{cust.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="small text-muted">{cust.phone || 'Not provided'}</td>
                    <td>
                      {cust.isVerified ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1">
                          <i className="bi bi-patch-check-fill me-1"></i> Verified
                        </span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-2 py-1">
                          <i className="bi bi-clock-history me-1"></i> Unverified
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        <i className="bi bi-geo-alt me-1 text-primary"></i>
                        {cust.addressCount || 0} saved
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary text-white rounded-pill px-2">
                        {cust.orderCount || 0} orders
                      </span>
                    </td>
                    <td className="small text-muted">
                      {new Date(cust.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;

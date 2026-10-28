// Admin Orders Fulfillment & Lifecycle Management Page
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Status Change Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // Status History Inspection Modal State
  const [historyModalOrder, setHistoryModalOrder] = useState(null);

  // Valid status transitions matching backend state machine
  const validTransitionsMap = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: [],
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/admin/orders?status=${statusFilter}&page=${currentPage}&limit=15`
      );
      setOrders(res.data.orders || res.data.data?.orders || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalOrders(res.data.totalOrders || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage]);

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    const available = validTransitionsMap[ord.orderStatus] || [];
    setNewStatus(available[0] || ord.orderStatus);
    setStatusNote('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await api.patch(`/admin/orders/${selectedOrder._id}/status`, {
        orderStatus: newStatus,
        note: statusNote,
      });
      setSelectedOrder(null);
      await fetchOrders();
    } catch (err) {
      alert(`Status transition rejected: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge bg-success">Delivered</span>;
      case 'SHIPPED':
        return <span className="badge bg-info text-dark">Shipped</span>;
      case 'CONFIRMED':
        return <span className="badge bg-primary">Confirmed</span>;
      case 'CANCELLED':
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-0">Platform Orders Management</h2>
          <p className="text-muted small mb-0">{totalOrders} total orders placed across the system</p>
        </div>

        {/* Filter dropdown */}
        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          <label className="small text-muted fw-semibold">Filter Status:</label>
          <select
            className="form-select form-select-sm"
            style={{ width: '160px' }}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
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
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => {
                  const isTerminal = ['DELIVERED', 'CANCELLED'].includes(ord.orderStatus);

                  return (
                    <tr key={ord._id}>
                      <td>
                        <span className="font-monospace fw-bold text-dark">
                          #{ord._id.slice(-8)}
                        </span>
                      </td>

                      <td>
                        <div>
                          <strong className="d-block small">{ord.user?.name || 'Customer'}</strong>
                          <span className="text-muted small">{ord.user?.email}</span>
                        </div>
                      </td>

                      <td className="small text-muted">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="small">
                        {ord.items?.length} item(s)
                      </td>

                      <td className="fw-bold text-primary">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </td>

                      <td>
                        <span className="badge bg-light text-dark border small">
                          {ord.paymentMethod}
                        </span>
                        <span className="d-block small text-muted mt-1">
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td>{getStatusBadge(ord.orderStatus)}</td>

                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          {!isTerminal ? (
                            <button
                              onClick={() => handleOpenStatusModal(ord)}
                              className="btn btn-outline-primary"
                            >
                              Update Status
                            </button>
                          ) : (
                            <button className="btn btn-light border text-muted" disabled>
                              Finalized
                            </button>
                          )}
                          <button
                            onClick={() => setHistoryModalOrder(ord)}
                            className="btn btn-outline-secondary"
                            title="Inspect Status History Log"
                          >
                            <i className="bi bi-clock-history"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {selectedOrder && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  Update Order #{selectedOrder._id.slice(-8)}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>

              <form onSubmit={handleUpdateStatus}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Current State</label>
                    <div>
                      {getStatusBadge(selectedOrder.orderStatus)}
                      <span className="text-muted small ms-2">
                        Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Delivery Address</label>
                    <p className="small text-muted p-2 bg-light rounded-2 mb-0">
                      {selectedOrder.shippingAddress?.fullName} | {selectedOrder.shippingAddress?.phone}<br />
                      {selectedOrder.shippingAddress?.line1}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Advance Status To (State Machine Allowed):</label>
                    <select
                      className="form-select form-select-sm"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      {(validTransitionsMap[selectedOrder.orderStatus] || []).map((targetStatus) => (
                        <option key={targetStatus} value={targetStatus}>
                          {targetStatus}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Dispatch / Tracking Note</label>
                    <textarea
                      rows="3"
                      className="form-control form-control-sm"
                      placeholder="e.g. Package dispatched via BlueDart. Tracking AWB: 8492048"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn btn-primary btn-sm px-4"
                  >
                    {updating ? 'Saving...' : 'Confirm Status Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Status History Audit Inspection Modal */}
      {historyModalOrder && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  Status History Log &bull; Order #{historyModalOrder._id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setHistoryModalOrder(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="timeline ps-3 border-start border-2 border-primary ms-2">
                  {historyModalOrder.statusHistory?.map((step, idx) => (
                    <div key={idx} className="position-relative mb-3 ps-3">
                      <span
                        className="position-absolute translate-middle rounded-circle bg-primary"
                        style={{ width: '12px', height: '12px', left: '-1px', top: '8px' }}
                      ></span>
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="fw-bold mb-0">{step.status}</h6>
                        <span className="badge bg-light text-muted border small">
                          {new Date(step.timestamp).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {step.note && <p className="small text-secondary mb-0 mt-1">{step.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm px-3"
                  onClick={() => setHistoryModalOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;

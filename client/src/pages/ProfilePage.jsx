// User Profile & Address Book Management Page
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ProfilePage = () => {
  const { user, refreshUser, addAddress, updateAddress, deleteAddress, setDefaultAddress, changePassword } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ text: '', type: '' });

  // Address Modal / Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setNewAddr({
      fullName: user?.name || '',
      phone: user?.phone || '',
      line1: '',
      line2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setShowAddressForm(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setNewAddr({
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      landmark: addr.landmark || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault || false,
    });
    setShowAddressForm(true);
  };

  const handleSaveAddressSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation for 10-digit Indian phone and 6-digit pincode
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(newAddr.phone.trim())) {
      setStatusMessage({ text: 'Please enter a valid 10-digit Indian phone number starting with 6-9.', type: 'danger' });
      return;
    }

    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(newAddr.pincode.trim())) {
      setStatusMessage({ text: 'Please enter a valid 6-digit Indian postal pincode.', type: 'danger' });
      return;
    }

    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, newAddr);
        setStatusMessage({ text: 'Address updated successfully!', type: 'success' });
      } else {
        await addAddress(newAddr);
        setStatusMessage({ text: 'New address added!', type: 'success' });
      }
      setShowAddressForm(false);
      setEditingAddressId(null);
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setStatusMessage({ text: err.message, type: 'danger' });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await api.put('/auth/update-profile', { name, phone });
      await refreshUser();
      setStatusMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setStatusMessage({ text: err.message, type: 'danger' });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setPwdMessage({ text: 'New passwords do not match.', type: 'danger' });
      return;
    }

    if (newPassword.length < 6) {
      setPwdMessage({ text: 'Password must be at least 6 characters.', type: 'danger' });
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword(currentPassword, newPassword);
      setPwdMessage({ text: 'Password changed successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setPwdMessage({ text: err.message, type: 'danger' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(newAddr);
      setShowAddressForm(false);
      setNewAddr({
        fullName: user?.name || '',
        phone: user?.phone || '',
        line1: '',
        line2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
      });
      setStatusMessage({ text: 'New address added!', type: 'success' });
      setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const addresses = user?.addresses || [];

  return (
    <div className="container py-4">
      <div className="mb-4 pb-2 border-bottom">
        <h2 className="fw-bold mb-1">My Account & Addresses</h2>
        <p className="text-muted small mb-0">Manage personal credentials and saved shipping destinations</p>
      </div>

      {statusMessage.text && (
        <div className={`alert alert-${statusMessage.type} alert-dismissible fade show`} role="alert">
          {statusMessage.text}
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Profile Information Form */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="text-center mb-3">
              <div
                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-bold fs-2 shadow"
                style={{ width: '70px', height: '70px' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h5 className="fw-bold mt-2 mb-0">{user?.name}</h5>
              <span className="badge bg-light text-muted border mt-1 text-uppercase small">
                {user?.role} Account
              </span>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email (Non-editable)</label>
                <input
                  type="email"
                  className="form-control form-control-sm bg-light"
                  value={user?.email || ''}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control form-control-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="btn btn-primary btn-sm w-100"
              >
                {updating ? 'Saving Changes...' : 'Update Profile Details'}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mt-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock text-primary"></i> Change Password
            </h6>

            {pwdMessage.text && (
              <div className={`alert alert-${pwdMessage.type} py-2 small`} role="alert">
                {pwdMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Current Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">New Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  required
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="btn btn-outline-primary btn-sm w-100"
              >
                {changingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Address Book */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Saved Delivery Addresses</h5>
              <button
                onClick={handleOpenAddAddress}
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
              >
                <i className="bi bi-plus-circle"></i> Add Address
              </button>
            </div>

            {/* Inline Add/Edit Address Form */}
            {showAddressForm && (
              <form onSubmit={handleSaveAddressSubmit} className="mb-4 p-3 bg-light rounded-3 border">
                <h6 className="fw-bold mb-3">{editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}</h6>
                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Recipient Full Name *"
                      required
                      value={newAddr.fullName}
                      onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      placeholder="10-digit Phone Number (e.g. 9876543210) *"
                      required
                      pattern="[6-9][0-9]{9}"
                      maxLength="10"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Flat / House No., Apartment, Street Line 1 *"
                      required
                      value={newAddr.line1}
                      onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Area / Sector (Optional)"
                      value={newAddr.line2}
                      onChange={(e) => setNewAddr({ ...newAddr, line2: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Landmark (Optional)"
                      value={newAddr.landmark}
                      onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="City *"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="State *"
                      required
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="6-digit Pincode (e.g. 560038) *"
                      required
                      pattern="[1-9][0-9]{5}"
                      maxLength="6"
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                  <div className="col-12 d-flex gap-2 mt-2">
                    <button type="submit" className="btn btn-primary btn-sm px-3">
                      {editingAddressId ? 'Update Address' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }}
                      className="btn btn-outline-secondary btn-sm px-3"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {addresses.length === 0 ? (
              <p className="text-muted small">No saved addresses found. Add one above for quicker checkout.</p>
            ) : (
              <div className="row g-3">
                {addresses.map((addr) => (
                  <div key={addr._id} className="col-md-6">
                    <div className="card h-100 p-3 rounded-3 border bg-white shadow-sm position-relative">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="fw-bold mb-1">{addr.fullName}</h6>
                        {addr.isDefault && (
                          <span className="badge bg-primary small">Default</span>
                        )}
                      </div>
                      <div className="small text-muted mt-2">
                        <p className="mb-1">{addr.line1}, {addr.line2}</p>
                        <p className="mb-1">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="mb-2 fw-semibold text-dark">Phone: {addr.phone}</p>
                      </div>

                      <div className="mt-auto pt-2 border-top d-flex align-items-center gap-2">
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="btn btn-sm btn-link p-0 text-decoration-none small text-secondary"
                        >
                          <i className="bi bi-pencil me-1"></i> Edit
                        </button>
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr._id)}
                            className="btn btn-sm btn-link p-0 text-decoration-none small"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => deleteAddress(addr._id)}
                          className="btn btn-sm btn-link text-danger p-0 text-decoration-none small ms-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

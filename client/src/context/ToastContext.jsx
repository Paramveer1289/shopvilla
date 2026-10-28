// Toast Notification Context & Provider
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Trigger a new notification toast
  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after specified duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  // Remove toast by unique identifier
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 9999, pointerEvents: 'none' }}
      >
        {toasts.map((toast) => {
          const bgClass =
            toast.type === 'success'
              ? 'bg-success text-white'
              : toast.type === 'danger'
              ? 'bg-danger text-white'
              : toast.type === 'warning'
              ? 'bg-warning text-dark'
              : 'bg-primary text-white';

          const iconClass =
            toast.type === 'success'
              ? 'bi-check-circle-fill'
              : toast.type === 'danger'
              ? 'bi-exclamation-triangle-fill'
              : toast.type === 'warning'
              ? 'bi-exclamation-circle-fill'
              : 'bi-info-circle-fill';

          return (
            <div
              key={toast.id}
              className={`toast show align-items-center ${bgClass} border-0 shadow-lg mb-2 rounded-3`}
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              style={{ pointerEvents: 'auto', minWidth: '280px', maxWidth: '380px' }}
            >
              <div className="d-flex">
                <div className="toast-body d-flex align-items-center gap-2 py-2 px-3">
                  <i className={`bi ${iconClass} fs-5`}></i>
                  <span className="small fw-semibold">{toast.message}</span>
                </div>
                <button
                  type="button"
                  className={`btn-close ${toast.type === 'warning' ? '' : 'btn-close-white'} me-2 m-auto`}
                  aria-label="Close"
                  onClick={() => removeToast(toast.id)}
                ></button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

// Custom Hook to consume Toast notification system
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

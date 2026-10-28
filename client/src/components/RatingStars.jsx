// Rating Stars Component
import React from 'react';

const RatingStars = ({ rating = 0, count = null, showText = true }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning me-1"></i>);
    } else if (rating >= i - 0.5) {
      stars.push(<i key={i} className="bi bi-star-half text-warning me-1"></i>);
    } else {
      stars.push(<i key={i} className="bi bi-star text-muted opacity-50 me-1"></i>);
    }
  }

  return (
    <div className="d-inline-flex align-items-center">
      <div className="d-flex">{stars}</div>
      {showText && (
        <span className="ms-1 small fw-semibold text-secondary">
          {rating > 0 ? rating.toFixed(1) : 'New'}
          {count !== null && (
            <span className="text-muted fw-normal ms-1">({count})</span>
          )}
        </span>
      )}
    </div>
  );
};

export default RatingStars;

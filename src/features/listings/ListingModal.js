// src/components/ListingModal.js
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./ListingModal.css";

const ListingModal = ({ listing, onClose }) => {
  useEffect(() => {
    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    // Add escape key listener
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  if (!listing) return null;

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return createPortal(
    <>
      {/* Overlay - clicking this will close the modal */}
      <div className="listing-modal-overlay" onClick={onClose} />

      {/* Modal Container */}
      <div className="listing-modal-container">
        {/* Modal Content - clicking this shouldn't close the modal */}
        <div className="listing-modal" onClick={handleModalClick}>
          {/* Header with Image */}
          <div className="listing-modal-header">
            <button onClick={onClose} className="listing-modal-back-button">
              ← Back to search
            </button>
            <img src={listing.imageUrl} alt={listing.address} />
          </div>

          {/* Content */}
          <div className="listing-modal-content">
            {/* Address */}
            <h1 className="listing-modal-address">{listing.address}</h1>

            {/* Prices */}
            <div className="listing-modal-prices">
              {listing.prices.map((price, index) => (
                <div key={index} className="price-tag">
                  <span>{price.type}</span>
                  <p>${price.amount}/week</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="features-grid">
              <div className="feature-section">
                <h3>Property Features</h3>
                <ul className="feature-list">
                  <li>Available Now</li>
                  <li>Pet Friendly</li>
                  <li>Built-in Wardrobes</li>
                  <li>Internal Laundry</li>
                </ul>
              </div>

              <div className="feature-section">
                <h3>Building Features</h3>
                <ul className="feature-list">
                  <li>Secure Parking</li>
                  <li>Gym</li>
                  <li>Swimming Pool</li>
                  <li>24/7 Security</li>
                </ul>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Property Description</h3>
              <p className="text-gray-600 leading-relaxed">
                Modern and spacious apartment in the heart of Parramatta.
                Featuring quality finishes throughout, this apartment offers
                contemporary living at its finest. Close to shopping centers,
                restaurants, and public transport.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ListingModal;

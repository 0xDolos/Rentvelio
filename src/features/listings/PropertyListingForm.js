// src/features/listings/PropertyListingForm.js
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, setDoc, collection } from "firebase/firestore";
import "./PropertyListingForm.css";

export const PropertyListingForm = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Core Info
    address: "",
    suburb: "",
    postcode: "",
    state: "",
    propertyType: "",
    weeklyRent: "",
    bond: "",
    availableDate: "",
    bedrooms: "",
    bathrooms: "",
    parkingSpots: "",

    // Features
    petsAllowed: false,
    airConditioning: false,
    heating: false,
    builtInWardrobe: false,
    internalLaundry: false,
    secureParking: false,

    // Agent Info
    agentName: "",
    agentPhone: "",
    agentEmail: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const listingData = {
        ...formData,
        userId: currentUser.uid,
        status: "available",
        datePosted: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      const newListingRef = doc(collection(db, "propertyListings"));
      await setDoc(newListingRef, listingData);
      console.log("Listing created successfully");
      // Add success message or redirect
    } catch (err) {
      console.error("Error creating listing:", err);
      setError("Failed to create listing");
    }

    setLoading(false);
  };

  return (
    <div className="listing-container">
      <form onSubmit={handleSubmit} className="listing-form">
        <h2>Create Property Listing</h2>
        {error && <div className="listing-error">{error}</div>}

        {/* Property Core Info */}
        <div className="form-group">
          <h3>Property Details</h3>
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Suburb"
            value={formData.suburb}
            onChange={(e) =>
              setFormData({ ...formData, suburb: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Postcode"
            value={formData.postcode}
            onChange={(e) =>
              setFormData({ ...formData, postcode: e.target.value })
            }
            required
          />
          <select
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            required
          >
            <option value="">Select State</option>
            <option value="NSW">NSW</option>
            <option value="VIC">VIC</option>
            <option value="QLD">QLD</option>
            <option value="WA">WA</option>
            <option value="SA">SA</option>
            <option value="TAS">TAS</option>
            <option value="ACT">ACT</option>
            <option value="NT">NT</option>
          </select>
        </div>

        {/* Property Type and Costs */}
        <div className="form-group">
          <select
            value={formData.propertyType}
            onChange={(e) =>
              setFormData({ ...formData, propertyType: e.target.value })
            }
            required
          >
            <option value="">Select Property Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="townhouse">Townhouse</option>
          </select>
          <input
            type="number"
            placeholder="Weekly Rent"
            value={formData.weeklyRent}
            onChange={(e) =>
              setFormData({ ...formData, weeklyRent: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Bond Amount"
            value={formData.bond}
            onChange={(e) => setFormData({ ...formData, bond: e.target.value })}
            required
          />
          <h3>Availability</h3>
          <input
            type="date"
            placeholder="Available Date"
            value={formData.availableDate}
            onChange={(e) =>
              setFormData({ ...formData, availableDate: e.target.value })
            }
            required
          />
        </div>

        {/* Property Features */}
        <div className="form-group">
          <h3>Property Features</h3>
          <div className="number-inputs">
            <input
              type="number"
              placeholder="Bedrooms"
              value={formData.bedrooms}
              onChange={(e) =>
                setFormData({ ...formData, bedrooms: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Bathrooms"
              value={formData.bathrooms}
              onChange={(e) =>
                setFormData({ ...formData, bathrooms: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Parking Spots"
              value={formData.parkingSpots}
              onChange={(e) =>
                setFormData({ ...formData, parkingSpots: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Property Description */}
        <div className="form-group">
          <h3>Property Description</h3>
          <textarea
            placeholder="Enter a detailed description of the property..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="property-description"
            rows="4"
            required
          />
        </div>

        {/* Amenities */}
        <div className="form-group">
          <h3>Amenities</h3>
          <div className="checkbox-group">
            {[
              ["petsAllowed", "Pets Allowed"],
              ["airConditioning", "Air Conditioning"],
              ["heating", "Heating"],
              ["builtInWardrobe", "Built-in Wardrobe"],
              ["internalLaundry", "Internal Laundry"],
              ["secureParking", "Secure Parking"],
            ].map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.checked })
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="form-group">
          <h3>Contact Details</h3>
          <input
            type="text"
            placeholder="Name"
            value={formData.agentName}
            onChange={(e) =>
              setFormData({ ...formData, agentName: e.target.value })
            }
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.agentPhone}
            onChange={(e) =>
              setFormData({ ...formData, agentPhone: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.agentEmail}
            onChange={(e) =>
              setFormData({ ...formData, agentEmail: e.target.value })
            }
            required
          />
        </div>

        <button type="submit" disabled={loading} className="listing-button">
          {loading ? "Creating Listing..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import mapboxgl from "mapbox-gl";
import "./RentSubmissionForm.css";

export const RentSubmissionForm = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geocodingResult, setGeocodingResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  const [formData, setFormData] = useState({
    propertyAddress: "",
    propertyType: "",
    weeklyRent: "",
    bondAmount: "",
    leaseStartDate: "",
    leaseEndDate: "",
    utilities: false,
    bedrooms: "",
    bathrooms: "",
    parkingSpots: "",
    internetType: "",
    climateControl: {
      aircon: false,
      heating: false,
    },
    features: {
      petsAllowed: false,
      swimmingPool: false,
      gym: false,
      lifts: false,
      stairs: false,
      balcony: false,
      garden: false,
      builtInWardrobe: false,
    },
  });

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      default:
        break;
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length <= 2) {
      setSuggestions([]);
      return;
    }

    try {
      // Set the access token first
      mapboxgl.accessToken =
        "pk.eyJ1IjoiMHprZ2FudHoiLCJhIjoiY200cWljeHFiMTY2ejJpcHptd3lvMmEzZyJ9.vdYtKYEHJtosd9a6NbfhZQ";

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?country=au&types=address&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features) {
        const formattedSuggestions = data.features.map((feature) => ({
          text: feature.text,
          place_name: feature.place_name,
          center: feature.center,
          state:
            feature.context
              ?.find((c) => c.id.includes("region"))
              ?.short_code?.split("-")[1]
              ?.toUpperCase() || "",
        }));
        setSuggestions(formattedSuggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setFormData({
      ...formData,
      propertyAddress: suggestion.place_name,
    });
    setGeocodingResult({
      coordinates: {
        lng: suggestion.center[0],
        lat: suggestion.center[1],
      },
      formattedAddress: suggestion.place_name,
    });
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!geocodingResult) {
        setError("Please select a valid address from the suggestions");
        setLoading(false);
        return;
      }

      const submissionData = {
        ...formData,
        userId: currentUser.uid,
        dateSubmitted: new Date().toISOString(),
        coordinates: geocodingResult.coordinates,
        formattedAddress: geocodingResult.formattedAddress,
      };

      await setDoc(doc(db, "rentSubmissions", currentUser.uid), submissionData);
      alert("Submission successful!");

      // Reset form
      setFormData({
        propertyAddress: "",
        propertyType: "",
        weeklyRent: "",
        bondAmount: "",
        leaseStartDate: "",
        leaseEndDate: "",
        utilities: false,
        bedrooms: "",
        bathrooms: "",
        parkingSpots: "",
        internetType: "",
        climateControl: { aircon: false, heating: false },
        features: {
          petsAllowed: false,
          swimmingPool: false,
          gym: false,
          lifts: false,
          stairs: false,
          balcony: false,
          garden: false,
          builtInWardrobe: false,
        },
      });
      setGeocodingResult(null);
    } catch (err) {
      setError("Failed to submit rent data");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="submission-container">
      <form onSubmit={handleSubmit} className="submission-form">
        <h2>Submit Rental Details</h2>
        {error && <div className="submission-error">{error}</div>}

        <div className="form-group">
          <h3>Basic Information</h3>
          <div className="address-input-container">
            <input
              type="text"
              placeholder="Property Address"
              value={formData.propertyAddress}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, propertyAddress: value });
                fetchSuggestions(value);
              }}
              onKeyDown={handleKeyDown}
              required
            />
            {suggestions.length > 0 && (
              <ul className="address-suggestions">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={index === selectedIndex ? "selected" : ""}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

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
            value={formData.bondAmount}
            onChange={(e) =>
              setFormData({ ...formData, bondAmount: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <h3>Lease Period</h3>
          <input
            type="date"
            placeholder="Lease Start Date"
            value={formData.leaseStartDate}
            onChange={(e) =>
              setFormData({ ...formData, leaseStartDate: e.target.value })
            }
            required
          />
          <input
            type="date"
            placeholder="Lease End Date"
            value={formData.leaseEndDate}
            onChange={(e) =>
              setFormData({ ...formData, leaseEndDate: e.target.value })
            }
            required
          />
          <label>
            <input
              type="checkbox"
              checked={formData.utilities}
              onChange={(e) =>
                setFormData({ ...formData, utilities: e.target.checked })
              }
            />
            Utilities Included
          </label>
        </div>

        <div className="form-group">
          <h3>Property Details</h3>
          <input
            type="number"
            placeholder="Number of Bedrooms"
            value={formData.bedrooms}
            onChange={(e) =>
              setFormData({ ...formData, bedrooms: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Number of Bathrooms"
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
          <select
            value={formData.internetType}
            onChange={(e) =>
              setFormData({ ...formData, internetType: e.target.value })
            }
            required
          >
            <option value="">Select Internet Type</option>
            <option value="nbn-fttp">NBN FTTP</option>
            <option value="nbn-fttc">NBN FTTC</option>
            <option value="nbn-fttn">NBN FTTN</option>
            <option value="cable">Cable</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <h3>Climate Control</h3>
          <label>
            <input
              type="checkbox"
              checked={formData.climateControl.aircon}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  climateControl: {
                    ...formData.climateControl,
                    aircon: e.target.checked,
                  },
                })
              }
            />
            Air Conditioning
          </label>
          <label>
            <input
              type="checkbox"
              checked={formData.climateControl.heating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  climateControl: {
                    ...formData.climateControl,
                    heating: e.target.checked,
                  },
                })
              }
            />
            Heating
          </label>
        </div>

        <div className="form-group">
          <h3>Features & Amenities</h3>
          {Object.keys(formData.features).map((feature) => (
            <label key={feature}>
              <input
                type="checkbox"
                checked={formData.features[feature]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    features: {
                      ...formData.features,
                      [feature]: e.target.checked,
                    },
                  })
                }
              />
              {feature
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
          ))}
        </div>

        <button type="submit" disabled={loading} className="submission-button">
          {loading ? "Submitting..." : "Submit Rental Details"}
        </button>
      </form>
    </div>
  );
};

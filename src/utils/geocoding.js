// src/utils/geocoding.js
import mapboxgl from "mapbox-gl";

export const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?country=au&types=address&access_token=${mapboxgl.accessToken}`
    );

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const location = data.features[0];
      return {
        success: true,
        coordinates: {
          lng: location.center[0],
          lat: location.center[1],
        },
        formattedAddress: location.place_name,
        context: location.context,
      };
    }

    return {
      success: false,
      error: "Address not found",
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return {
      success: false,
      error: "Geocoding service error",
    };
  }
};

export const validateAddress = (address) => {
  // Basic validation - ensure all required fields are present
  const requiredFields = ["street", "suburb", "state", "postcode"];
  const missingFields = [];

  requiredFields.forEach((field) => {
    if (!address[field] || address[field].trim() === "") {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  return { isValid: true };
};

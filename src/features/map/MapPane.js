import React, { useEffect, useRef, useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import ListingModal from "../listings/ListingModal";
import "./MapPane.css";

const MapPane = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const createMarkerElement = useCallback((type) => {
    const element = document.createElement("div");
    element.className = "marker";
    element.style.width = "24px";
    element.style.height = "24px";
    element.style.borderRadius = "50%";
    element.style.cursor = "pointer";
    element.style.backgroundColor = type === "listing" ? "#8B5CF6" : "#EAB308";
    element.style.border = "2px solid white";
    element.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    return element;
  }, []);

  const formatSubmissionForDisplay = (submission) => {
    return {
      address: submission.propertyAddress,
      suburb: submission.propertyAddress.split(",")[1]?.trim() || "",
      prices: [
        {
          type: `${submission.bedrooms}bd`,
          amount: submission.weeklyRent,
        },
      ],
      details: {
        bedrooms: submission.bedrooms,
        bathrooms: submission.bathrooms,
        parking: submission.parkingSpots,
        type: submission.propertyType,
        bond: submission.bondAmount,
        utilities: submission.utilities ? "Included" : "Not included",
        internet: submission.internetType,
      },
      features: {
        aircon: submission.climateControl.aircon,
        heating: submission.climateControl.heating,
        ...submission.features,
      },
      datePosted: new Date(submission.dateSubmitted).toLocaleDateString(),
      coordinates: submission.coordinates,
    };
  };

  const addMarker = useCallback(
    (coordinates, type, data) => {
      if (!map.current) return;

      const marker = new mapboxgl.Marker({
        element: createMarkerElement(type),
      })
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(map.current);

      marker.getElement().addEventListener("click", () => {
        const formattedData =
          type === "submission" ? formatSubmissionForDisplay(data) : data;
        setSelectedProperty(formattedData);
      });

      markersRef.current.push(marker);
      return marker;
    },
    [createMarkerElement]
  );

  useEffect(() => {
    let currentMarkers = [];

    mapboxgl.accessToken =
      "pk.eyJ1IjoiMHprZ2FudHoiLCJhIjoiY200cWljeHFiMTY2ejJpcHptd3lvMmEzZyJ9.vdYtKYEHJtosd9a6NbfhZQ";

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/0zkgantz/cm4qlsaoe006r01sufo47aps3",
        center: [151.2093, -33.8688], // Sydney coordinates
        zoom: 14,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

      map.current.on("load", async () => {
        try {
          // Fetch listings
          const listingsSnapshot = await getDocs(
            collection(db, "propertyListings")
          );
          listingsSnapshot.forEach((doc) => {
            const listing = doc.data();
            if (listing.coordinates) {
              const marker = addMarker(listing.coordinates, "listing", listing);
              if (marker) currentMarkers.push(marker);
            }
          });

          // Fetch submissions
          const submissionsSnapshot = await getDocs(
            collection(db, "rentSubmissions")
          );
          submissionsSnapshot.forEach((doc) => {
            const submission = doc.data();
            if (submission.coordinates) {
              const marker = addMarker(
                submission.coordinates,
                "submission",
                submission
              );
              if (marker) currentMarkers.push(marker);
            }
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      });
    }

    return () => {
      currentMarkers.forEach((marker) => marker.remove());
    };
  }, [addMarker]);

  return (
    <div id="mapPane">
      <div ref={mapContainer} id="map" />
      {selectedProperty && (
        <ListingModal
          listing={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default MapPane;

// src/components/ListingsPane.js
import React, { useState } from "react";
import ListingModal from "./ListingModal";
import "./ListingsPane.css";

const ListingCard = ({ listing, onClick }) => (
  <div className="listing-card" onClick={onClick}>
    <img src={listing.imageUrl} alt="Property" className="listing-image" />
    <div className="listing-details">
      <p className="listing-address">{listing.address}</p>
      <div className="listing-prices">
        {listing.prices.map((price, index) => (
          <div key={index} className="price-item">
            <span>{price.type}</span>
            <span>${price.amount}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ListingsPane = () => {
  const [selectedListing, setSelectedListing] = useState(null);

  const listings = [
    {
      address: "30 Hunter St, Parramatta",
      imageUrl:
        "https://lh3.googleusercontent.com/p/AF1QipOQNGEF_YPfXAAmLrYT6YMQQjzug_ysBb4YLshc=s1360-w1360-h1020",
      prices: [
        { type: "Studio", amount: "420" },
        { type: "1 Bd", amount: "550" },
        { type: "2 Bd", amount: "750" },
      ],
    },
    {
      address: "53 High St, Parramatta",
      imageUrl:
        "https://rimh2.domainstatic.com.au/-ef5cv2coacHVrmACJ_VUWJRBVs=/fit-in/1920x1080/filters:format(jpeg):quality(80):no_upscale()/17352191_1_1_241213_123910-w1620-h1080",
      prices: [
        { type: "Studio", amount: "450" },
        { type: "1 Bd", amount: "500" },
      ],
    },
    {
      address: "1 Broughton St, Parramatta",
      imageUrl:
        "https://rimh2.domainstatic.com.au/q-V1dbFE9F6vyieII4i7qcGkVpI=/fit-in/1920x1080/filters:format(jpeg):quality(80):no_upscale()/16300991_1_1_230130_031951-w1560-h888",
      prices: [
        { type: "Studio", amount: "400" },
        { type: "1 Bd", amount: "440" },
        { type: "2 Bd", amount: "600" },
      ],
    },
    {
      address: "22 Glebe St, Parramatta",
      imageUrl:
        "https://rimh2.domainstatic.com.au/1vXoHitCMw3cKOBU8dLAWmgme9U=/fit-in/1920x1080/filters:format(jpeg):quality(80):no_upscale()/16321224_1_1_230209_103217-w800-h600",
      prices: [
        { type: "Studio", amount: "700" },
        { type: "1 Bd", amount: "800" },
        { type: "2 Bd", amount: "1,000" },
      ],
    },
  ];

  return (
    <>
      <div id="listingsPane">
        {listings.map((listing, index) => (
          <ListingCard
            key={index}
            listing={listing}
            onClick={() => setSelectedListing(listing)}
          />
        ))}
      </div>

      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </>
  );
};

export default ListingsPane;

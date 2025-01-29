import React, { useState, useEffect } from "react";
import Dropdown from "../../components/DropDown";
import mapboxgl from "mapbox-gl";
import "../../components/DropDown.css";
import "./SearchPane.css";

const SearchPane = () => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [bedsBaths, setBedsBaths] = useState({ beds: "any", baths: "any" });
  const [homeTypes, setHomeTypes] = useState({ H: true, Apt: true, TH: true });
  const [dropdownStates, setDropdownStates] = useState({
    price: { text: "Price", isActive: false },
    bedsBaths: { text: "Beds & Baths", isActive: false },
    homeType: { text: "Home Type", isActive: false },
  });

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

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

  const handlePriceChange = (type, value) => {
    const adjustedValue = adjustValueToStep(parseInt(value));
    setPriceRange((prev) => ({
      ...prev,
      [type]: adjustedValue,
    }));
  };

  const adjustValueToStep = (value) => {
    const getStep = (val) => {
      if (val <= 1000) return 50;
      if (val <= 1500) return 100;
      return 500;
    };
    const step = getStep(value);
    return Math.round(value / step) * step;
  };

  const handlePriceApply = () => {
    const { min, max } = priceRange;
    let text = "Price";
    if (min === 0 && max === 2000) text = "Price";
    else if (min === 0) text = `Under $${max}`;
    else if (max === 2000) text = `Over $${min}`;
    else text = `$${min} - $${max}`;

    setDropdownStates((prev) => ({
      ...prev,
      price: { text, isActive: true },
    }));
  };

  const handleBedsBathsSelection = (type, value) => {
    setBedsBaths((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleBedsBathsApply = () => {
    const { beds, baths } = bedsBaths;
    const bedsText = beds === "any" ? "Any Bd" : `${parseInt(beds)}+ Bd`;
    const bathsText = baths === "any" ? "Any Ba" : `${parseInt(baths)}+ Ba`;

    setDropdownStates((prev) => ({
      ...prev,
      bedsBaths: {
        text: `${bedsText}, ${bathsText}`,
        isActive: true,
      },
    }));
  };

  const handleHomeTypeChange = (type) => {
    setHomeTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleHomeTypeApply = () => {
    const selectedTypes = Object.entries(homeTypes)
      .filter(([_, checked]) => checked)
      .map(([type]) => type)
      .join(", ");

    setDropdownStates((prev) => ({
      ...prev,
      homeType: {
        text: selectedTypes || "Home Type",
        isActive: true,
      },
    }));
  };

  const handleSearch = async (query) => {
    if (!query) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?country=au&types=locality,place&access_token=${
          mapboxgl.accessToken
        }`
      );
      const data = await response.json();

      if (data.features?.length > 0) {
        const coordinates = data.features[0].center;

        const map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/0zkgantz/cm4qlsaoe006r01sufo47aps3",
          center: coordinates,
          zoom: 14,
        });

        map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length <= 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?country=au&types=locality,place&access_token=${
          mapboxgl.accessToken
        }`
      );
      const data = await response.json();

      if (data.features) {
        const formattedSuggestions = data.features.map((feature) => ({
          text: feature.text,
          state:
            feature.context
              ?.find((c) => c.id.includes("region"))
              ?.short_code?.split("-")[1]
              .toUpperCase() || "Unknown",
          center: feature.center,
        }));
        setSuggestions(formattedSuggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setLocation(`${suggestion.text}, ${suggestion.state}`);
    setSuggestions([]);
    handleSearch(suggestion.center);
  };

  return (
    <div id="searchPane">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="search-container">
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search Your Suburb"
          />
          {suggestions.length > 0 && (
            <ul id="suggestions">
              <li className="suggestion-header">
                <span className="location-icon">📍</span>
                <span>LOCATIONS</span>
              </li>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`suggestion-item ${
                    index === selectedIndex ? "active" : ""
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span>
                    {suggestion.text}, {suggestion.state}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Dropdown
          buttonText={dropdownStates.price.text}
          contentClass="price-dropdown-content"
          onApply={handlePriceApply}
        >
          <div className="price-dropdown-body">
            <h3>Price</h3>
            <p className="price-display">
              {priceRange.min === 0 && priceRange.max === 2000
                ? "Any"
                : priceRange.min === 0
                ? `Under $${priceRange.max}`
                : priceRange.max === 2000
                ? `Over $${priceRange.min}`
                : `$${priceRange.min} - $${priceRange.max}`}
            </p>
            <div className="price-slider">
              <div className="slider-track">
                <div
                  className="slider-track-fill"
                  style={{
                    left: `${(priceRange.min / 2000) * 100}%`,
                    right: `${100 - (priceRange.max / 2000) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="slider-thumb min-thumb"
                />
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="slider-thumb max-thumb"
                />
              </div>
            </div>
          </div>
        </Dropdown>

        <Dropdown
          buttonText={dropdownStates.bedsBaths.text}
          contentClass="beds-baths-dropdown-content"
          onApply={handleBedsBathsApply}
        >
          <div>
            <label>No. of Beds</label>
            <div className="filter-options" id="bedsOptions">
              {["any", "1+", "2+", "3+", "4+", "5+"].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`filter-btn ${
                    bedsBaths.beds === value ? "active" : ""
                  }`}
                  onClick={() => handleBedsBathsSelection("beds", value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label>No. of Baths</label>
            <div className="filter-options" id="bathsOptions">
              {["any", "1+", "2+", "3+", "4+"].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`filter-btn ${
                    bedsBaths.baths === value ? "active" : ""
                  }`}
                  onClick={() => handleBedsBathsSelection("baths", value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </Dropdown>

        <Dropdown
          buttonText={dropdownStates.homeType.text}
          contentClass="home-type-dropdown-content"
          onApply={handleHomeTypeApply}
        >
          <div className="home-type-options">
            <label>
              <input
                type="checkbox"
                checked={homeTypes.H}
                onChange={() => handleHomeTypeChange("H")}
              />{" "}
              House
            </label>
            <label>
              <input
                type="checkbox"
                checked={homeTypes.Apt}
                onChange={() => handleHomeTypeChange("Apt")}
              />{" "}
              Apartment
            </label>
            <label>
              <input
                type="checkbox"
                checked={homeTypes.TH}
                onChange={() => handleHomeTypeChange("TH")}
              />{" "}
              Townhouse
            </label>
          </div>
        </Dropdown>

        <input type="submit" value="Search" />
      </form>
    </div>
  );
};

export default SearchPane;

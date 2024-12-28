document.addEventListener('DOMContentLoaded', function () {
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const minPriceLabel = document.getElementById('minPriceLabel');
    const maxPriceLabel = document.getElementById('maxPriceLabel');
    const rangeTrack = document.querySelector('.range-track');
    const priceDropdown = document.getElementById('priceDropdown');
    const applyPrice = document.getElementById('applyPrice');
    const bedsBathsDropdown = document.getElementById('bedsBathsDropdown');
    const bedsOptions = document.querySelectorAll('#bedsOptions .filter-btn');
    const bathsOptions = document.querySelectorAll('#bathsOptions .filter-btn');
    const applyBedsBaths = document.getElementById('applyBedsBaths');
    const homeTypeDropdown = document.getElementById('homeTypeDropdown');
    const applyHomeType = document.getElementById('applyHomeType');
    const homeTypeCheckboxes = document.querySelectorAll('input[name="homeType"]');
    const suggestionsList = document.getElementById('suggestions'); // Added for dynamic suggestions
    const locationInput = document.getElementById('location');

    const defaultMin = 0; // Default minimum price
    const defaultMax = 2000; // Default maximum price

    // Helper function to get step size based on the value
    function getStep(value) {
        if (value <= 1000) {
            return 50;
        } else if (value <= 1500) {
            return 100;
        } else {
            return 500;
        }
    }

    // Function to adjust slider value based on step size
    function adjustValueToStep(value) {
        const step = getStep(value);
        return Math.round(value / step) * step;
    }

    // Update the slider values inside the dropdown live
    function updateSlider() {
        let min = parseInt(minPrice.value);
        let max = parseInt(maxPrice.value);

        // Adjust values to fit the step sizes dynamically
        min = adjustValueToStep(min);
        max = adjustValueToStep(max);

        // Ensure the min and max logic
        if (min >= max) {
            minPrice.value = adjustValueToStep(max - getStep(max));
            min = parseInt(minPrice.value);
        }

        if (max <= min) {
            maxPrice.value = adjustValueToStep(min + getStep(min));
            max = parseInt(maxPrice.value);
        }

        // Update slider DOM values
        minPrice.value = min;
        maxPrice.value = max;

        // Update dropdown live values
        if (min === defaultMin && max === defaultMax) {
            minPriceLabel.textContent = 'Any'; // Default state
            maxPriceLabel.textContent = ''; // Clear additional label
        } else if (min === defaultMin) {
            minPriceLabel.textContent = `Under $${max}`;
            maxPriceLabel.textContent = ''; // No second label needed
        } else if (max === defaultMax) {
            minPriceLabel.textContent = `Over $${min}`;
            maxPriceLabel.textContent = ''; // Clear the max label
        } else {
            minPriceLabel.textContent = `$${min} - $${max}`; // Combine labels into a single range
            maxPriceLabel.textContent = ''; // Clear the maxPriceLabel
        }

        // Update range track fill
        const totalRange = defaultMax - defaultMin;
        const minPercent = ((min - defaultMin) / totalRange) * 100;
        const maxPercent = ((max - defaultMin) / totalRange) * 100;

        rangeTrack.style.left = `${minPercent}%`;
        rangeTrack.style.width = `${maxPercent - minPercent}%`;
    }

    // Update the button only on Apply
    applyPrice.addEventListener('click', function () {
        const min = parseInt(minPrice.value);
        const max = parseInt(maxPrice.value);
    
        // Update dropdown button text
        if (min === defaultMin && max === defaultMax) {
            priceDropdown.textContent = 'Any'; // Reset to default
        } else if (min === defaultMin) {
            priceDropdown.textContent = `Under $${max}`;
        } else if (max === defaultMax) {
            priceDropdown.textContent = `Over $${min}`;
        } else {
            priceDropdown.textContent = `$${min} - $${max}`;
        }
    
        // Ensure the active class is added for all scenarios
        priceDropdown.classList.add('active');
    });

    // Event listeners for live slider update
    minPrice.addEventListener('input', updateSlider);
    maxPrice.addEventListener('input', updateSlider);

    // Initialize the slider on page load
    updateSlider();

    let selectedBeds = 'any';
    let selectedBaths = 'any';

    // Function to handle selection
    function handleSelection(option, type) {
        const options = type === 'beds' ? bedsOptions : bathsOptions;
        options.forEach(btn => btn.classList.remove('active'));
        option.classList.add('active');

        if (type === 'beds') {
            selectedBeds = option.dataset.value;
        } else {
            selectedBaths = option.dataset.value;
        }
    }

    // Attach event listeners to filter buttons
    bedsOptions.forEach(option => {
        option.addEventListener('click', () => handleSelection(option, 'beds'));
    });

    bathsOptions.forEach(option => {
        option.addEventListener('click', () => handleSelection(option, 'baths'));
    });

    // Apply Beds & Baths selection
    applyBedsBaths.addEventListener('click', function () {
        let bedsText = selectedBeds === 'any' ? 'Any Bd' : `${parseInt(selectedBeds)}+ Bd`;
        let bathsText = selectedBaths === 'any' ? 'Any Ba' : `${parseInt(selectedBaths)}+ Ba`;
    
        // Update dropdown button text
        bedsBathsDropdown.textContent = `${bedsText}, ${bathsText}`;
    
        // Ensure the active class is added even for default settings
        bedsBathsDropdown.classList.add('active');
    });

    // Default state tracking for Home Type
    let defaultState = {
        H: true, // House
        Apt: true, // Apartment
        TH: true, // Townhouse
    };

    // Function to reset Home Type to default state
    function resetToDefault() {
        homeTypeCheckboxes.forEach((checkbox) => {
            checkbox.checked = defaultState[checkbox.value];
        });
        homeTypeDropdown.classList.remove('active');
        homeTypeDropdown.textContent = 'Home Type';
    }

    // Function to check if any changes were made
    function checkForChanges() {
        let changesMade = false;

        homeTypeCheckboxes.forEach((checkbox) => {
            if (checkbox.checked !== defaultState[checkbox.value]) {
                changesMade = true;
            }
        });

        if (changesMade) {
            homeTypeDropdown.classList.add('active');

            // Update button text based on selected types
            const selectedTypes = Array.from(homeTypeCheckboxes)
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.value) // Use abbreviations (H, Apt, TH)
                .join(', ');

            homeTypeDropdown.textContent = selectedTypes || 'Home Type';
        } else {
            resetToDefault(); // If no changes, reset to default
        }
    }

    // Apply button functionality for Home Type
    applyHomeType.addEventListener('click', function () {
        // Always highlight the button when Apply is pressed
        homeTypeDropdown.classList.add('active');
    
        // Update button text based on selected types
        const selectedTypes = Array.from(homeTypeCheckboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value) // Use abbreviations (H, Apt, TH)
            .join(', ');
    
        // If no selections are made, fallback to default
        homeTypeDropdown.textContent = selectedTypes || 'Home Type';
    });

    // Initialize Home Type dropdown to default state
    resetToDefault();

    // Set your Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiMHprZ2FudHoiLCJhIjoiY200cWljeHFiMTY2ejJpcHptd3lvMmEzZyJ9.vdYtKYEHJtosd9a6NbfhZQ';

    // Initialize the Mapbox map
    const map = new mapboxgl.Map({
        container: 'map', // ID of the map container div
        style: 'mapbox://styles/0zkgantz/cm4qlsaoe006r01sufo47aps3', // Map style
        center: [151.2093, -33.8688], // Coordinates for the default center (example: Melbourne, AU)
        zoom: 14 // Default zoom level
    });

    // Example GeoJSON data
    const geojson = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [151.2093, -33.8688]
                },
                properties: {
                    message: 'Sydney!!!',
                    imageId: 10,
                    iconSize: [50, 50]
                }
            },
        ]
    };

    // Add custom markers to the map
    for (const marker of geojson.features) {
        const el = document.createElement('div');
        const width = marker.properties.iconSize[0];
        const height = marker.properties.iconSize[1];
        el.className = 'marker';
        el.style.backgroundImage = `url('./assets/markers/marker.png')`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';

        el.addEventListener('click', () => {
            alert(marker.properties.message);
        });

        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
    }

    // Add zoom and rotation controls to the map
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    
    // Suggestions Logic
    let activeSuggestionIndex = -1; // Track active suggestion
    const searchButton = document.querySelector('#searchButton'); // Reference to search button

    locationInput.addEventListener('input', async function () {
        const query = locationInput.value.trim();

        if (query.length > 2) { // Trigger suggestions for more than 2 characters
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=au&types=locality,place&access_token=pk.eyJ1IjoiMHprZ2FudHoiLCJhIjoiY200cWljeHFiMTY2ejJpcHptd3lvMmEzZyJ9.vdYtKYEHJtosd9a6NbfhZQ`
                );
                const data = await response.json();

                suggestionsList.innerHTML = ''; // Clear existing suggestions
                activeSuggestionIndex = -1; // Reset active suggestion

                if (data.features && data.features.length > 0) {
                    data.features.forEach((feature, index) => {
                        // Extract necessary information
                        const suburb = feature.text || "Unknown Suburb";
                        const state = feature.context
                            ? feature.context.find((c) => c.id.includes("region"))?.short_code?.split("-")[1].toUpperCase() || "Unknown State"
                            : "Unknown State"; // Extract state abbreviation

                        // Create suggestion item
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <span>${suburb}, ${state}</span>
                        `;

                        // Add click functionality to select the suggestion and trigger search
                        li.addEventListener('click', () => {
                            locationInput.value = `${suburb}, ${state}`;
                            suggestionsList.innerHTML = ''; // Clear suggestions on selection
                            triggerSearch(); // Trigger the search automatically
                        });

                        // Append the suggestion item
                        suggestionsList.appendChild(li);
                    });
                } else {
                    suggestionsList.innerHTML = '<li>No suggestions found</li>';
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                suggestionsList.innerHTML = '<li>Error fetching suggestions</li>';
            }
        } else {
            suggestionsList.innerHTML = ''; // Clear suggestions if query length is short
        }
    });

    // Handle keyboard navigation
    locationInput.addEventListener('keydown', function (event) {
        const suggestions = suggestionsList.querySelectorAll('li');

        if (event.key === 'ArrowDown') {
            // Move down in the list
            if (suggestions.length > 0) {
                if (activeSuggestionIndex < suggestions.length - 1) {
                    activeSuggestionIndex++;
                }
                updateActiveSuggestion(suggestions);
            }
            event.preventDefault(); // Prevent default cursor movement
        } else if (event.key === 'ArrowUp') {
            // Move up in the list
            if (suggestions.length > 0) {
                if (activeSuggestionIndex > 0) {
                    activeSuggestionIndex--;
                }
                updateActiveSuggestion(suggestions);
            }
            event.preventDefault(); // Prevent default cursor movement
        } else if (event.key === 'Enter') {
            // Select the active suggestion and trigger search
            if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
                suggestions[activeSuggestionIndex].click(); // Simulate a click on the active suggestion
            } else {
                triggerSearch(); // Trigger search if no suggestion is active
            }
            event.preventDefault(); // Prevent form submission
        }
    });

    // Update the active suggestion style
    function updateActiveSuggestion(suggestions) {
        suggestions.forEach((item, index) => {
            if (index === activeSuggestionIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Trigger search functionality
    function triggerSearch() {
        const query = locationInput.value.trim();

        if (query) {
            // Example search functionality: Update the map
            console.log(`Searching for: ${query}`);
            // Trigger your search logic here (e.g., Mapbox API or other functionality)
        } else {
            console.warn('No query to search.');
        }
    }

    // Handle search submission
    document.querySelector('#searchPane form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const query = locationInput.value.trim();
        if (query) {
            try {
                const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&country=au&proximity=ip&types=locality,place,postcode&access_token=pk.eyJ1IjoiMHprZ2FudHoiLCJhIjoiY200cWljeHFiMTY2ejJpcHptd3lvMmEzZyJ9.vdYtKYEHJtosd9a6NbfhZQ`);
                const data = await response.json();

                if (data.features && data.features.length > 0) {
                    const [longitude, latitude] = data.features[0].geometry.coordinates;
                    const map = new mapboxgl.Map({
                        container: 'map',
                        style: 'mapbox://styles/0zkgantz/cm4qlsaoe006r01sufo47aps3',
                        center: [longitude, latitude],
                        zoom: 14
                    });
                } else {
                    alert('No results found for the search query.');
                }
            } catch (error) {
                console.error('Error during search:', error);
                alert('An error occurred while performing the search.');
            }
        } else {
            alert('Please enter a valid suburb name.');
        }
    });
});
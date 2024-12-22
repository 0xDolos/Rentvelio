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

    // Try to fetch the user's location and update the map center
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLongitude = position.coords.longitude;
                const userLatitude = position.coords.latitude;

                // Center the map on the user's location
                map.setCenter([userLongitude, userLatitude]);
                map.setZoom(14); // Adjust zoom level for city view
            },
            (error) => {
                console.warn('Geolocation failed or denied. Using fallback location.');
                console.error(error);
                // Map will stay at the fallback location
            }
        );
    } else {
        console.warn('Geolocation is not supported by this browser.');
        // Map will stay at the fallback location
    }

    // Add zoom and rotation controls to the map
    map.addControl(new mapboxgl.NavigationControl());
    
    // Handle search submission
    document.querySelector('#searchPane form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent form submission

        const query = document.querySelector('#location').value.trim();

        if (query) {
            try {
                // Geocoding API request
                const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=AU`);            const data = await response.json();

                if (data.features && data.features.length > 0) {
                    const [longitude, latitude] = data.features[0].center;

                    // Fly to the searched location
                    map.flyTo({
                        center: [longitude, latitude],
                        zoom: 14 // Adjust zoom level as needed
                    });
                } else {
                    alert('No results found. Try searching for a different suburb.');
                }
            } catch (error) {
                console.error('Error fetching location data:', error);
                alert('An error occurred while searching. Please try again later.');
            }
        } else {
            alert('Please enter a suburb to search.');
        }
    });
});
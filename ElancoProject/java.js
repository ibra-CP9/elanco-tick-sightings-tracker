
const mapMarkers = [];

// Create the map and set its starting position over the UK.
const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.waymorphic.com/styles/positron",
    center: [-3, 54.5],
    zoom: 5
});

// Coordinates used to place markers on the map.
// Map coordinates use [longitude, latitude].
const cityCoordinates = {
    "London": [-0.1276, 51.5072],
    "Birmingham": [-1.8904, 52.4862],
    "Manchester": [-2.2426, 53.4808],
    "Glasgow": [-4.2518, 55.8642],
    "Bristol": [-2.5879, 51.4545],
    "Newcastle": [-1.6178, 54.9783],
    "Sheffield": [-1.4701, 53.3811],
    "Nottingham": [-1.1496, 52.9548],
    "Cardiff": [-3.1791, 51.4816],
    "Leicester": [-1.1398, 52.6369],
    "Edinburgh": [-3.1883, 55.9533],
    "Southampton": [-1.4044, 50.9097],
    "Leeds": [-1.5491, 53.8008],
    "Liverpool": [-2.9916, 53.4084]
};

// API endpoint that provides the tick sighting data.
const API_URL = "https://dev-task.elancoapps.com/data/tick-sightings";

fetch(API_URL)
    .then(Response => Response.json())
    .then(data => {

        // Store all sightings returned by the API.
        const allSighting = data;

        // Count how many times each species appears in each city.
        const citySpeciesCounts = {};

        allSighting.forEach(sighting => {
            const city = sighting.location;
            const species = sighting.species;

            // Create a section for the city if it does not exist.
            if (!citySpeciesCounts[city]) {
                citySpeciesCounts[city] = {};
            }

            // Increase the count for this species in this city.
            citySpeciesCounts[city][species] =
                (citySpeciesCounts[city][species] || 0) + 1;
        });

        // Assign a project severity level based on the number of sightings.
        function getSeverity(count) {
            console.log("Checking count:", count);

            if (count <= 13) return "Low";
            if (count <= 17) return "Medium";
            return "High";
        }

        // Get the HTML elements used by the filters and sightings list.
        const FilterSightings = document.getElementById("species-filter");
        const sightingList = document.getElementById("sightings-lists");
        const severityFilter = document.getElementById("severity-filter");
        const startDate = document.getElementById("start-date");
        const endDate = document.getElementById("end-date");
        const filterButton = document.getElementById("filter-button");

        // Display the total number of sightings and different species.
        document.getElementById("total-sightings").textContent =
            allSighting.length;

        document.getElementById("total-species").textContent =
            new Set(allSighting.map(s => s.species)).size;


        // Create map markers for the sightings currently being displayed.
        function addSightingMarkers(sightingsToShow) {

            // Remove old markers so they are not duplicated on the map.
            mapMarkers.forEach(marker => marker.remove());
            mapMarkers.length = 0;

            // Group sightings by city so each city gets one marker.
            const sightingsByCity = {};

            sightingsToShow.forEach(sighting => {
                if (cityCoordinates[sighting.location]) {

                    if (!sightingsByCity[sighting.location]) {
                        sightingsByCity[sighting.location] = [];
                    }

                    sightingsByCity[sighting.location].push(sighting);
                }
            });

            // Create a marker for each city containing sightings.
            Object.keys(sightingsByCity).forEach(city => {
                const sightings = sightingsByCity[city];

                // Find the different species recorded in this city.
                const speciesRecorded = [
                    ...new Set(sightings.map(s => s.species))
                ];

                // Calculate the severity for each recorded species.
                const severityLevels = speciesRecorded.map(
                    species => getSeverity(
                        citySpeciesCounts[city]?.[species] || 0
                    )
                );

                console.log(city, severityLevels);

                // Check whether a specific species has been selected.
                const selectedSpecies = FilterSightings.value;

                let citySeverity;

                // Use the selected species' severity when filtering by species.
                if (selectedSpecies !== "all") {
                    const count =
                        citySpeciesCounts[city]?.[selectedSpecies] || 0;

                    citySeverity = getSeverity(count);

                } else {
                    // Otherwise, show the highest severity found in the city.
                    citySeverity = severityLevels.includes("High")
                        ? "High"
                        : severityLevels.includes("Medium")
                            ? "Medium"
                            : "Low";
                }

                // Match each severity level to a marker colour.
                const markerColours = {
                    Low: "#22a06b",
                    Medium: "#e99a16",
                    High: "#d93636"
                };

                console.log(
                    city,
                    speciesRecorded,
                    severityLevels,
                    citySeverity
                );

                // Create and style the marker shown on the map.
                const markerElement = document.createElement("div");

                markerElement.style.width = "18px";
                markerElement.style.height = "18px";
                markerElement.style.borderRadius = "50%";
                markerElement.style.backgroundColor =
                    markerColours[citySeverity];
                markerElement.style.border = "3px solid white";
                markerElement.style.boxShadow = "0 1px 5px #555";
                markerElement.style.cursor = "pointer";

                // Prepare the information displayed when the marker is clicked.
                const popupContent = `
                    <strong>${city}</strong><br>
                    Number of sightings: ${sightings.length}<br>
                    Species: ${speciesRecorded.join(", ")}<br>
                    Severity: ${citySeverity}
                `;

                // Position the marker and attach its popup to the map.
                const marker = new maplibregl.Marker({
                    element: markerElement
                })
                    .setLngLat(cityCoordinates[city])
                    .setPopup(new maplibregl.Popup().setHTML(popupContent))
                    .addTo(map);

                // Show detailed information when the marker is clicked.
                marker.getElement().addEventListener("click", () => {
                    const detailsPanel =
                        document.getElementById("sighting-details");

                    detailsPanel.innerHTML = `
                        <h2>Sighting Information</h2>
                        <h3>${city}</h3>
                        <p><strong>Total sightings:</strong>
                            ${sightings.length}</p>
                        <p><strong>Species recorded:</strong>
                            ${speciesRecorded.join(", ")}</p>
                        <p><strong>Project severity:</strong>
                            ${citySeverity}</p>

                        <div class="sighting-actions">
                            <a href="report.html" class="action-button">
                                Report a Sighting
                            </a>

                            <a
                                href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(city + ', UK')}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="action-button"
                            >
                                Get Directions
                            </a>

                            <button
                                id="share-action"
                                class="action-button"
                                type="button"
                            >
                                Share
                            </button>
                        </div>
                    `;

                    // Get the Share button from the details panel.
                    const shareButton =
                        detailsPanel.querySelector("#share-action");

                    // Copy the selected city's sighting information to the clipboard.
                    shareButton.addEventListener("click", async () => {
                        const shareText =
                            `Tick sightings in ${city}\n` +
                            `Total sightings: ${sightings.length}\n` +
                            `Species: ${speciesRecorded.join(", ")}\n` +
                            `Project severity: ${citySeverity}`;

                        try {
                            await navigator.clipboard.writeText(shareText);
                            alert(
                                "Sighting information copied! You can now share it."
                            );
                        } catch (error) {
                            // Ask the user to copy the text if clipboard access fails.
                            window.prompt(
                                "Copy your sighting information:",
                                shareText
                            );
                        }
                    });
                });

                // Save the marker so it can be removed when filters change.
                mapMarkers.push(marker);
            });
        }

        // Wait until the map has loaded before adding the first markers.
        if (map.loaded()) {
            addSightingMarkers(allSighting);
        } else {
            map.once("load", () => addSightingMarkers(allSighting));
        }


        // Add every species from the API to the species dropdown.
        const species = new Set(
            allSighting.map(sighting => sighting.species)
        );

        species.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            FilterSightings.appendChild(option);
        });


        // Run the filters whenever a filter value changes.
        FilterSightings.addEventListener("change", applyFilters);
        severityFilter.addEventListener("change", applyFilters);
        startDate.addEventListener("change", applyFilters);
        endDate.addEventListener("change", applyFilters);


        // Filter sightings by species, severity and date range.
        function applyFilters() {
            const selectedSpecies = FilterSightings.value;
            const selectedSeverity = severityFilter.value;
            const selectedStartDate = startDate.value;
            const selectedEndDate = endDate.value;

            // Keep only sightings that match all selected filter conditions.
            const filteredSightings = allSighting.filter(sighting => {
                return (
                    // Species filter: show all species or the selected species.
                    (selectedSpecies === "all" ||
                        sighting.species === selectedSpecies) &&

                    // Severity filter: match the calculated severity.
                    (selectedSeverity === "all" ||
                        getSeverity(
                            citySpeciesCounts[sighting.location]
                                ?.[sighting.species] || 0
                        ) === selectedSeverity) &&

                    // Start date filter: exclude sightings before this date.
                    (!selectedStartDate ||
                        new Date(sighting.date) >=
                        new Date(selectedStartDate)) &&

                    // End date filter: include sightings through the selected day.
                    (!selectedEndDate ||
                        new Date(sighting.date) <
                        new Date(selectedEndDate + "T00:00:00").getTime()
                            + 86400000)
                );
            });

            // Update both the recent sightings list and the map markers.
            displaySightings(filteredSightings);
            addSightingMarkers(filteredSightings);
        }

        // Apply the selected filters when the Filter button is clicked.
        filterButton.addEventListener("click", applyFilters);


        // Sort sightings by date, with the newest ones first.
        allSighting.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Display the five most recent sightings when the page first loads.
        displaySightings(allSighting);


        // Display sightings as cards in the recent sightings list.
        function displaySightings(sightings) {

            // Clear the previous cards before displaying the updated results.
            sightingList.replaceChildren();

            // Show a maximum of five sightings.
            sightings.slice(0, 5).forEach(sighting => {
                const sightCard = document.createElement("article");

                sightingList.appendChild(sightCard);

                // Display the location of the sighting.
                const LocationHeading = document.createElement("h3");
                LocationHeading.textContent = sighting.location;
                sightCard.appendChild(LocationHeading);

                // Format and display the date and time.
                const cardDate = document.createElement("p");

                cardDate.textContent = new Date(sighting.date).toLocaleString(
                    "en-GB",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hourCycle: "h23"
                    }
                );

                sightCard.appendChild(cardDate);

                // Display the common species name.
                const speciesCard = document.createElement("p");
                speciesCard.textContent = sighting.species;
                sightCard.appendChild(speciesCard);

                // Display the scientific (Latin) name of the species.
                const cardName = document.createElement("p");
                cardName.textContent = sighting.latinName;
                sightCard.appendChild(cardName);
            });
        }
    });

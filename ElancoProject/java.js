const mapMarkers = [];
const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.waymorphic.com/styles/positron",
    center: [-3, 54.5],
    zoom: 5
});
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


const API_URL = "https://dev-task.elancoapps.com/data/tick-sightings";
fetch(API_URL)
.then(Response => Response.json())
.then(data => {
    const allSighting = data;

// Count sightings for each species in each city
const citySpeciesCounts = {};

allSighting.forEach(sighting => {
    const city = sighting.location;
    const species = sighting.species;

    if (!citySpeciesCounts[city]) {
        citySpeciesCounts[city] = {};
    }

    citySpeciesCounts[city][species] =
        (citySpeciesCounts[city][species] || 0) + 1;
});

// Project-defined severity based on sighting counts
function getSeverity(count) {
    console.log("Checking count:", count);

    if (count <= 13) return "Low";
    if (count <= 17) return "Medium";
    return "High";
}
    const FilterSightings = document.getElementById("species-filter");
    const sightingList = document.getElementById("sightings-lists");
    const severityFilter = document.getElementById("severity-filter");
    const startDate = document.getElementById("start-date");
    const endDate = document.getElementById("end-date");
    const filterButton = document.getElementById("filter-button");

    document.getElementById("total-sightings").textContent =
        allSighting.length;

    document.getElementById("total-species").textContent =
        new Set(allSighting.map(s => s.species)).size;




function addSightingMarkers(sightingsToShow) {
    mapMarkers.forEach(marker => marker.remove());
    mapMarkers.length = 0;

    const sightingsByCity = {};

    sightingsToShow.forEach(sighting => {
        if (cityCoordinates[sighting.location]) {
            if (!sightingsByCity[sighting.location]) {
                sightingsByCity[sighting.location] = [];
            }

            sightingsByCity[sighting.location].push(sighting);
        }
    });

    Object.keys(sightingsByCity).forEach(city => {
        const sightings = sightingsByCity[city];

        const speciesRecorded = [
            ...new Set(sightings.map(s => s.species))
        ];

        const severityLevels = speciesRecorded.map(
    species => getSeverity(
        citySpeciesCounts[city]?.[species] || 0
    )
);
console.log(city, severityLevels);

       const selectedSpecies = FilterSightings.value;

let citySeverity;

if (selectedSpecies !== "all") {
    const count = citySpeciesCounts[city]?.[selectedSpecies] || 0;
    citySeverity = getSeverity(count);
} else {
    citySeverity = severityLevels.includes("High")
        ? "High"
        : severityLevels.includes("Medium")
            ? "Medium"
            : "Low";
}

        const markerColours = {
            Low: "#22a06b",
            Medium: "#e99a16",
            High: "#d93636"
        };
        console.log(city, speciesRecorded, severityLevels, citySeverity);

        const markerElement = document.createElement("div");

        markerElement.style.width = "18px";
        markerElement.style.height = "18px";
        markerElement.style.borderRadius = "50%";
        markerElement.style.backgroundColor =
            markerColours[citySeverity];
        markerElement.style.border = "3px solid white";
        markerElement.style.boxShadow = "0 1px 5px #555";
        markerElement.style.cursor = "pointer";

        const popupContent = `
            <strong>${city}</strong><br>
            Number of sightings: ${sightings.length}<br>
            Species: ${speciesRecorded.join(", ")}<br>
            Severity: ${citySeverity}
        `;

        const marker = new maplibregl.Marker({
            element: markerElement
        })
            .setLngLat(cityCoordinates[city])
            .setPopup(new maplibregl.Popup().setHTML(popupContent))
            .addTo(map);

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

    <button id="share-action" class="action-button" type="button">
        Share
    </button>
</div>

            `;
            

const shareButton = detailsPanel.querySelector("#share-action");

shareButton.addEventListener("click", async () => {
    const shareText =
        `Tick sightings in ${city}\n` +
        `Total sightings: ${sightings.length}\n` +
        `Species: ${speciesRecorded.join(", ")}\n` +
        `Project severity: ${citySeverity}`;

    try {
        await navigator.clipboard.writeText(shareText);
        alert("Sighting information copied! You can now share it.");
    } catch (error) {
        window.prompt("Copy your sighting information:", shareText);
    }
});

        });
        

        mapMarkers.push(marker);
    });
}

if (map.loaded()) {
    addSightingMarkers(allSighting);
} else {
    map.once("load", () => addSightingMarkers(allSighting));
}



    const species = new Set (
        allSighting.map(sighting => sighting.species)
    );
    species.forEach(name => {
            const option = document.createElement("option");
            option.value = name ;
            option.textContent = name ;
            FilterSightings.appendChild(option)
    });
FilterSightings.addEventListener("change", applyFilters);
severityFilter.addEventListener("change", applyFilters);
startDate.addEventListener("change", applyFilters);
endDate.addEventListener("change", applyFilters);


function applyFilters() {
    const selectedSpecies = FilterSightings.value;
    const selectedSeverity = severityFilter.value;
    const selectedStartDate = startDate.value;
    const selectedEndDate = endDate.value;

    const filteredSightings = allSighting.filter(sighting => {
        return (
            (selectedSpecies === "all" ||
                sighting.species === selectedSpecies) &&

            (selectedSeverity === "all" ||
                getSeverity(
                    citySpeciesCounts[sighting.location]?.[sighting.species] || 0
                ) === selectedSeverity) &&

            (!selectedStartDate ||
                new Date(sighting.date) >= new Date(selectedStartDate)) &&

            (!selectedEndDate ||
                new Date(sighting.date) <
                new Date(selectedEndDate + "T00:00:00").getTime() + 86400000)
        );
    });

    displaySightings(filteredSightings);
    addSightingMarkers(filteredSightings);
}


filterButton.addEventListener("click", applyFilters);

    allSighting.sort((a,b) => new Date(b.date) - new Date(a.date));
    displaySightings( allSighting);
    function displaySightings(sightings){
        sightingList.replaceChildren();
    sightings.slice(0, 5).forEach(sighting => {
        const sightCard = document.createElement("article");
        


        sightingList.appendChild(sightCard);
        

        const LocationHeading = document.createElement("h3")
        LocationHeading.textContent = sighting.location;
        sightCard.appendChild (LocationHeading);

        const cardDate = document.createElement("p");
        cardDate.textContent = new Date(sighting.date).toLocaleString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
});
        sightCard.appendChild(cardDate);

        const speciesCard = document.createElement("p");
        speciesCard.textContent = sighting.species;
        sightCard.appendChild(speciesCard);

        const cardName = document.createElement("p");
        cardName.textContent = sighting.latinName;
        sightCard.appendChild(cardName);
    })
}

});

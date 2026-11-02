# Elanco Tick Sightings Tracker

**Author:** Ibrahim Illo

## Project Overview

The Tick Sightings Tracker is a frontend web application built for the Elanco
Placement Program technical task. It helps UK citizens explore tick sightings,
learn about tick species and prevention, and submit sighting reports.

## Features

### 1. Interactive Dashboard (`index.html`)
- Interactive map of tick sightings across UK cities.
- Colour-coded markers showing project-defined severity (green, amber, red).
- Filters for species, severity and date range.
- Summary cards showing total sightings and species recorded.
- Recent sightings list (the five newest sightings matching the filters).
- Information panel when a marker is clicked, with quick actions to report a
  sighting, get directions (Google Maps) and share the details (copy to clipboard).

### 2. Tick Education Guide (`education.html`)
- Identification information for the five tick species in the dataset.
- Tick bite prevention guidance, with links to UKHSA and NHS sources.

### 3. Report a Sighting (`report.html`)
- Form for date, time, location, species, an optional image and a description.
- Validation with error, warning and success messages: required fields, no
  future dates, and image type and size (5 MB maximum) checks.
- Image preview and removal.

## Technologies Used

- HTML5 for page structure.
- CSS3 for layout and styling.
- JavaScript for application logic, filtering, form validation and interactivity.
- MapLibre GL JS for the interactive map.
- Elanco Tick Sightings API as the data source.
- Browser local storage for saving submitted reports.

## Project Structure

| File | Purpose |
|---|---|
| `index.html`, `style.css`, `java.js` | Dashboard: map, filters and severity logic |
| `education.html`, `education.css` | Tick guide (static content) |
| `report.html`, `report.css`, `report.js` | Report form, validation and local storage |

## Design and Technical Choices

- **Plain HTML, CSS and JavaScript (no framework):** the project is small, and
  keeping to the basics kept the code readable and easy to follow.
- **MapLibre GL JS:** recommended to me while planning the project. I chose it
  because it was the best free option for my needs, with no API key or payment
  required.
- **City-level markers:** the API provides city names rather than coordinates, so
  sightings are matched against a lookup table of 14 UK cities.
- **Severity model:** severity is based on the number of sightings of one species
  in one city. Low is 13 or fewer, Medium is 14 to 17, and High is 18 or more.
  The thresholds were suggested with AI assistance, based on my idea that severity
  should depend on how often a species is recorded in a city. They are a
  project-defined scale, not an official measure, and are easy to change in the
  `getSeverity` function in `java.js`.
- **City marker colour:** a city's marker shows its highest severity across all
  its species. If a species filter is selected, it shows that species' severity.
- **Severity uses the whole dataset:** counts are not recalculated when filtering,
  so a city's severity stays consistent while the user explores.
- **Browser local storage for reports:** this is a frontend-only task with no
  backend, so submitted reports are saved in the browser.
- **Client-side validation:** gives immediate feedback, and values are checked
  again on submit.
- **Accessibility and responsiveness:** form labels, an `aria-live` message area
  and responsive layouts for smaller screens.

## API

Sighting data is fetched from:

https://dev-task.elancoapps.com/data/tick-sightings

## How to Run the Project

No installation or build step is needed.

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Install the **Live Server** extension if it is not already installed.
4. Right-click `index.html` and select **Open with Live Server**.
5. Use the navigation links to move between the dashboard, tick guide and
   report form.

An internet connection is required to load the API data and map resources.

## Limitations

- Severity levels are a project-defined measure and are not an official medical
  risk assessment.
- Only the 14 cities in the coordinates list appear on the map. Sightings in other
  cities count towards the totals but have no marker.
- Submitted reports are stored only in the browser's local storage. They are not
  sent to a backend and do not appear on the dashboard.
- Uploaded images are validated and previewed, but are not stored or uploaded.
- If the API is unavailable, the dashboard shows no data and no error message.

## Future Improvements

- Send reports to a backend and display them on the map.
- Store uploaded images.
- Add error handling for API failures.
- Support more cities, or use geocoding to place markers.
- Base the severity thresholds on analysis of the full dataset.

## Use of AI

I used AI tools to help build most of the code for this project. I reviewed and
tested the code, and I can explain how each part works in the walkthrough video.

## Author

Ibrahim Illo

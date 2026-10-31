# elanco-tick-sightings-tracker
# Elanco Tick Sightings Tracker

**Author:** Ibrahim Illo

## Project Overview

The Tick Sightings Tracker is a frontend web application developed as part of the Elanco Placement Program technical task. It aims to help UK citizens explore tick sightings, learn about tick species and prevention, and submit reports of sightings.

## Features

### 1. Interactive Dashboard
- Interactive map displaying tick sightings across UK cities.
- Colour-coded markers representing project-defined severity levels.
- Filters for species, severity and date range.
- Recent sightings list.
- Sighting information panel with city, species and severity details.
- Quick actions to report a sighting, get directions and share information.

### 2. Tick Education Guide
- Tick species identification information.
- Guidance on preventing tick bites.

### 3. Report a Sighting
- Form for entering sighting details, including date, time, location and species.
- Form validation with error, warning and success feedback.
- Image upload with preview, removal and file validation.

## Technologies Used

- HTML5 — page structure.
- CSS3 — layout and styling.
- JavaScript — application logic, filtering, form validation and interactivity.
- MapLibre GL JS — interactive map visualisation.
- Elanco Tick Sightings API — retrieves sighting data.
- Browser local storage — stores submitted report details locally.

## API

The application retrieves tick sighting data from:

https://dev-task.elancoapps.com/data/tick-sightings

An internet connection is required to retrieve the API data and load the map resources.

## How to Run the Project

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension if it is not already installed.
4. Right-click `index.html` and select **Open with Live Server**.
5. Use the navigation links to explore the dashboard, education guide and report form.

An internet connection is required for the external API and map resources.

## Notes and Limitations

- Severity levels are calculated using sighting counts for this project and do not represent official medical risk assessments.
- Submitted reports are stored in the browser's local storage; they are not sent to a shared backend database.
- Uploaded images can be previewed, but are not uploaded to a server.

## Author

Ibrahim Illo

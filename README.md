# Translink Bus Tracker

## Overview
`translink_parser.js` is a bus tracking application that allows users to track bus routes and their live updates (e.g., trip status, vehicle positions) from the UQ Lakes station. It prompts the user for specific bus route details, such as the date, time, and route, and fetches live data for the bus routes from a local server. This tool processes static data files (CSV) and updates the user with live information such as scheduled and live arrival times for buses, and the current position of the buses.

## Requirements
- Node.js
- Required Node.js modules:
  - `prompt-sync`: For user input from the command line.
  - `csv-parser`: For reading and parsing CSV files.
  - `fs`: For interacting with the file system.

Ensure these dependencies are installed by running:
```bash
npm install prompt-sync csv-parser

## File Structure

static-data/ ├── routes.txt ├── trips.txt ├── stop_times.txt ├── stops.txt └── calendar.txt translink_parser.js

## How It Works

The `translink_parser.js` script works by:
1. **User Input**: Prompts the user for the following:
   - **Departure Date**: The date the user will be leaving.
   - **Departure Time**: The time of departure the user will be leaving.
   - **Bus Route**: The bus route the user wants to track.

2. **Loading Static Data**: The script loads static data from CSV files located in the `static-data/` directory. The required files are:
   - `routes.txt`
   - `trips.txt`
   - `stop_times.txt`
   - `stops.txt`
   - `calendar.txt`

3. **Fetching Live Data**: The script fetches live trip updates and vehicle position information from the following URLs:
   - Trip Updates: `http://127.0.0.1:5343/gtfs/seq/trip_updates.json`
   - Vehicle Positions: `http://127.0.0.1:5343/gtfs/seq/vehicle_positions.json`

4. **Filtering and Processing Data**: Based on the user input (date, time, and bus route), the script filters through the static and live data to display relevant bus routes and their statuses.

5. **Display Results**: Once the data is processed, the relevant information such as scheduled arrival times, live arrival times, and vehicle positions is displayed in a table format.

6. **Re-running the Application**: After showing the results, the user is prompted whether they want to perform another search.

## Example Usage

1. Clone or download the repository.
2. Make sure the `static-data/` directory contains the necessary CSV files.
3. Start the server providing live bus data.
4. Run the script using Node.js:
    ```bash
    node translink_parser.js
    ```

The application will prompt for:
- **Departure date** (format: YYYY-MM-DD)
- **Departure time** (format: HH:mm)
- **Bus route** (choose from 1 to 9)

Based on your input, it will fetch live bus data and show relevant updates.

## Notes
- The app fetches live data from a local server (running at `http://127.0.0.1:5343/gtfs/seq/`). You need to make sure this server is up and running to get live updates.
- The static data files are expected to be in the `static-data/` directory, and they must follow the format mentioned in the script.

## License
This project is open-source. Feel free to modify and use it as per your needs.


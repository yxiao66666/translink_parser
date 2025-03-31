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

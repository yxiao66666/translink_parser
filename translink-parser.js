// Yang Xiao COMP2140 A1 - 46828846

// Required modules
const prompt = require("prompt-sync")({
    sigint: true
});
const csvParser = require('csv-parser');
const fs = require('fs');

// the URLs for live bus trip data and position data.
const tripUpdatesURL = 'http://127.0.0.1:5343/gtfs/seq/trip_updates.json';
const vehiclePositionsURL = 'http://127.0.0.1:5343/gtfs/seq/vehicle_positions.json';

/**
 * This function is the main bus tracker app
 */
async function busTracker() {
    // Welcoming words
    console.log('Welcome to the UQ Lakes station bus tracker!');

    // The date, time and route that user entered
    const userDepartDate = await checkDate();
    const userDepartTime = await checkTime();
    const userDepartRoute = await checkRoute();

    // Location for the data to be stored
    const routes = [];
    const trips = [];
    const stopTimes = [];
    const stops = [];
    const calendar = [];
    const selectedRoute = [];

    // Loading data into designated location
    await loadData('static-data/routes.txt', routes);
    await loadData('static-data/trips.txt', trips);
    await loadData('static-data/stop_times.txt', stopTimes);
    await loadData('static-data/stops.txt', stops);
    await loadData('static-data/calendar.txt', calendar);

    // Convert user entered date from String into Number
    // e.g. Convert '2023-07-08' into 20230708
    const enteredDate = Number(userDepartDate.replace(/-/g, ''));

    // Live trip information
    const tripInfo = await readTripUpdates();

    // Live trip position information
    const livePositionInfo = await readPositionUpdates();
    
    // Filtering out only the wanted bus route by route short name
    const wantedRoutes = routes.filter(route => {
        if (userDepartRoute === 'Show All Routes') {
            return [
                '66', '192', '169', '209', '29', 'P332', '139', '28'
            ].includes(route.route_short_name);
        } else {
            return route.route_short_name === userDepartRoute;
        }
    });

    // Filtering out only the wanted bus stops by platform name
    const wantedStops = [
        'UQ Lakes, platform A',
        'UQ Lakes, platform C',
        'UQ Lakes, platform F',
        'UQ Lakes station'
    ];

    // Filtering bus route
    wantedRoutes.forEach((route) => {
        trips.filter(trip => trip.route_id === route.route_id && checkDateRunning(trip.service_id))
            .forEach((trip) => {
                calendar.filter(calendarDate => calendarDifferentDate(calendarDate, enteredDate, trip.service_id))
                    .forEach((calendarDate) => {
                        stopTimes.filter(stopTime => trip.trip_id === stopTime.trip_id)
                            .forEach((stopTime) => {
                                stops.filter(stop => stopTime.stop_id === stop.stop_id && wantedStops.includes(stop.stop_name))
                                    .forEach((stop) => {
                                        // Live trip route
                                        const matchingTrip = tripInfo.find(trip => {
                                            return (
                                                trip.routeId === route.route_id &&
                                                calendarDifferentDate(calendarDate, enteredDate, trip.service_id) &&
                                                stopTimesDifferentTime(stopTime, userDepartTime, 10)
                                            );
                                        });
                                        const liveArrivalTime = matchingTrip ? matchingTrip.startTime : 'No Live Data';
                                        
                                        if (stopTimesDifferentTime(stopTime, userDepartTime, 10)) {
                                            selectedRoute.push({
                                                'Route Short Name': route.route_short_name,
                                                'Route Long Name': route.route_long_name,
                                                'Service ID': trip.service_id,
                                                'Heading Sign': trip.trip_headsign,
                                                'Scheduled Arrival Time': stopTime.arrival_time,
                                                'Live Arrival Time': liveArrivalTime,
                                                'Live Vehicle Position': livePositionInfo,
                                            });
                                        }
                                    });
                            });
                    });
            });
    });

    console.table(selectedRoute);
    
    /**
     * Checks if the calendar date is within the date range.
     * @param {object} calendarDate - calendarDate.start_date, calendarDate.end_date, and calendarDate.service_id.
     * @param {number} enteredDate - The user entered date.
     * @param {string} tripServiceId - The trip's service_id
     * @returns {boolean} If the date is valid for the bus route.
     */
    function calendarDifferentDate(calendarDate, enteredDate, tripServiceId) {
        return (
            Number(calendarDate.start_date) <= enteredDate &&
            Number(calendarDate.end_date) >= enteredDate &&
            tripServiceId === calendarDate.service_id
        );
    }

    /**
     * Checks if the stop time is within 10 minutes from the user entered time.
     * @param {Object} stopTime - Needs the stopTimes.arrival_time.
     * @param {string} userDepartTime - The user entered time.
     * @param {number} within10Minutes - The 10 minutes time range.
     * @returns {boolean} If the time is within 10 minutes from the user entered time.
     */
    function stopTimesDifferentTime(stopTime, userDepartTime, within10Minutes) {
        const formattedArrivalTime = new Date(`2000-01-01T${`${stopTime.arrival_time}`}`); // bus arrival time
        const formattedTime = new Date(`2000-01-01T${`${userDepartTime}:00`}`); // User enter time
        const timeDifference = (formattedArrivalTime - formattedTime) / (1000 * 60);
        
        return formattedArrivalTime >= formattedTime && timeDifference <= within10Minutes;
    }

    /**
     * This function loads data from a csv file and store it in an array.
     * @param {Array} calendar - the array contains calendar from calendar.txt
     * @returns {Boolean} check if the bus is runnning on that given date.
     */
    function checkDateRunning(serviceId) {
        const runningDate = new Date(userDepartDate);

        const calendarDate = calendar.find(calendarDate => calendarDate.service_id === serviceId);
        if (!calendarDate) {
            return false;
        }
    
        switch (runningDate.getDay()) {
            case 0:
                if (calendarDate.sunday === '1') {
                    return true;
                } else {
                    return false;
                }
            case 1:
                if (calendarDate.monday === '1') {
                    return true;
                } else {
                    return false;
                }
            case 2:
                if (calendarDate.tuesday === '1') {
                    return true;
                } else {
                    return false;
                }
            case 3:
                if (calendarDate.wednesday === '1') {
                    return true;
                } else {
                    return false;
                }
            case 4:
                if (trcalendarDateip.thursday === '1') {
                    return true;
                } else {
                    return false;
                }
            case 5:
                if (calendarDate.friday === '1') {
                    return true;
                } else {
                    return false;
                }
            case 6:
                if (calendarDate.saturday === '1') {
                    return true;
                } else {
                    return false;
                }
            default:
                return false;
        }
    }
}

/**
 * This function loads data from a csv file and store it in an array.
 * @param {string} filePath - the csv file path.
 * @param {Array} dataStoreLocation - the array where the data will be stored.
 * @returns {Promise} resolves when data loading is complete.
 */
async function loadData(filePath, dataStoreLocation) {
    return new Promise((resolve) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row) => {
                dataStoreLocation.push(row);
            })
            .on("end", () => {
                resolve();
            });
    });
}

/**
 * This function prompts for the user input and check date.
 * @returns {string} a formatted date.
 */
function checkDate() {
    let departDate;
    let dateKey = false;

    while (!dateKey) {
        departDate = prompt('What date will you depart UQ Lakes station by bus?');
        if (validateDate(departDate)) {
            dateKey = true;
        } else {
            console.error('Incorrect date format. Please use YYYY-MM-DD');
        }
    }
    return departDate;
}

/**
 * This function prompts for the user input and check time.
 * @returns {string} a formatted time.
 */
function checkTime() {
    let departTime;
    let timeKey = false;

    while (!timeKey) {
        departTime = prompt('What time will you depart UQ Lakes station by bus?');
        if (validateTime(departTime)) {
            timeKey = true;
        } else {
            console.error('Incorrect time format. Please use HH:mm');
        }
    }
    return departTime;
}

/**
 * This function prompts for the user input and check route.
 * @returns {string} option 1 - 9 is allocated to bus route. 
 */
function checkRoute() {
    let departRoute;
    let routeKey = false;

    while (!routeKey) {
        departRoute = prompt('What Bus Route would you like to take?\n1 - Show All Routes\n2 - 66\n3 - 192\n4 - 169\n5 - 209\n6 - 29\n7 - P332\n8 - 139\n9 - 28');
        if (validateRoute(departRoute)) {
            routeKey = true;
        } else {
            console.error('Please enter a valid option for a bus route.');
        }
    }

    // Assigning numbers to bus routes
    const routeMappings = {
        '1': 'Show All Routes',
        '2': '66',
        '3': '192',
        '4': '169',
        '5': '209',
        '6': '29',
        '7': 'P332',
        '8': '139',
        '9': '28'
    };
    return routeMappings[departRoute];
}

/**
 * This function validates date.
 * @param {string} checkDate - check if the date is in YYYY-MM-DD format.
 * @returns {boolean} true if the param is in a formatted date, false otherwise.
 */
function validateDate(checkDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(checkDate);
}

/**
 * This function validates time.
 * @param {string} checkTime - check if the date is in HH:MM format.
 * @returns {boolean} true if the param is in a formatted time, false otherwise.
 */
function validateTime(checkTime) {
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(checkTime);
}

/**
 * This function validates route.
 * @param {string} checkRoute - check if the route is in any of the 1 - 9 options.
 * @returns {boolean} True if the param is in a formatted route, false otherwise.
 */
function validateRoute(checkRoute) {
    const validRoutes = ["1", "2", "3", "4",
        "5", "6", "7", "8", "9"
    ];
    return validRoutes.includes(checkRoute);
}

/**
 * This function validates whether the input is a valid option for restarting.
 * @param {string} checkRestart - check if the input is y or n.
 * @returns {boolean} true if the input is a valid option, false otherwise.
 */
function validRestart(checkRestart) {
    const restart = ['y', 'yes', 'Y', 'Yes',
        'n', 'no', 'N', 'No'
    ];
    return restart.includes(checkRestart);
}

/**
 * This function fetches data from URL.
 * @param {string} url - the URL to fetch data from.
 * @returns {string} the JSON response.
 */
async function fetchData(url) {
    const response = await fetch(url);
    const responseJSON = await response.json();
    return responseJSON;
}

/**
 * This function reads trip data and map it accordingly.
 * @returns {Array} the array containing live bus information.
 */
async function readTripUpdates() {
    const tripUpdatesData = await fetchData(tripUpdatesURL);

    const tripUpdates = tripUpdatesData.entity
        .map(entity => entity.tripUpdate)
        .filter(tripUpdate => tripUpdate);

    // Getting trip information from each tripUpdate
    const tripInfo = tripUpdates.map(tripUpdate => {
        const { trip } = tripUpdate;

        return {
            tripId: trip.tripId,
            routeId: trip.routeId,
            startTime: trip.startTime,
            startDate: trip.startDate,
            scheduleRelationship: trip.scheduleRelationship,
        };
    });
    return tripInfo; 
}

/**
 * This function reads trip data and map it accordingly.
 * @returns {Array} the array containing live bus position information.
 */
async function readPositionUpdates() {
    const positionUpdatesData = await fetchData(vehiclePositionsURL);

    if (positionUpdatesData.vehicle) {
        const vehicleInfo = positionUpdatesData.vehicle;
        return vehicleInfo;
    } else {
        return 'No Live Data'; 
    }
}

/**
 * Note: Not functioning.
 * This function fetches vehicle positions and filter it based on the user entered date.
 * @param {string} userDepartRoute - The user entered bus route.
 * @param {string} userDepartTime - The user entered time.
 * @param {string} userDepartDate - The user entered date.
 */
async function filterBusRoute(userDepartRoute, userDepartTime, userDepartDate) {
    const tripUpdatesData = await readTripUpdates();
    //if (tripUpdatesData.startDate === userDepartDate) {}
}

/**
 * This function will save a JSON cache file.
 * @param {string} filenameAppend - The string to append to the JSON filename.
 * @param {string} data - The wanted JSON data.
 */
async function saveCache(filenameAppend, data) {
    try {
        await fs.writeFile(jsonFilename(filenameAppend), JSON.stringify(data));
        console.log(messageSaveCache(filenameAppend));
    } catch (error) {
        console.log(error);
    }
}

/**
 * This function will read a JSON cache file with the specified filename.
 * @param {string} filenameAppend - The string to append to the JSON filename.
 * @returns {string} the JSON data from the cache file.
 */
async function readCache(filenameAppend) {
    try {
        const data = await fs.readFile(jsonFilename(filenameAppend));
        console.log(messageReadCache(filenameAppend));
        return data;
    } catch (error) {
        console.log(error);
    }
}

/**
 * This function prompts user for a restart and checks if the input is valid.
 */
async function restart() {
    await busTracker();

    // true if either yes or no is entered so break the loop of prompting a valid option
    let endKey = false;
    while (!endKey) {
        const restartPrompt = prompt('Would you like to search again?');
        if (validRestart(restartPrompt)) { // Valid input and restart
            if (restartPrompt == "y" || restartPrompt == "yes") {
                await busTracker();
            } else if (restartPrompt == "n" || restartPrompt == "no") { // Valid input and not restart
                console.log('Thanks for using the UQ Lakes station bus tracker!');
                endKey = true; // Exit the loop and end the bus tracker
            }

        } else { // Not valid input and not restart yet
            console.error('Please enter a valid option.');
        }
    }
}

// app starter
restart();

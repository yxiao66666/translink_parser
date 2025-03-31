COMP2140 Yang Xiao - 46828846 README

Fetching live data on vehicle arrival time and position is not fully functioning.

The following two functions may result a longer exit time after the thank you message is displayed.

async function readPositionUpdates() {const positionUpdatesData = await fetchData(vehiclePositionsURL)}

async function readTripUpdates() {const tripUpdatesData = await fetchData(tripUpdatesURL)}



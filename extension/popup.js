// Populate dropdown with station names
function populateStationDropdown() {
    const dropdown = document.getElementById("stationSelect");
    dropdown.innerHTML = "";//clear the current dropdown, ready for population

    Object.keys(station_ids)
        .sort((a, b) => a.localeCompare(b))//sort alphabetically and create an option for each station
        .forEach(station => {
        const option = document.createElement("option");
        option.value = station; //station name used to look up
        option.textContent = station;//what the user sees
        dropdown.appendChild(option);
        });

    // Set default to London Bridge
    dropdown.value = "London Bridge";
}

async function loadDepartures(stationName)  {
    const stopPointIds = station_ids[stationName];
    const container = document.getElementById("platforms");
    const refreshTime = document.getElementById("refreshTime");
    
    // Handle unknown stations
    if (!stopPointIds) {
        container.innerHTML = `<p style="color:red;">Unknown station.</p>`;
        return;
    }
    container.innerHTML = "<p>Loading live departures…</p>"; //temp mesage whilst its fetching api data
    let arrivals = [];

    try{
        // Some stations have multiple StopPoints (e.g., paddington)
        // Fetch all of them from api and combine into one arrivals array
        for (const id of stopPointIds) {
            const res = await fetch(`https://api.tfl.gov.uk/StopPoint/${id}/Arrivals`);
            const data = await res.json();
            arrivals = arrivals.concat(data);
        }
        // data is an array of arrival predictions
        // Sort by time to station 
        arrivals.sort((a, b) => a.timeToStation - b.timeToStation);//soonest trains first
            
        const platforms = {};
        const seen = new Set();

        arrivals.forEach(arr => { //loop thru each arrival
            const platform = arr.platformName;
            if (!platform) return; //if empty skip

            const destination = arr.destinationName?.replace("Underground Station", "").trim() || "Check front of train";
            const line = arr.lineName;
            if (!line) return; //if empty skip

            const rounded = Math.floor(arr.timeToStation / 30);
            const key = `${destination}-${line}-${rounded}`;//unique key for this train so it isnt dupilicated
            if (seen.has(key)) return;//skips dupilcate keys
            seen.add(key);

            //extract direction
            const dirMatch = /(Northbound|Southbound|Eastbound|Westbound)/i.exec(platform);
            const direction = dirMatch ? dirMatch[1] : "Unknown";

            //extract platform no
            const numMatch = /Platform\s*(\w+)/i.exec(platform);
            const number = numMatch ? numMatch[1] : platform.trim();

            //build formatted label
            const label = direction !== "Unknown" ? `Platform ${number} - ${direction}` : `Platform ${number}`;
            if (!platforms[label]) platforms[label] = [];

            //add current trains data to the platrroms
            platforms[label].push({
                destination,
                minutes: Math.floor(rounded / 2),
                line
            });
        });

        //sort platforms by no
        const sorted = Object.entries(platforms).sort((a, b) => {
        const aNum = parseInt(a[0].match(/Platform (\d+)/)?.[1] || 999);
        const bNum = parseInt(b[0].match(/Platform (\d+)/)?.[1] || 999);
        return aNum - bNum;
        });

        const now = new Date();
        refreshTime.textContent = `Updated at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;


        //to render all platforms section in the pop up
        container.innerHTML = sorted.map(([label, trains]) => `
            <div class="platform-depature-board">
                <h3>${label}</h3>
                ${trains.map((t, i) => `
                    <p>
                    <b>${i + 1}.</b> ${t.destination}
                    <span class="line-badge line-${t.line
                        .replace(/&/g, 'and')   // replace & with 'and'
                        .replace(/\s+/g, '-')   // spaces → hyphens
                        }">
                        ${t.line.replace('-', ' ')}
                    </span>
                    — ${t.minutes} min
                </p>
                `).join("")}
            </div>
        `).join("");

    } catch (err) {
        console.error("TfL fetch error:", err);
        container.innerHTML = `<p style="color:red;">Could not load TfL data.</p>`;
    }
}
//Setup event listeners
document.addEventListener("DOMContentLoaded", () => {
    // populate the dropdown with all station names
    populateStationDropdown();

    // Get references to dropdown and refresh button
    const dropdown = document.getElementById("stationSelect");
    const refreshBtn = document.getElementById("refresh-button");

    // Load default statio
    loadDepartures(dropdown.value);

    // Whenever user selects a different station, fetch new data
    dropdown.addEventListener("change", () => {
        loadDepartures(dropdown.value);
    });

    //reload data for the currently selected station
    refreshBtn.addEventListener("click", () => {
        loadDepartures(dropdown.value);
    });
});

// Form injection
document.getElementById("fill-form-button").addEventListener("click", async() => {
    try{
        const dropdown = document.getElementById("stationSelect");
        const stationName = dropdown.value;
        const stopPointIds = station_ids[stationName];
        
        if (!stopPointIds){
            alert("Please select a station first")
            return;
        }

        //get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true});
        const currentUrl = tab.url || "";

        // Check if the page is inside a demo-site folder 
        if (!currentUrl.includes("/demo-site/form.html")) {
            alert("Please open the correct demo-site form page before filling.");
            return;
        }
        // Fetch live data for the selected station
        let arrivals = [];
        for (const id of stopPointIds) {
            const res = await fetch(`https://api.tfl.gov.uk/StopPoint/${id}/Arrivals`);
            const data = await res.json();
            arrivals = arrivals.concat(data);
        }

        // Extract platform and line info
        const platforms = new Set();
        const lines = new Set();
        let upcomingCount = 0;

        arrivals.forEach(a => {
            if (a.platformName) {
                const match = /Platform\s*(\d+)/i.exec(a.platformName);
                const platformLabel = match ? `Platform ${match[1]}` : a.platformName.trim();
                platforms.add(platformLabel);
            }
            if (a.lineName) lines.add(a.lineName);
            if (a.timeToStation <= 300) upcomingCount++;
        });
        
        //sort platrforms numerically
        const platformArray = Array.from(platforms).sort((a, b) => {
            const numA = Number.parseInt(a.match(/\d+/));
            const numB = Number.parseInt(b.match(/\d+/));
            return numA - numB;
            });

        const formData = {
            station: stationName,
            platforms: platformArray.join(", "),
            lines: Array.from(lines).join(", "),
            upcoming: upcomingCount
        };

        //inject form data function into the tab
        await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: fillTFLForm,
            args:[formData]
        });

        alert(`Filled form for ${stationName}`)
    }
    catch (err) {
        console.error("Form injection error:", err);
        alert("Could not fill form. Make sure the form page is open.");
    }
});

// This function is injected into the form page
function fillTFLForm(data) {
    const safeSet = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    };

    safeSet("station", data.station);
    safeSet("platforms", data.platforms);
    safeSet("lines", data.lines);
    safeSet("upcoming-trains", data.upcoming);
}
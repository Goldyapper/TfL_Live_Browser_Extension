// Simple JavaScript to demonstrate interaction (optional).
async function loadDepartures()  {
    const stopPointId = '940GZZLUWYP';
    const container = document.getElementById("platforms");
    const refreshTime = document.getElementById("refreshTime");

    container.innerHTML = "<p>Loading live departures…</p>"; //temp mesage whulst its fetching api data

        try{

        const res = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopPointId}/Arrivals`);
        const data = await res.json();
        // data is an array of arrival predictions
        // Sort by time to station 
        data.sort((a, b) => a.timeToStation - b.timeToStation);//soonest trains first
            
        const platforms = {};
        const seen = new Set();

        data.forEach(arr => { //loop thru each arrival
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
                minutes: Math.floor(arr.timeToStation / 60),
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
            refreshTime.textContent = `Updated at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;


            //to render all platforms section in the pop up
            container.innerHTML = sorted.map(([label, trains]) => `
            <div class="platform-depature-board">
                <h3>${label}</h3>
                ${trains.map((t, i) => `
                    <p>
                    <b>${i + 1}.</b> ${t.destination}
                    <span class="line-badge line-${t.line.replace(/\s+/g, '-')}">
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
//run load departure automatically
document.addEventListener("DOMContentLoaded", loadDepartures);
//reload data when clicked
document.getElementById("refreshBtn").addEventListener("click", loadDepartures);
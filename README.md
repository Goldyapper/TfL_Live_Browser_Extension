# TfL Live Departure Board – Browser Extension

A Chromium-compatible browser extension that displays **live TFL departures** from the **TFL (Transport for London) Unified API**.  
It also includes a **demo HTML form** to showcase DOM injection and autofill capabilities using live data.

## Project Structure
```
ZEROKEY_DEVELOPER_EXERCISE/
│
├── extension/
│ ├── extention-style.css
│ ├── manifest.json
│ ├── popup.html
│ ├── popup.js
│ |── README.md 
│ ├── station_ids.js
│ └── tfl-logo.png
│
├── demo-site/ 
│ ├── form.html
│ ├── form.js
│ └── form-style.css
|
├──server/
| ├─ server.js        
| ├── favourites.json
| ├── package.json       
└─ README.md 



└── README.md
```
## API Used

### Transport for London (TfL) Unified API
- Endpoint example:
  `https://api.tfl.gov.uk/StopPoint/{stopPointId}/Arrivals`
- Reason chosen:
    I chose this API to use as I have experience using it for personal project and I am very familiar with how the data is structured. The structure of the pop-up and the way I transform the data is similar to a webpage on a personal website. I also live in London so having a live tube depature board that is easy to use and read wavailable within a single click felt useful to make.

##  How the Data Is Transformed

1. The extension fetches JSON data for a given `StopPoint` (station).  
    Each item includes:
    - platformName
    - lineName
    - destinationName
    - timeToStation
2. Data is grouped by platform and sorted by arrival time.

3. Duplicate arrivals are removed by creating a unique key for each train (destination + line + rounded ETA).

4. The formatted output is displayed in the popup:

    - Each platform gets its own “board” container.
    - Train list per platform is numbered (1st, 2nd, etc.) by order of arrival.
    - Line colors match official TfL branding.

## Extension Features

- Station Dropdown selector for all TfL stations
- Real-time fetching of live train departures
- Displays upcoming trains grouped by platform
- Manual refresh button

## How to Use the Autofill feature (DOM Injection)

1. Open the demo form page (`demo-site/form.html`) locally in Chrome/Edge/Brave.
2. Load the extention (details of this can be seen in the `extension/README.md`)
3. Use the Popup 
    - Click the TfL extention to open the popup.  
    - Choose a station from the dropdown list.  
    - View live departures fetched from the [TfL API](https://api.tfl.gov.uk/).  
    - Click “Fill Form” to inject data into the local demo form page (`/demo-site/form.html`).

## Local Server (Favourites API)

A lightweight **Express.js server** is included to handle saving and retrieving a user’s favourite stations.

### Endpoints

* `GET /api/favourites` - Returns a list of saved stations.
* `POST /api/favourites` - Adds a new favourite station with a timestamp.

### Features

* Automatically creates a `favourites.json` file if missing.
* Prevents duplicate station entries
* Returns success or error messages.
* Automatically includes a timestamp (`savedAt`) for each saved favourite.

### Run Instructions

```bash
cd server
npm install
node server.js
```

Server runs locally at:
**[http://localhost:4000](http://localhost:4000)**
#  TfL Live Train Extension

This Chrome-compatible extension displays **live TfL Underground departures** for any selected London Underground station.  
It also supports **form autofill** into the demo form page for testing.

## How to Load the Extension in Chrome / Edge / Brave

1. Open your browser’s extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
2. Enable Developer Mode
   - Use the toggle in the top-right corner
3. Load Unpacked
   - Click “Load unpacked”
   - Select the `/extension` folder
4. The TfL logo should appear in your toolbar
   - You can now use the Extension

## Using the Extension

1. Click the TfL extention to open the popup.  
2. Choose a station from the dropdown list.  
3. View live departures fetched from the [TfL API](https://api.tfl.gov.uk/).  
4. Click “Fill Form” to inject data into the local demo form page (`/demo-site/form.html`).
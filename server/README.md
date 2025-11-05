# 🗂 TfL Favourites API (Express Server)

This is a simple **Express.js backend** used by the **TfL Live Departure Board browser extension** to save and retrieve a user’s **favourite stations**.

## Features

* **Store favourites** persistently in `favourites.json`
* **Prevent duplicates** (case-insensitive station names)
* **Serve data locally** via a RESTful API
* **CORS enabled** — allows your Chrome extension to send requests


## Folder Structure

```
server/
├── server.js        
├── favourites.json  (auto-created if missing)
├── package.json       
└─ README.md   
```

## Setup Instructions

### 1. Navigate to the server folder

```bash
cd server
```

### 2. Install dependencies (if node_modules folder, package-lock does not exist)

```bash
npm install
```

### 3. Start the server

```bash
node server.js
```

The API will start at:

```
http://localhost:4000
```


## API Endpoints

### `GET /api/favourites`

**Returns:** A list of saved favourite stations.

**Example response:**

```json
[
  { "station": "Wembley Park", "savedAt": "2025-11-03T12:30:00Z" }
]
```

## Data Storage

Favourites are stored in:

```
server/favourites.json
```

If it doesn’t exist, it will be automatically created when the server starts.
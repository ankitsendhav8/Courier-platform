# Backend Engineering Interview Assignment

This project is built with Node.js and uses various dependencies to provide server-side functionalities.

## Prerequisites
- Node.js (v20.x or later recommended)
- npm (v10.x or later recommended)

## Project Setup

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/deepkiraninc/PandoArch-Node.git
   cd Courier-platform
   ```

2. Install the required packages:
   ```bash
   npm install
   ```

## Available Scripts

### Start the Server
To start the project server:
```bash
npm start
```

To start the project server for development:
```bash
npm run dev
```

## Tech Stack

* Node.js
* Express.js
* MySQL
* Joi Validation
* Winston Logging
* Axios

## Features

* Create Shipment
* Track Shipment
* Cancel Shipment
* Bulk Order Processing
* Factory Pattern
* Adapter Pattern
* Repository Pattern
* Validation
* Error Handling
* Retry Mechanism
* Auto Re-authentication
* Request Logging
* Tracking History
* Idempotency

## API Endpoints

POST /api/v1/orders - Create a shipment
 
POST /api/v1/orders/bulk - Create shipment in bulk

GET /api/v1/orders/:orderId/track - Track the shipment

POST /api/v1/orders/:awb_number/cancel -  Cancel the shipment


## Bulk Processing

Bulk orders support up to 100 records per request.

Implementation uses Promise.allSettled() to process orders concurrently while supporting partial success.

## Logging

Logs are stored in:

logs/error.log
logs/combined.log

## Assumptions

* order_id is unique.
* Tracking history is append-only.
* Duplicate orders are rejected.
* Mock courier is provided to demonstrate plug-in architecture.

## Future Improvements

* Queue-based processing using BullMQ.
* Redis caching.
* Additional courier integrations.
* Circuit breaker implementation.

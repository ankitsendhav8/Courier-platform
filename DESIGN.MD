# System Design Document

## Architecture

Client -> Controller -> Service -> Factory -> Adapter -> Courier API

Repository Layer -> MySQL

## Design Patterns

### Factory Pattern

Factory Pattern is used to dynamically resolve the courier implementation based on courier_partner.

Examples:

UrbaneBoltAdapter
MockCourierAdapter

Benefits:

* Easy extensibility
* Open for extension and closed for modification

### Adapter Pattern

Each courier has its own API contract.

Adapters translate the internal normalized request format into courier-specific payloads.

Benefits:

* Unified API
* Courier isolation
* Easier onboarding of new couriers

### Repository Pattern

Database operations are isolated from business logic.

Benefits:

* Cleaner services
* Easier testing
* Better maintainability

## Database Design

### orders

Stores shipment information.

Fields:

* id
* order_id
* courier_partner
* courier_order_id
* awb_number
* status
* courier_request
* courier_response
* created_at
* updated_at

### tracking_history

Stores shipment status history.

Fields:

* id
* order_id
* status
* raw_payload
* created_at

Tracking history is append-only to preserve auditability.

## Bulk Processing Strategy

Implementation uses Promise.allSettled().

Reason:

* Supports concurrent execution.
* Supports partial success.
* Simple implementation for batches up to 100 records.

Trade-off:

The request remains open until all orders finish processing.

For larger workloads, asynchronous queue-based processing would be preferred.

## Retry Strategy

Retries are performed for:

* Network failures
* Timeout errors
* HTTP 5xx responses

Exponential backoff is used.

Retry delays:

1 second
2 seconds
4 seconds

## Error Handling

Standardized error format:

{
"success": false,
"errorCode": "ERROR_CODE",
"message": "Description"
}

Courier-specific errors are normalized before returning to clients.

## Logging

Winston is used for structured logging.

Captured:

* requestId
* orderId
* courierPartner
* errorCode
* stackTrace

## Extensibility

To add a new courier:

1. Create new adapter.
2. Extend BaseCourierAdapter.
3. Register in CourierFactory.

No controller, service, or route changes are required.

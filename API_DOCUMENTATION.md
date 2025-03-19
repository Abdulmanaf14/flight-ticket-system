# API Documentation for Flight Booking System

This repository contains Swagger documentation for the Flight Booking System API.

## Overview

The API documentation provides a comprehensive reference for all endpoints available in the flight booking system, including:
- Booking management (create, retrieve, update, cancel)
- Flight status updates (real-time via SSE)
- Email notifications

## Files

- `swagger.json` - The OpenAPI 3.0 specification file that defines the API
- `swagger-ui.html` - A standalone HTML page that renders the API documentation using Swagger UI

## How to Use

### Option 1: View Documentation Locally

1. Open `swagger-ui.html` in a web browser
   - This will display the Swagger UI interface with all API endpoints
   - The interface allows you to explore the API structure, required parameters, and response schemas

### Option 2: Import into API Tools

You can import the `swagger.json` file into various API tools:

- **Postman**: Import the swagger.json file to create a collection of API requests
- **Swagger Editor**: Use the online editor at https://editor.swagger.io/ and import the swagger.json file
- **API Development Environments**: Import into tools like Insomnia, Paw, etc.

## Authentication

Most API endpoints require authentication using a Bearer token (JWT). Make sure to include the authentication token in the Authorization header when making requests.

## Endpoints

The API is organized into the following main sections:

### Bookings

- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - List all bookings or retrieve a specific booking by reference
- `GET /api/bookings/{id}` - Get a specific booking by ID
- `PATCH /api/bookings/{id}` - Update a booking
- `DELETE /api/bookings/{id}` - Cancel a booking

### Flight Status

- `GET /api/flight-status/sse` - Server-sent events endpoint for real-time flight status updates

### Notifications

- `POST /api/notifications/email` - Send email notifications related to bookings

## Models

The API documentation includes detailed schemas for all request and response models, including:

- Booking requests and responses
- Passenger information
- Flight details
- Email notification requests

## Need Help?

If you have questions about the API or need additional information, please contact the development team. 
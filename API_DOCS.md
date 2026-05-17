# Al Jannat Farmhouse — Bookings API Documentation

## Base URL

```
https://your-vercel-domain.vercel.app
```

---

## Authentication

All requests to the bookings endpoint require an API key sent via the `x-api-key` header.

```
x-api-key: YOUR_BOOKINGS_API_KEY
```

The API key value is the `BOOKINGS_API_KEY` environment variable configured on the server. Contact the Al Jannat dev team to obtain this key.

---

## Endpoints

### GET `/api/bookings`

Retrieves all booking inquiries submitted through the website.

#### Headers

| Header      | Required | Description            |
|-------------|----------|------------------------|
| `x-api-key` | Yes      | Your API key           |

#### Query Parameters

| Parameter | Type   | Default | Description                                |
|-----------|--------|---------|--------------------------------------------|
| `status`  | string | —       | Filter by status: `pending`, `confirmed`, `cancelled` |
| `limit`   | number | 50      | Number of results to return (max 100)      |
| `offset`  | number | 0       | Pagination offset                          |

#### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "full_name": "Ahmed Khan",
      "contact_number": "+923001234567",
      "email": "ahmed@example.com",
      "farmhouse_id": "casa-defazenda",
      "check_in_date": "2026-06-15",
      "check_out_date": "2026-06-17",
      "number_of_guests": 12,
      "special_requests": "Need BBQ setup for the evening",
      "status": "pending",
      "created_at": "2026-05-16T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

> **Note:** The `ip_address` field is never included in API responses for privacy.

#### Error Responses

| Status | Message                        | Meaning                        |
|--------|--------------------------------|--------------------------------|
| 401    | `"Unauthorized."`              | Missing or invalid `x-api-key` |
| 500    | `"Something went wrong."`     | Internal server error          |

---

### POST `/api/booking`

Submits a new booking inquiry from the website form. **This endpoint is used by the website frontend only.**

#### Request Body

```json
{
  "fullName": "Ahmed Khan",
  "contactNumber": "+923001234567",
  "email": "ahmed@example.com",
  "farmhouseId": "casa-defazenda",
  "checkInDate": "2026-06-15",
  "checkOutDate": "2026-06-17",
  "numberOfGuests": 12,
  "specialRequests": "Need BBQ setup"
}
```

#### Rate Limiting

- 5 requests per IP per 15 minutes
- Returns `429` with `Retry-After` header if exceeded

#### Error Responses

| Status | Message                                                        |
|--------|----------------------------------------------------------------|
| 400    | `"Invalid form data. Please check your inputs."`               |
| 429    | `"Too many requests. Please try again later."`                 |
| 500    | `"Something went wrong. Please try again or contact us directly on WhatsApp."` |

---

## Available Farmhouse IDs

| ID                | Name                    |
|-------------------|-------------------------|
| `casa-defazenda`  | Casa De Fazenda         |
| `green-paradise`  | Green Paradise Resort   |
| `hafiz-farmhouse` | Hafiz Farm House        |
| `happyland`       | HappyLand Farm House    |
| `luminious`       | Luminious Farm House    |
| `mustufa`         | Mustufa Farm House      |
| `shughal-mela`    | Shughal Mela Farm House |
| `summerland`      | Summer Land Farm House  |

---

## How to Configure in Your App

1. Store the API key securely (environment variable, not hardcoded)
2. Make GET requests to `/api/bookings` with the `x-api-key` header
3. Use `status`, `limit`, and `offset` query params to filter and paginate
4. All dates are in ISO format (`YYYY-MM-DD`)
5. All timestamps are UTC (`ISO 8601`)

### Example (fetch)

```javascript
const response = await fetch('https://your-domain.vercel.app/api/bookings?status=pending&limit=20', {
  headers: {
    'x-api-key': process.env.BOOKINGS_API_KEY,
  },
});
const data = await response.json();
console.log(data);
```

### Example (cURL)

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  "https://your-domain.vercel.app/api/bookings?status=pending&limit=20"
```

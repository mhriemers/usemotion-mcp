# Get my user

Get information on the owner of this API key.

## Endpoint

```
GET /v1/users/me
```

## Authorization

### X-API-Key

**Type:** string  
**Required:** Yes  
**Location:** Header

Header with the name `X-API-Key` where the value is your API key.

## Query Parameters

None

## Response

**Status:** 200 OK  
**Content-Type:** application/json

### Response Schema

```json
{
  "id": "string",
  "name": "string",
  "email": "string"
}
```

### Response Fields

- **id** (string, required): The user ID.
- **name** (string): The name of the user.
- **email** (string, required): The email of the user.

## Example Request

```bash
curl -X GET https://api.usemotion.com/v1/users/me \
  -H "X-API-Key: YOUR_API_KEY"
```

## Example Response

```json
{
  "id": "user_789",
  "name": "API Key Owner",
  "email": "api.owner@example.com"
}
```
# Get schedules

Get a list of schedules for your user.

## Endpoint

```
GET /v1/schedules
```

## Authorization

### X-API-Key

**Type:** string  
**Required:** Yes  
**In:** Header

Header with the name `X-API-Key` where the value is your API key.

## Response

### 200 - Success

**Content-Type:** application/json  
**Response Type:** array

#### Response Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | The name of the schedule. |
| `isDefaultTimezone` | boolean | Yes | Whether the schedule is the default timezone. |
| `timezone` | string | Yes | The timezone of the schedule. |
| `schedule` | object | Yes | The schedule details. |

#### Schedule Object

The `schedule` object contains fields for each day of the week:

- `monday`
- `tuesday`
- `wednesday`
- `thursday`
- `friday`
- `saturday`
- `sunday`

Each day field is an array of objects with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `start` | string | When the schedule starts, formatted HH:MM. |
| `end` | string | When the schedule ends, formatted HH:MM. |

## Example Response

```json
[
  {
    "name": "Work Schedule",
    "isDefaultTimezone": true,
    "timezone": "America/New_York",
    "schedule": {
      "monday": [
        {
          "start": "09:00",
          "end": "17:00"
        }
      ],
      "tuesday": [
        {
          "start": "09:00",
          "end": "17:00"
        }
      ],
      "wednesday": [
        {
          "start": "09:00",
          "end": "17:00"
        }
      ],
      "thursday": [
        {
          "start": "09:00",
          "end": "17:00"
        }
      ],
      "friday": [
        {
          "start": "09:00",
          "end": "15:00"
        }
      ],
      "saturday": [],
      "sunday": []
    }
  }
]
```

## Notes

- This endpoint returns all schedules associated with the authenticated user
- Each day can have multiple time blocks (e.g., for split schedules with breaks)
- Time values are in 24-hour format (HH:MM)
- Empty arrays indicate no scheduled time for that day
# Getting Started

## 1. Create API Key

Log into Motion and under the Settings tab, create an API key. Be sure to copy the key, as it will only be shown once for security reasons.

## 2. Set Authorization Headers

Pass in your API key as a `X-API-Key` header.

## 3. Test the API

Try sending a GET request to `https://api.usemotion.com/v1/workspaces` with your api key as a header!

### Example Request

```bash
curl -X GET https://api.usemotion.com/v1/workspaces \
  -H "X-API-Key: YOUR_API_KEY"
```
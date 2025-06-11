# Delete Custom Field

Delete a custom field from a workspace.

## Endpoint

```
DELETE /beta/workspaces/{workspaceId}/custom-fields/{id}
```

## Authorization

**Header:** `X-API-Key`  
**Type:** string  
**Required:** Yes

Header with the name `X-API-Key` where the value is your API key.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | Yes | The workspace for which a custom field should be deleted. |
| `id` | string | Yes | The id of the custom field to be deleted. |

## Request Body

No request body required.

## Response

**Status Code:** 204 (No Content)

The custom field has been successfully deleted from the workspace. No response body is returned.

## Example Request

```
DELETE /beta/workspaces/ws_123456/custom-fields/cf_789012
X-API-Key: your-api-key-here
```

## Notes

- Deleting a custom field will remove it from the workspace entirely
- This action cannot be undone
- All values associated with this custom field across tasks and projects will also be removed
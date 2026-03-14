# API Documentation for stories-db

## Overview
This document outlines how to consume the stories-db API, detailing available endpoints, example requests, and response formats.

## Base URL
The base URL for accessing the API is:
```
https://api.stories-db.example.com/v1
```

## Endpoints
### 1. Get All Stories
- **Endpoint:** `/stories`
- **Method:** `GET`
- **Description:** Retrieves a list of all stories.

#### Example Request:
```http
GET /stories HTTP/1.1
Host: api.stories-db.example.com
```

#### Example Response:
```json
{
  "stories": [
    {
      "id": 1,
      "title": "Story Title 1",
      "content": "Story content here"
    },
    {
      "id": 2,
      "title": "Story Title 2",
      "content": "Story content here"
    }
  ]
}
```

### 2. Get Story by ID
- **Endpoint:** `/stories/{id}`
- **Method:** `GET`
- **Description:** Retrieves a single story by its ID.

#### Example Request:
```http
GET /stories/1 HTTP/1.1
Host: api.stories-db.example.com
```

#### Example Response:
```json
{
  "story": {
    "id": 1,
    "title": "Story Title 1",
    "content": "Story content here"
  }
}
```

### 3. Create a New Story
- **Endpoint:** `/stories`
- **Method:** `POST`
- **Description:** Creates a new story.

#### Example Request:
```http
POST /stories HTTP/1.1
Host: api.stories-db.example.com
Content-Type: application/json

{
  "title": "New Story",
  "content": "This is a new story."
}
```

#### Example Response:
```json
{
  "message": "Story created successfully",
  "story": {
    "id": 3,
    "title": "New Story",
    "content": "This is a new story."
  }
}
```

### 4. Update a Story
- **Endpoint:** `/stories/{id}`
- **Method:** `PUT`
- **Description:** Updates an existing story by its ID.

#### Example Request:
```http
PUT /stories/1 HTTP/1.1
Host: api.stories-db.example.com
Content-Type: application/json

{
  "title": "Updated Story Title",
  "content": "Updated story content."
}
```

#### Example Response:
```json
{
  "message": "Story updated successfully",
  "story": {
    "id": 1,
    "title": "Updated Story Title",
    "content": "Updated story content."
  }
}
```

### 5. Delete a Story
- **Endpoint:** `/stories/{id}`
- **Method:** `DELETE`
- **Description:** Deletes a story by its ID.

#### Example Request:
```http
DELETE /stories/1 HTTP/1.1
Host: api.stories-db.example.com
```

#### Example Response:
```json
{
  "message": "Story deleted successfully"
}
```

## Conclusion
This API provides a simple interface to manage stories in the stories-db. Use the examples provided to guide your requests and handle the responses appropriately.
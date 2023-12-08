# @alexvoedi/minesweeper-api

## Endpoints

```txt
POST /games/<game-id>/cells/ HTTP/1.1
Content-Type: application/json
Host: localhost:3000
Content-Length: 44

{
  "action": "OPEN",
  "x": 2,
  "y": 4
}
```

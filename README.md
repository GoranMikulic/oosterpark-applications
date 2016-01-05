# OOSTERPARK ANALYSIS

## Project structure
```
|-- _modules ---------- Backend code
|   |--_controllers --- Controller modules implementing application logic & handling data between db and requests
|   |--_db ------------ DB modules for data access
|   |--_kismetsocket -- Handling socket connection to kismet
|   |--_utils --------- Global util modules
|   |--_routes.js ----- Defining routes for handling API requests
|
|-- _public ----------- Fronted code
|   |--_angular ------- angular.js code and modules
|   |--_css ----------- Style definitions
|   |--_third-party --- Third-party frontend modules
|
|-- _node_modules ----- Third-party node.js (backend) modules, defined in package.json
|-- _Gruntfile.js ----- Grunt script for including angular files automatically
|-- _package.json ----- Defines third-party dependencies for node.js
|-- _server.js -------- Server configuration and startup script

```

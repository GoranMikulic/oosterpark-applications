OOSTERPARK ANALYSIS

Project structure
|-- _modules ---------- Backend code
|   |--_controllers --- Controller modules implementing application logic & handling data between db and requests
|   |--_db ------------ DB modules for data access
|   |--_kismetsocket -- Handling socket connection to kismet
|   |--_utils --------- Global util modules
|   |--_routes.js ----- Defining routes for handling API requests
|
|-- _node_modules ----- Third-party node.js (backend) modules, defined in package.json
|-- _public ----------- Fronted code
|   |--_css ----------- Style definitions
|   |--_js ------------ AngularJs code
|   |--_third-party --- Third-party frontend modules
|
|-- _package.json ----- Defines third-party dependencies for node.js
|-- _server.js -------- Server configuration and startup script

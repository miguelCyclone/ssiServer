# SSI server
* Create a softer user experience for new blockchain users
* It is uploaded to GitHub for showcase and educational purposes.
* It is not intended to be use under commercial activities, please read the license file.

# License
* Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

# Blockchain
* It ineracts with Ethereum. For faster development of it was used with Truffle and Ganache

# Architecture
* Modular nested files
* The functions are nested into core funtionalities to obtain a better error management
* Separated Abstraction level into the files

# Trajectory of a request
* server.js -> routes.js -> did.routes.js -> did.controller.js -> didLib.aux.js -> didLib -> Blockchain
# copixel

## Installation

Install client dependencies
`cd client && npm i`

Install server dependencies
`cd server && npm i`

## Getting started

Start the server
`cd server && npm start`

Start the worker (for screenshots and adding particpants to drawings)
`cd server && npm run worker`

Start the client
`cd client && npm start`

## TODO:
- Fix header button hovers (hover extends past header height)
- Add fetchMore to drawings feed 
- Add functionality to check if username is already taken on /signup
- Change /callback to /login-sucess or something like that
- Change section backgrounds for available, locked, complete, neighbor backgrounds
- Add prompt to add pixels to neighbor edges if no data found in those rows/columns
- Add way to report innapropriate drawings or add ratings
- Add marketing type stuff to home page
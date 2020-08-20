# EliteTask Task Management
Web application that allows managers to set and allocate tasks for members to complete

### Set up
1. Download and install Node.js and NPM
2. Download and install MySQL and start the MySQL service.
3. Clone this repository
4. In the terminal, navigate to the root folder of the project
5. To seed the database: 
- Run `mysql`
- Create the database to import data into with `create database elitetask;`
- Run `exit` to return to the terminal
- Run the command `mysql elitetask < elitetask_db.sql`
6. Run `npm install` to install dependencies

### Running the web app
1. In the root folder of the project, run `npm start` to start the server locally 
2. In your broswer, navigate to localhost:3000
3. A number of admins and member logins have been provided in Logins.txt, use one of those to login or create a new account

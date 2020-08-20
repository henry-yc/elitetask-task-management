# EliteTask Task Management
Web application that allows managers to set and allocate tasks for members to complete

### Set up
1. Download and install Node.js and NPM
2. Download and install MySQL and start the MySQL service
3. Clone this repository
4. In the terminal, navigate to the root folder of the project
5. To seed the database: 
   - Run `mysql`
   - Create the database to import data into with `create database elitetask;`
   - Run `exit` to return to the terminal
   - Run the command `mysql elitetask < elitetask_db.sql` if under root user or `mysql -u [user] -p elitetask < elitetask.sql` to specify user
6. Open the `app.js` file in a text editor, and on lines 27 and 28, enter the username and password from your MySQL database replacing 'root' with the username if not root user, and 'pass' with the password
```
	user: 'root',
	password: 'pass',
```
7. Run `npm install` to install dependencies

### Running the web app
1. In the root folder of the project, run `npm start` to start the server locally 
2. In your broswer, navigate to localhost:3000
3. A number of admins and member logins have been provided in Logins.txt, use one of those to login or create a new account

### If web application cannot connect to database
If server returns 500 code and node throws error "Client does not support authentication protocol requested by server", then terminate the server with ctrl + c and then run `mysql`.

Execute the following query:
`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'`
with 'root' as your user (can leave as 'root' if root user), 'localhost' as your URL (can leave as 'localhost' if running locally) and 'password' as your password

Then run this query to refresh privileges:
`flush privileges;`

Try starting the web application again after you do so.

If that doesn't work, try running the query in MySQL again without the @'localhost' part.

# Ecommerce-API-endpoints

# Application Installation and Usage Instructions

1. Clone the repository: <br>
`git clone <repository_url>`

2. Navigate to the project directory: <br>
`cd <project-directory>`

3. Install dependencies:<br>
`npm install`

4. Set up the MySQL database. Make sure you have MySQL installed on your system.<br>
    -create database<br>
    -create username and password<br>

5. Generate a secret token by typing "node" in the terminal and then the following command:<br>
`require('crypto').randomBytes(64).toString('hex')`

6. Create a .env file in the root directory and add your MySQL database credentials and secret token generated.

7. Start the server: <br>
`npm start`

8. Generate initial data by navigating to `/init` and clicking the generate button.

# Environment Variables
## dotenv
To run this project, you will need to add the following environment variables to your .env file:
```
    HOST = <"host">
    ADMIN_USERNAME = <"admin_username">
    ADMIN_PASSWORD = <"password">
    DATABASE_NAME = <"database_name">
    DIALECT = <"dialect">
    PORT = <"port">
    TOKEN_SECRET=<'secret_token'>
    URL = <"url">
```
# References
- I would like to acknowledge djvstock from Vecteezy.com for the profile avatar I used on my project.
- The use of Postman for testing my API routes.
- I would also like to acknowledge the use of ChatGPT in the project. The design and process of the project were my own work, but ChatGPT provided valuable help in troubleshooting and resolving issues.

# NodeJS Version Used
v18.17.0

# Dependencies
- **axios**: ^1.7.2
- **body-parser**: ^1.20.2
- **cookie-parser**: ~1.4.4
- **crypto**: ^1.0.1
- **debug**: ~2.6.9
- **dotenv**: ^16.4.5
- **ejs**: ^3.1.10
- **email-validator**: ^2.0.4
- **express**: ^4.19.2
- **fs**: ^0.0.1-security
- **http-errors**: ~1.6.3
- **jest**: ^29.7.0
- **jsend**: ^1.1.0
- **jsonwebtoken**: ^9.0.2
- **morgan**: ~1.9.1
- **mysql**: ^2.18.1
- **mysql2**: ^3.9.7
- **path**: ^0.12.7
- **random-string-gen**: ^1.1.4
- **sequelize**: ^6.37.3
- **supertest**: ^7.0.0
- **swagger-autogen**: ^2.23.7
- **swagger-ui-express**: ^5.0.1

# Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.


# SWAGGER Documentation link
The complete documentation for my API endpoints are accessible from the /doc endpoint.<br>
    - example http://localhost:3000/doc<br>



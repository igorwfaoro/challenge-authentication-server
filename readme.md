# Challenge Authentication Server
[Challenge Link](https://github.com/Ballerini-Server/node-authentication-challenge)

## Description
A simple authentication server that uses JWT to authenticate users. You can access the demo server [here](https://iwf-challenge-auth-serve.herokuapp.com).

## How to run

Create Users table in your MySql database:
```sql
CREATE TABLE `Users` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Name` varchar(200) NOT NULL,
  `Email` varchar(200) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `ResetPasswordToken` varchar(500) DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_Users_Email` (`Email`)
) DEFAULT CHARSET=utf8;
```
Replace ```.env.example``` with ```.env``` in the root of the project and define your database connection in ```.env``` file:
```env
DB_HOST=<host>
DB_SCHEMA=<schema>
DB_USER=<user>
DB_PASSWORD=<password>
```

If you want use MessagingService (to send emails) you need set the following variables in ```.env``` file:
```env
EMAIL_SERVICE=<email_service>
EMAIL_USER=<email_user>
EMAIL_PASSWORD=<email_password>
```

Install dependencies with ```npm install```.

Run the development server with ```npm run dev:watch```. It will start the server and watch for changes in the files to restart the server.
![swapi](https://github.com/setoi1/SwiftAPI/assets/56894020/9fab5929-d2b3-4062-8ae0-9545715f23a6)
# SwiftAPI

Summer 2022 Capstone Project

![landing-page](https://github.com/setoi1/SwiftAPI/assets/56894020/805ae43e-2e81-42d0-ad87-fe88be358873)

## Introduction

SwiftAPI is an innovative platform that aims to simplify the searching, purchasing, and monetization of public REST APIs in just a few clicks!

## Main Features
* 3-click API monetization setup
* Search, browse, and purchase thousands of publicly shared APIs
* View API analytics, monitoring, and loggin in a easy-to-use dashboard
* Save and bookmark your favorite APIs


## Requirements

	All Users
	1. Allow users to manage and access their account
 
	Customer
	2. Allow users to search for and filter through public APIs
	3. Allow users to purchase access to an API
 
	Developer
	4. Allow users to enable their API through a middleware service
	5. Allow users to list their APIs on the marketplace with pricing details
	6. Allow users to manage their listed APIs
	7. Allow users to view metrics and other insights on the usage of their APIs
 
	Admin
	8. Allow admin users to observe admin-level metrics through Datadog dashboard

## Installation and Setup

1. Install Node.js LTS (https://nodejs.org/en/)

2. Clone the repository.

   ```
   git clone https://github.com/setoi1/SwiftAPI.git
   cd SwiftAPI
   ```
   
3. Create an .env file in the root directory and add the following lines.
   
   ```
   SECRET_KEY=
   SECRET_CRYPTO_KEY=
   APP_SECRET=
   MONGO_DB_URL=<mongo_url>
   STRIPE_TEST_KEY=<stripe_url>
   ```

## Run

4. From within the directory, start the React frontend and Node.js / Express backend server in two seperate shells.

   Shell 1
   ```
   cd frontend
   npm install
   npm start
   ```

   Shell 2
   ```
   cd backend
   npm install
   npm start
   ```

6. Open a browser window and navigate to: http://localhost:3000.

## Demo video

https://youtu.be/dmgTZil95nc

## Contributors

* Ian Seto
* Owen Moreau
* Andrew Galvin
* Parker Dowdy

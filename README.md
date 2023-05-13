# SwiftAPI
SwiftAPI Project for Summer 2022 Software Engineering Course

https://swift-api-senior-project.herokuapp.com/

## Introduction

SwiftAPI is a platform for developers to monetize their APIs in just a few clicks. Add a more descriptive introduction in the future!

## Features

	All Users
	1.	Allow users to manage and access their account (Ian)
	Customer
	2.	Allow users to search for and filter through public APIs (Ian)
	3.	Allow users to purchase access to an API (Andrew)
	Developer
	4.	Allow users to enable their API through a middleware service (Parker)
	5.	Allow users to list their APIs on the marketplace with pricing details (Andrew)
	6.	Allow users to manage their listed APIs (Parker)
	7.	Allow users to view metrics and other insights on the usage of their APIs (Owen)
	Admin
	8.	Allow admin users to observe admin-level metrics through Datadog dashboard (Owen)



## Getting Started

### Installation and Setup

1. Install [Node.js](https://nodejs.org/).
2. Clone this repository and install its dependencies.
		
		> git clone git@github.com:andrewgalvin/SwiftAPI.git
		> cd SwiftAPI
		> yarn install

3. Create a .env file in the root directory, and add the following line.

    > SECRET_KEY=<key>
    > SECRET_CRYPTO_KEY=<key>
    > APP_SECRET=<secret>
    > MONGO_DB_URL=<mongo_url>
    > STRIPE_TEST_KEY=<stripe_url>

4. Setup Prometheus for metrics aggregation and collection.

    > Download Prometheus from the valid download binary [Here](https://prometheus.io/download/)
    > Follow setup instructions there (Ask Owen for help if needed)
    > TODO - add more steps here

		
### Run

1. From within the directory start the server and frontend in seperate shells.

		> yarn start
		> cd frontend && yarn start
		
2. Open a browser window and navigate to: [http://localhost:3000](http://localhost:3000).

## Demo video

https://youtu.be/dmgTZil95nc

## Contributors

* Owen Moreau
* Andrew Galvin
* Parker Dowdy
* Ian Seto

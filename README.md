# simplify-url
## Simplify-url is a application to shorten the URL using NodeJs, Express and MongoDB

### Prerequisites
Install the following software to run the project locally or on docker container
* [Node.js version 12.x/version 14.x](https://nodejs.org/en/download/)
* [MongoDB version 4.4.x](https://www.mongodb.com/download-center/community/releases)
* [Docker](https://www.docker.com/products)
* [docker-compose](https://docs.docker.com/compose/install/)

> **NOTE:** Use the links to setup each software

### Project setup
* Clone the project code from GitHub
* Goto project directory in CLI
    #### Local install
    * Run `# npm install`
    * Start the node server `# npm start`
    #### Docker install
    * Run `# docker-compose up`

* Goto [http://localhost:4100](http://localhost:4100)

### Project Testing
* Run `npm test` locally

> **Note:** Tests are not supported by Docker.

### Project GUI
* **Simplify URL/ Shorten**

    URL - Insert valid URL in textbox and submit.
    It returns the simplified URL as a link.

    Example:
    URL- https://github.com 

    Simplified URL - http://localhost:4100/thwvXHS

* **Search the existing URL**

    Enter Long/Short URL or keywords. 
    It returns matching URL 

* **View the list of existing URL**

    Click on the View Button on left navigation bar.
    It returns the List of URLs from database

* **Delete URL**

    Click on the delete button in the View page.




### Useful docker commands to manage the project
|DOCKER COMMAND|DESCRIPTION|
|-|-|
|docker-composer up -d|Run the docker-compose to create the project containers in debug mode.|
|docker-compose up --build -d|Build a new image and create the containers. Require if code changes are made.|
|docker-compose down -v|Delete the conatiners and the persistent volumes.|










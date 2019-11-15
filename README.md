# The Descendants Project

Our team is collaborating with Professor Hinson from the UNC Anthropology Department to provide him with the tools for his students to build a customizable and visual family tree of NC lynching victims and their descendants.

# Getting Started
## Prerequisites
1. Run 'pip install -r requirements.txt' to install necessary dependencies 
2. To install JavaScript dependency for tree visualization, run 'npm install d3-dtree -g npm-install-peers'
## Installation
1. User must instantiate a new environment by running “conda activate [vm name]” -- any new dependencies that are installed must be added to the requirements.txt file by running the following command after installation :'pip freeze > requirements.txt'
2. To start client-side, in the \client directory: 'npm install' followed by 'npm start'
3. To start server-side: 'python app.py'
4. To run locally: the local server is hosted on 'localhost:5000'
These instructions were last tested and verified by Joseph, on a PC on 11/13/19.

# Testing
In order to run tests on the client, the user can use Jest, which is automatically included within the creat-react-app package. Running the command 'npm test will' run all test suites including ours and any the user has created with a name of the form *.test.js.

If a developer creates new tests for the client according to the organization system linked in part 6, they will be able to run unit tests with “jest unit” and integration tests with “jest int.”

# Deployment

Production system lives in Heroku, and a new developer would need to be added by project contributors on the Heroku site. As of now, no staging or pre-production environments are needed - changes are developed locally and should be tested before being merged into master and deployed.

Our app uses the Neo4J addon in Heroku to implement a graph database

Neither continuous integration or continuous deployment is enabled. The test suite is not comprehensive and robust enough that we would allow changes to be automatically merged and deployed.

# Technologies Used 

Neo4j, Flask, React Heroku - ADRs are located in the ADR.md file in the root directory 

# Contributing 

A new developer would need access to the GitHub repo, our Trello board, be added to our Heroku account, and be in touch with client Glenn Hinson before they are able to contribute.

We suggest using Git Flow to guide development. Additionally, if a new developer is creating integration or unit tests, we would recommend the system described here to keep it organized: https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850

For more background information, see: https://www.cs.unc.edu/~joeson34/

# Authors 

Joseph Son, Anna Hattle, Jade Wu

# License

MIT License

# Acknowledgments

We’d like to thank our mentor, Jacob Yackenovich, for his technical guidance and support and our project lead, Glenn Hinson, for giving us the opportunity to work on such an impactful project. 


<h2> Build </h2>
<p>Before push to master, <br>
<code>npm run build</code> in /client <br>
*app.py serves the "built" ReactJS</p>

<h2> Test </h2>
<p>client: <br>
<code> npm install </code> <br>
<code> npm start</code> in /client <br>
server: <br>
<code> pip install -r requirements.txt </code><br>
<code>python app.py</code> </p>

In package.json, we set the proxy of HTTP requests from React client to localhost:5000. This is the url of our local Python Flask dev server.

<h2> Python dependencies </h2>
<code>
conda env list  
conda activate [vm name]  
pip install [dependancy name]  
pip freeze > requirements.txt  
</code>

<h2> Javascript dependencies </h2>
<code> npm install d3-dtree -g npm-install-peers </code>

neo4j-driver is deprecated. <br>
<code> pip install </code> instead <br>

<h2> Neo4j </h2>
Clear database: <code> MATCH (n) DETACH DELETE n </code>

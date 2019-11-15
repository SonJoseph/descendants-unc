# Database: GrapheneDB/Neo4j
1. Summary - In order to store data about family trees, we decided to use Neo4j as our database management system. 
2. Problem - When considering how to store our client’s data, it was important to take into account what kind of schema would best fit the data. Since the nature of our data is relational, ie, people are connected to their family members via relationships, we thought a graph database would be the most intuitive and efficient choice. 
3. Constraints - The client isn’t willing to pay for a solution, so we only considered options that were free. With that in mind, we chose GrapheneDB, which is a free add-on on Heroku and deploys Neo4j graph databases. 
4. Options - 

⋅⋅⋅MongoDB 
⋅⋅⋅Neo4j - suited for our project because it is well integrated with Heroku and is well-suited for our back-end choice of Python flask through the library py2neo. 
Rationale - We chose Neo4j because it’s free and suits our data. 

# Back-end: Python Flask
1. Summary - In order to have a backend to serve our application, we decided to use Python Flask as our application framework.
2. Problem - We need server-side code which enables communication between our client-side code and database and serves the frontend to the user.
Constraints - We want the solution to be lightweight and simple as we mainly need a framework to build APIs. 
3. Options 

⋅⋅⋅ExpressJS
⋅⋅⋅Pros: lightweight, JavaScript is same language as ReactJS, easy dependency management
⋅⋅⋅Cons: team less interested in JavaScript
⋅⋅⋅Python Flask
⋅⋅⋅Pros: lightweight, team interest in learning Python, compatible with ReactJS,  easy dependency management
⋅⋅⋅Cons: none
⋅⋅⋅Java Spring Boot
⋅⋅⋅Pros: robust
⋅⋅⋅Cons: overcomplicated, Maven or Gradle can be frustrating
Rationale - We chose Python Flask as it aligned with our application needs and appealed to our learning goals.

# Build tool: Heroku
1. Summary - In order to have a backend to serve our application, we decided to use Python 2. Flask as our application framework.
3. Problem - We need a server to run our application and host our database.
Constraints - We want the solution to be free and easy to maneuver. 
4. Options 

⋅⋅⋅Heroku
⋅⋅⋅Pros: Free plan, offers graph database
⋅⋅⋅Cons: Restricted data usage (512 MB RAM)
⋅⋅⋅AWS
⋅⋅⋅Pros: Popular and extensive list of services available
⋅⋅⋅Cons: Expensive
⋅⋅⋅UNC CloudApps
⋅⋅⋅Pros: Free, no restricted usage
⋅⋅⋅Cons: No graph database
⋅⋅⋅Rationale - We chose Heroku as it is free and offers a graph database. As our current client base is relatively small, we do not anticipate the data restriction to be problematic. If our required data storage surpasses that provided by Heroku's free plan then we can consider the paid option. However, that should still be cheaper than AWS.

# Frontend: ReactJS 
1. Summary - In order to build our front-end, we decided to use React as our framework and specifically d3.js library to build the tree visualizer. 
Problem - We need a user interface for our clients to be able to visualize and build their family tree.  
2. Constraints - Family tree has to be scalable, ie, at different zoom levels the integrity of the image can not be lost 
Must be possible to interact with and edit the tree in an easy way, ie, click on nodes, drag nodes
3. Options - 

⋅⋅⋅React
⋅⋅⋅Team is interested in becoming more familiar with react framework
⋅⋅⋅(pro) Industry standard, go-to
⋅⋅⋅(pro) interacts with a virtual DOM, which leads to faster performance 
⋅⋅⋅(pro) well-suited for lightweight applications 
⋅⋅⋅(con) slightly high learning curve
⋅⋅⋅Vue
⋅⋅⋅(pro) interacts with a virtual DOM, which leads to faster performance 
⋅⋅⋅(pro) well-suited for lightweight applications 
⋅⋅⋅(pro) easier learning curve 
⋅⋅⋅Angular 
⋅⋅⋅(con) slow performance due to interaction with the actual DOM (as opposed to virtual DOM) 
⋅⋅⋅More suited for heavyweight applications 
⋅⋅⋅Rationale - We chose to use React, since it’s a framework our team is already familiar with and offers many of the benefits of the other frameworks. 

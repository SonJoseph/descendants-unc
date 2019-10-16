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

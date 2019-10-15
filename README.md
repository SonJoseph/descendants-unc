<h2> Build </h2>
<p>Before push to master, <br>
<code>npm run build</code> in /client <br>
*app.py serves the "built" ReactJS</p>

<h2> Test </h2>
<p>client: <code>npm start</code> in /client <br>
server: python app.py</p>

In package.json, we set the proxy of HTTP requests from React client to localhost:5000. This is the url of our local Python Flask dev server.

<h2> Python dependencies </h2>
<code>
conda env list  
conda activate [vm name]  
pip install [dependancy name]  
pip freeze > requirements.txt  
</code>

neo4j-driver is deprecated. <br>
<code> pip install </code> instead <br>

<h2> Neo4j </h2>
Clear database: <code> MATCH (n) DETACH DELETE n </code>

<h2> Build </h2>
<p>Before push to master, <br>
<code>npm run build</code> in /client <br>
*app.py serves the "built" ReactJS</p>

<h2> Test </h2>
<p>client: <code>npm start</code> in /client <br>
server: python app.py</p>

<h2> Python dependencies </h2>
<code>
conda env list
conda activate [vm name]
pip install [dependancy name]
pip freeze > requirements.txt
</code>

neo4j-driver is deprecated. <code> pip install </code> instead
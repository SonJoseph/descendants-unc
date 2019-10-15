import os
from flask import Flask, send_from_directory
from neo4j import GraphDatabase, basic_auth
from flask import jsonify

app = Flask(__name__, static_folder='client/build')

def connect(): # connect to neo4j instance 
    graphenedb_url = "bolt://hobby-ghjkfkgldghkgbkegepiladl.dbs.graphenedb.com:24787" # os.environ.get("GRAPHENEDB_BOLT_URL")
    graphenedb_user = "app149651838-8ERHph" # os.environ.get("GRAPHENEDB_BOLT_USER")
    graphenedb_pass = "b.qFtgBSt5iSFJ.KN7p9aZXizU8YlL3" # os.environ.get("GRAPHENEDB_BOLT_PASSWORD")
    driver = GraphDatabase.driver(graphenedb_url, auth=basic_auth(graphenedb_user, graphenedb_pass))
    return driver

# Serve React App
@app.route('/', defaults={'path': ''}) 
@app.route('/<path:path>') 
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/createnode')
def createNode():
    # result = {''}
    driver = connect()
    with driver.session() as session:
        session.run("CREATE (n:Person { name: 'Andy', title: 'Developer' })")


@app.route('/api/getnodes')
def getNodes():
    names = {'names' : []}
    driver = connect()
    with driver.session() as session:
        result = session.run("MATCH (n:Person) RETURN n.name AS name")
        for record in result: # result is type BoltStatementResult
            names['names'].append(record["name"])
    return names
    

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000)

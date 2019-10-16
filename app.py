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

@app.route('/api/createnode/<name>')
def createNode(name):
    inserted = ''
    driver = connect()
    with driver.session() as session:
        result = session.run("CREATE (n:Person { name: '"+name+"' }) RETURN n.name AS name")
        for record in result:
            inserted = record["name"]
    return jsonify(inserted)

@app.route('/api/gettrees')
def getTrees():
    names = {'tree_roots' : []}
    driver = connect()
    with driver.session() as session:
        result = session.run("MATCH(n:Person) WHERE EXISTS(n.root) RETURN DISTINCT n.name as name")
        for record in result: 
            names['tree_roots'].append(record['name'])
    return jsonify(names)

'''
[{
  name: "Father",                         // The name of the node
  class: "node",                          // The CSS class of the node
  textClass: "nodeText",                  // The CSS class of the text in the node
  depthOffset: 1,                         // Generational height offset
  marriages: [{                           // Marriages is a list of nodes
    spouse: {                             // Each marriage has one spouse
      name: "Mother",
    },
    children: [{                          // List of children nodes
      name: "Child",
    }]
  }],
  extra: {}                               // Custom data passed to renderers
}]

'''

visited = set() # set

@app.route('/api/gettree/<tree>')
def getTree(tree):
    members = []
    driver = connect()
    with driver.session() as session:
        members.append(addMember(session, tree, 1))
    return jsonify(members)

def addMember(session, tree, depth): # DFS ... 'tree' is the name of the root
    global visited

    if(tree in visited):
        return 

    member = {
        'name' : tree, # root
        'class' : '',
        'textClass' : '',
        'depthOffset' : depth,
        'marriages' : [{
            'spouse': '',
            'children' : []
        }],
        'extra' : {}
    }

    visited.add(tree)

    children = session.run("MATCH (Person { name: '"+ tree +"' })-[:parent]->(person) RETURN person.name as name") # array of the obj{name : ''}

    for child in children:
        member['marriages'][0]['children'].append(
            addMember(session, child['name'], depth+1)
        )
    spouses = session.run("MATCH (Person { name: '"+ tree +"' })-[:spouse]-(person) RETURN person.name as name") # array of obj{name : ''}

    for spouse in spouses:
        member['marriages'][0]['spouse'] = addMember(session, spouse['name'], depth)

    return member

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000)

'''
CREATE (al:Person { name: "Alex", birth: "05301998", depth: 0, root: 1}),
(jo:Person { name: "Josh", birth: "09331998", depth: 1}),
(sa:Person { name: "sam", birth: "09300998", depth: 0}),
(al)-[:parent]->(jo)
(al)-[:spouse]->(sa)

CREATE (jo:Person { name: "Joseph", birth: "09011998", root: 1}),
(an:Person { name: "Anna", birth: "072298"}),
(jn:Person { name: "Jane", birth: "123098"}),
(jo)-[:BROTHER]->(an),
(jn)-[:MOTHER]->(an)

Get nodes of a certain family: MATCH (Person { name: 'Joseph' })-[*]-(person) RETURN person.name

Get all the family roots: MATCH(n:Person) WHERE EXISTS(n.root) RETURN DISTINCT n.name
'''

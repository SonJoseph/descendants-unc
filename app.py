import os
import uuid
from flask import Flask, send_from_directory
from neo4j import GraphDatabase, basic_auth
from flask import jsonify

app = Flask(__name__, static_folder='client/build')
driver = {}

def connect(): # this is called when the app is created
    global driver
    graphenedb_url = "bolt://hobby-ghjkfkgldghkgbkegepiladl.dbs.graphenedb.com:24787" # os.environ.get("GRAPHENEDB_BOLT_URL")
    # 64-bit encoded stored in .properties file
    graphenedb_user = "app149651838-8ERHph" # os.environ.get("GRAPHENEDB_BOLT_USER")
    graphenedb_pass = "b.qFtgBSt5iSFJ.KN7p9aZXizU8YlL3" # os.environ.get("GRAPHENEDB_BOLT_PASSWORD")
    driver = GraphDatabase.driver(graphenedb_url, auth=basic_auth(graphenedb_user, graphenedb_pass))

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/createroot/name=<name>&birth=<birth>')
def createTree(name, birth):
    global driver
    with driver.session() as session:
        createRoot = session.run("CREATE (n: Person { name: '"+name+"', birth: '"+birth+"', depth: 0, root: 1}) RETURN n.name AS name")
        return jsonify("dummy")


@app.route('/api/createnode/name=<name>&relnWith=<relnWith>&relnId=<relnId>&relnType=<relnType>')
def createNode(name, relnWith, relnId, relnType):
    global driver
    uid = uuid.uuid4().urn
    id = uid[9:]
    with driver.session() as session:
        createPerson = session.run("CREATE (n:Person { name: '"+name+"' , id: '"+id+"'}) RETURN n.name AS name, n.id as id")
        print("MATCH (a:Person),(b:Person) WHERE a.name = " + name + " AND b.name = " + relnWith +
        " CREATE (a)-[r:"+relnType+"]->(b) RETURN type(r)")
        createReln = session.run("MATCH (a:Person),(b:Person) WHERE a.name = '" + name + "' AND a.id = '" + id +
        "' AND b.name = '" + relnWith + "' AND b.id = '" + relnId +
        "' CREATE (b)-[r:"+relnType+"]->(a) RETURN type(r)")
        # for record in result:
        #     inserted = record["name"]
    return jsonify("dummy")

@app.route('/api/getnode/name=<name>')
def getNode(name): # MATCH (n:Person { name: 'Alex' }) RETURN n
    global driver
    clientObj = {}
    with driver.session() as session:
        result = session.run('MATCH (n:Person { name: "' + name + '" }) RETURN n')
        # How do we return all the properties as a json object?
        for record in result:
            properties = record['n'].items()
            for key, val in properties:
                clientObj[key] = val
    return jsonify(clientObj)

@app.route('/api/gettrees')
def getTrees():
    global driver
    names = {'tree_roots' : []}
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
    global driver
    global visited
    members = []
    visited = set() # clear this for every new request
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
            'spouse': {},
            'children' : []
        }],
        'extra' : {}
    }

    visited.add(tree)

    children = session.run("MATCH (Person { name: '"+ tree +"' })-[:parent]->(person) RETURN person.name as name") # array of the obj{name : ''}

    c_json = None
    for child in children:
        c_json = addMember(session, child['name'], depth+1)
        if c_json != None:
            member['marriages'][0]['children'].append(
                c_json #addMember(session, child['name'], depth+1)
            )
    spouses = session.run("MATCH (Person { name: '"+ tree +"' })-[:spouse]-(person) RETURN person.name as name") # array of obj{name : ''}

    sp_json = None
    for spouse in spouses:
        sp_json = addMember(session, spouse['name'], depth)
        if sp_json != None:
            member['marriages'][0]['spouse'] = sp_json

    if c_json == None and sp_json == None:
        del member['marriages'] # this may raise a KeyError if marriages does not exist

    return member

if __name__ == '__main__':
    connect()
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

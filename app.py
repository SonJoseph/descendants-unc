import os
import uuid
from flask import Flask, send_from_directory
from neo4j import GraphDatabase, basic_auth
from flask import jsonify
import json
#from credentials import url, user, password
from flask_socketio import SocketIO, emit

app = Flask(__name__, static_folder='client/build')
socketio = SocketIO(app, cors_allowed_origins="*")
driver = GraphDatabase.driver(os.environ.get("GRAPHENEDB_BOLT_URL"), auth=basic_auth(os.environ.get("GRAPHENEDB_BOLT_USER"), os.environ.get("GRAPHENEDB_BOLT_PASSWORD")))

@socketio.on('FetchTree')
def fetchTree(json):
    print(json['session'])
    emit('RefreshTree', {'tree_id': json['tree_id'], 'session': json['session']}, broadcast=True, include_self=False)
    # Tell all users besides the sender to re-fetch the tree with id

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/updatenode/person=<person>')
def updateNode(person):
    global driver
    with driver.session() as session:
        person = json.loads(person)
        fields = ""
        for prop in person.items():
            print(prop)
            if prop[0] == "id":
                p_id = prop[1]
            elif type(prop[1]) is int:
                fields += "n.{} = {}, ".format(prop[0], prop[1])
            else:
                fields += 'n.{} = "{}", '.format(prop[0], prop[1])
        fields=fields[:-2]
        query = "MATCH (n {{ id: '{}' }}) SET {} RETURN n".format(p_id, fields) # To insert a literal bracket, double-bracket
        result = session.run("MATCH (n { id: " + "'" + p_id + "'" + " }) SET " + fields + " RETURN n")
        return jsonify("node information updated!")

@app.route('/api/getspouseid/nodeid=<nodeid>')
def getSpouseId(nodeid):
    global driver
    with driver.session() as session:
        result = session.run("MATCH (n:Person {id: " + "'" + nodeid + "'" + "})-[:spouse]-(target:Person) RETURN target.id AS spouseId")
        if (result.peek() is None):
            return jsonify("None")
        else:
            return jsonify({'spouseId': result.single()['spouseId']})

@app.route('/api/createnode/person=<person>')
def createNode(person):
    global driver

    uid = uuid.uuid4().urn
    id = uid[9:]
    obj = json.loads(person)
    obj['id'] = id

    fields = ''
    for prop in obj.items():
        if type(prop[1]) is int:
            fields += '{} : {},'.format(prop[0], prop[1])
        else:
            fields += '{} : "{}",'.format(prop[0], prop[1]) # stringify all non-int values
    fields = '{' + fields[:-1] + '}'

    query = 'CREATE (n: Person {}) RETURN n.name AS name, n.id AS id'.format(fields)
    print(query)
    with driver.session() as session:
        result = session.run(query)
        for record in result:
            return jsonify({ 'name': record['name'], 'id': record['id']})

@app.route('/api/createrelationship/newId=<newId>&relnId=<relnId>&relnType=<relnType>&spouseId=<spouseId>')
def createRelationship(newId, relnId, relnType, spouseId): #relnId is the id of the selected node
    global driver

    id = newId # ID of the created node
    with driver.session() as session:
        createReln = session.run("MATCH (a:Person),(b:Person) WHERE a.id = '" + id +
        "' AND b.id = '" + relnId +
        "' CREATE (b)-[r:"+relnType+"]->(a) RETURN type(r)")

        # case when adding a node to a singleton
        if (relnType == 'parent' and spouseId == "undefined"):

            print("HELLO")
            uid2 = uuid.uuid4().urn
            id2 = uid2[9:]

            # create new person for the undefined spouse
            naSpouse = session.run("CREATE (n:Person { name: 'unknown' , id: '"+id2+"', documents:'[]', "+
            "birth:'', death:'', gender:'', moreinfo:''}) RETURN n.id as id")

            # create spousal relationship between undefined spouse and relnId
            createSpouseReln = session.run("MATCH (a:Person),(b:Person) WHERE a.id = '" + relnId +
            "' AND b.id = '" + naSpouse.peek()['id'] +
            "' CREATE (a)-[r:spouse]->(b) RETURN type(r)")

            # create relationship between undefined spouse and newly created individual
            createReln = session.run("MATCH (a:Person),(b:Person) WHERE a.id = '" + id +
            "' AND b.id = '" + naSpouse.peek()['id'] +
            "CREATE (b)-[r:" +relnType+ "]->(a) RETURN type(r)")

        # case when adding a node to either spouse
        elif (relnType == 'parent'):
            print("HERE")
            createReln = session.run("MATCH (a:Person),(b:Person) WHERE a.id = '" + id +
            "' AND b.id = '" + spouseId +
            "' CREATE (b)-[r:"+relnType+"]->(a) RETURN type(r)")
        return jsonify(relnType)

@app.route('/api/deletenode/id=<id>')
def deleteNode(id):
    global driver
    with driver.session() as session:
        children = session.run("MATCH (Person { id: '"+ id +"' })-[:parent]->(person) RETURN person.name as name, person.id as id")
        for child in children:
            print(child['id'])
            deleteNode(child['id'])
        delete = session.run("MATCH (Person { id: '"+ id +"' }) DETACH DELETE Person")
    return jsonify("dummy")

@app.route('/api/getnode/id=<id>')
def getNode(id): # MATCH (n:Person { name: 'Alex' }) RETURN n
    global driver
    clientObj = {}
    with driver.session() as session:
        result = session.run('MATCH (n:Person { id: "' + id + '" }) RETURN n')
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
        result = session.run("MATCH(n:Person) WHERE EXISTS(n.root) RETURN DISTINCT n.name as name, n.id as id")
        for record in result:
            names['tree_roots'].append({ 'name': record['name'], 'id': record['id']})
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

@app.route('/api/gettree/id=<id>')
def getTree(id):
    global driver
    global visited
    members = []
    visited = set() # clear this for every new request
    with driver.session() as session:
        root = json.loads(getNode(id).get_data(True))
        members.append(addMember(session, root['name'], id, 1))
    return jsonify(members)

def addMember(session, name, id, depth): # DFS ... 'tree' is the name of the root
    global visited

    if(id in visited):
        return

    member = {
        'name' : name, # root
        'class' : '',
        'textClass' : '',
        'depthOffset' : depth,
        'marriages' : [{
            'spouse': {},
            'children' : []
        }],
        'extra' : id
    }

    visited.add(id)

    children = session.run("MATCH (Person { id: '"+ id +"' })-[:parent]->(person) RETURN person.name as name, person.id as id") # array of the obj{name : ''}

    c_json = None
    for child in children:
        c_json = addMember(session, child['name'], child['id'], depth+1)
        if c_json != None:
            member['marriages'][0]['children'].append(
                c_json #addMember(session, child['name'], depth+1)
            )
    spouses = session.run("MATCH (Person {id: '"+ id +"' })-[:spouse]-(person) RETURN person.name as name, person.id as id") # array of obj{name : ''}

    sp_json = None
    for spouse in spouses:
        sp_json = addMember(session, spouse['name'], spouse['id'], depth)
        if sp_json != None:
            member['marriages'][0]['spouse'] = sp_json

    if c_json == None and sp_json == None:
        del member['marriages'] # this may raise a KeyError if marriages does not exist

    return member

if __name__ == '__main__':
    #app.run(use_reloader=True, port=5000)
    socketio.run(app, debug=True, port=5000)

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

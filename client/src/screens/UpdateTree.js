import React from 'react'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { List, ListItem, ListItemText } from '@material-ui/core'

import * as d3 from "d3"
import _ from 'lodash'
import dTree from 'd3-dtree'
import '../css/UpdateTree.css'
import SplitPane from 'react-split-pane'
window.d3 = d3;

class UpdateTree extends React.Component {
    /*
        A form to update an existing tree
    */
    constructor(props){
        super(props)
        this.state = {
            family : props.location.state.family, // this is the id, not the name of the node
            tree : [],
            newPerson : { // ex: relnWith is relnType of name
                name : "",
                relnId : "",
                relnType : "",
                relnWith : "" // the selected node!
            },
            confirm_msg : "", // for node creation
            selectedID : "",
            selected : { // holds info of clicked node
                name : "",
                birth : "",
                death : "",
                docs : []
            },
            // Display properties
            addReln : 'none',
            addRelnText : '',

            updateNodeForm : 'none',
            viewNodeInfo : 'block',
            updateNodeText : 'Update Info'
        }
    }

    getTree = async () => {
        console.log(this.state.family)
        const response = await fetch('/api/gettree/name=' + this.state.family.name + '&id='+ this.state.family.id)
        const myJson = await response.json()
        console.log(myJson)
        this.setState({tree : myJson})
        this.drawTree()
    }

    componentDidMount() {
        this.getTree()
    }


   drawTree = () => {
     // var svg = document.getElementById("graph")
     // svg.selectAll("*").remove()
     var treeData = this.state.tree
          dTree.init(treeData,
            {
                target: this.refs.tree,
                debug: true,
                height: 800,
                width: 1200,
                callbacks: {
                    nodeClick: this.chooseNode,
                    /* Set the vertical space between nodes */
                    nodeHeightSeperation : function(nodeWidth, nodeMaxHeight){
                        return 20
                    }

                },
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                nodeWidth: 100,
                styles: {
                    node: 'node',
                    linage: 'linage',
                    marriage: 'marriage',
                    text: 'nodeText'
                }
            }
        );
   }

    chooseNode = (name, extra, id) => {
        // button event for selecting a node

        // is this even necessary?
        this.setState({
            newPerson : {
                name : this.state.newPerson.name,
                relnType : this.state.newPerson.relnType
            },
            selectedID : extra,
            selected : {
                name : name,
                birth : "",
                death: "",
                docs : ""
            },
            addRelnText : 'Add Relationship to ' + name
        })
        this.getNode(this.state.selectedID)

   }

   getNode = async (id) => {
        const response = await fetch('/api/getnode/id=' + id)
        const json = await response.json()
        // https://stackoverflow.com/questions/43040721/how-to-update-nested-state-properties-in-react
        var someProperty = {...this.state.selected}
        Object.entries(json).forEach(([key,value])=>{
          switch(key){
            case "birth":
              someProperty.birth = value;
              break;
            case "death":
              someProperty.death = value;
              break;
            case "docs":
              someProperty.docs = value;
              break;
            case "id":
              this.setState({
                selectedID : value
              })
              break;
          }
          this.setState({selected: someProperty})
        })
        console.log(this.state.selected.name)
        console.log("This is the selected id " + this.state.selectedID)

        // this.setState({selected : arr})
   }

   getSelectedArray = () => {

     var arr = [], item;
     for (var key in this.state.selected){
       item = [];
       item[0] = key;
       item[1] = this.state.selected[key];
       arr.push(item);
     }
     return arr;
   }

    typeName = (e) => {
        // input handler for name of new person
        this.setState({
            newPerson : {
                name : e.target.value,
                relnId : this.state.newPerson.relnId,
                relnType : this.state.newPerson.relnType,
                relnWith : this.state.newPerson.relnWith
            }
        })
        console.log(e.target.value)
    }

    selectRelationship = (e) => {
        // input handler for selecting relationship of new person to selected node
        this.setState({
            newPerson : {
                name : this.state.newPerson.name,
                relnId : this.state.newPerson.relnId,
                relnType : e.target.value,
                relnWith : this.state.newPerson.relnWith
            }
        })
        console.log(this.state.newPerson.relnType);
    }

    createNode = async () => {
        /* We should probably ask for validation before creating the node
        this.setState({confirm_msg : 'Are you sure you want to add ' + this.state.newPerson.name + ' where ' + this.state.newPerson.relnWith
        +  ' is the ' + this.state.newPerson.relnType});
        */
       //name=<name>&relnWith=<relOf>&relnType=<relnType>
        let url = '/api/createnode/name='+this.state.newPerson.name+'&relnWith='+this.state.selected.name+'&relnId='+this.state.selectedID+'&relnType='+this.state.newPerson.relnType
        console.log(url)
        const response = await fetch(url)
        const myJson = await response.json()

        console.log(myJson) //this is going to return dummy. however, before we proceed, we should check this response
        this.getTree()
    }
    updateSelectedNode = (event) => {
        this.setState({
              [event.target.name]: event.target.value
       });
       console.log(event.target.name + " : " + event.target.value)
     }

    submitUpdates = async () => {
      // change to be the real API call

      this.handleFormNavigation('submitUpdates')
    }

    handleFormNavigation = (id) => {
        if(id == 'addReln'){
            if(this.state.addReln == 'block'){
                this.setState({
                    addReln : 'none',
                    addRelnText : 'Add Relationship to ' + this.state.selected.name
                });
            }else{
                this.setState({
                    addReln : 'block',
                    addRelnText : 'Hide Add Relationship'
                });
            }
        }
        if(id == 'updateNodeForm'){
            if(this.state.updateNodeForm == 'none'){
                console.log("update form of node named " + this.state.selected.name)
                this.setState({
                    viewNodeInfo : 'none',
                    updateNodeForm : 'block',
                    updateNodeText : 'View Info'
                })
            }else{
                this.setState({
                    viewNodeInfo : 'block',
                    updateNodeForm : 'none',
                    updateNodeText : 'Update Info'
                })
            }
        }
        if (id == 'submitUpdates'){
          //
        }
    }

    render() {
        return (
            <Container>

            <SplitPane split="vertical" defaultSize={350}>

                        <div>
                            {/* Selected Person: {this.state.newPerson.relnWith} */}

                                <List id="viewNodeInfo" style={{display : this.state.viewNodeInfo}}>
                                    {

                                        this.getSelectedArray().map(
                                            (item) =>
                                                 <ListItem>
                                                     <ListItemText>
                                                         {item[0] + ': ' + item[1]}
                                                    </ListItemText>
                                                </ListItem>
                                        )
                                    }
                                </List>

                                <List id="updateNodeForm" style={{display : this.state.updateNodeForm}}>
                                  <TextField label="Name" name='selected.name' onChange={this.updateSelectedNode}/>
                                  <TextField required id="standard-required" label={this.state.selected.name} defaultValue="Hello World" margin="normal"  />
                                  <TextField label="Birth Date" name='selected.birth' type="date" defaultValue={this.state.selected.birth} InputLabelProps={{shrink: true,}} onChange={this.updateSelectedNode}/>
                                  <TextField label="Death Date" name='selected.death' type="date" defaultValue={this.state.selected.death} InputLabelProps={{shrink: true,}} onChange={this.updateSelectedNode}/>

                                  <div>
                                  <TextField label="Document Name" name='root_doc_name' id="doc_name" onChange={this.updateSelectedNode} />
                                  <TextField label="Document Link" name='root_doc_link' id="doc_link" onChange={this.updateSelectedNode} />
                                  // need to fix this one:
                                  <Button onClick={this.updateDocsArr} variant="outlined" color="primary" label="AddDoc">Add This Document</Button>
                                  </div>
                                  {
                                      // this.state.selected.map(
                                      //     (item) => <TextField label={item[0]} defaultValue={item[1]}> </TextField>
                                      // )
                                  }

                                    <Button onClick={() => this.submitUpdates}>
                                        {"Save Changes"}
                                    </Button>

                                </List>

                            <div id="addRelatedNode" style={{display : this.state.addReln}}>
                                <TextField
                                    label="New Person"
                                    value={this.state.newPerson.name}
                                    onChange={this.typeName}
                                />
                                <InputLabel >What is {this.state.selected.name}'s relationship to {this.state.newPerson.name} </InputLabel>
                                <Select
                                    value={this.state.newPerson.relnType}
                                    onChange={this.selectRelationship}
                                >
                                    <MenuItem value={'spouse'}>Spouse</MenuItem>
                                    <MenuItem value={'parent'}>Parent</MenuItem>
                                </Select>
                                <Button onClick={this.createNode}>Create Node</Button>
                                {this.state.confirm_msg}
                            </div>

                            <Button onClick={() => this.handleFormNavigation('updateNodeForm')}>
                                {this.state.updateNodeText}
                            </Button>
                            <Button onClick={() => this.handleFormNavigation('addReln')}>
                                {this.state.addRelnText}
                            </Button>
                        </div>
                        <div>
                            {this.state.family.name}'s Family
                            <svg ref="tree" id = "graph" width={800} height={500}></svg>
                        </div>
            </SplitPane>

            </Container>

        )
    }
}

export default UpdateTree

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
            selected : [], //2d array. [[key, value], ...]

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
     // clear the canvas
    var svg = document.getElementById("graph")
    while (svg.lastChild) {
      svg.removeChild(svg.lastChild);
    }

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
                        return 30;
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
        this.setState({
            newPerson : {
                name : this.state.newPerson.name,
                relnId : extra,
                relnWith : name,
                relnType : this.state.newPerson.relnType
            },
            addRelnText : 'Add Relationship to ' + name
        })
        console.log(this.state.newPerson.relnWith)
        this.getNode(this.state.newPerson.relnId)
   }

   getNode = async (id) => {
        const response = await fetch('/api/getnode/id=' + id)
        const json = await response.json()

        let arr = []

        Object.entries(json).forEach(([key,value])=>{
            arr.push([key, value])
        })

        console.log(arr)
        console.log("This is the relation id " + this.state.newPerson.relnId)

        this.setState({selected : arr})


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
        var form = document.getElementById("selectRelFromDropdown").value
        if (form == ""){
          alert("Must select a relationship first!")
        }
        /* We should probably ask for validation before creating the node
        this.setState({confirm_msg : 'Are you sure you want to add ' + this.state.newPerson.name + ' where ' + this.state.newPerson.relnWith
        +  ' is the ' + this.state.newPerson.relnType});
        */
       //name=<name>&relnWith=<relOf>&relnType=<relnType>
       // get spouse id
       const response_spouse = await fetch('/api/getspouseid/nodeid=' + this.state.newPerson.relnId)
       const json_spouse = await response_spouse.json()
       var spouse_id = json_spouse['spouseId']

        let url = '/api/createnode/name='+this.state.newPerson.name+'&relnWith='+this.state.newPerson.relnWith+'&relnId='+this.state.newPerson.relnId+'&relnType='+this.state.newPerson.relnType+'&spouseId='+spouse_id
        console.log("API call: " + url)
        const response = await fetch(url)
        const myJson = await response.json()



        console.log(myJson) //this is going to return dummy. however, before we proceed, we should check this response
        this.getTree()
    }

    handleFormNavigation = (id) => {
        if(id == 'addReln'){
            if(this.state.addReln == 'block'){
                this.setState({
                    addReln : 'none',
                    addRelnText : 'Add Relationship to ' + this.state.newPerson.relnWith
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
    }

    render() {
        return (
            <Container>

            <SplitPane split="vertical" defaultSize={350}>

                        <div>
                            {/* Selected Person: {this.state.newPerson.relnWith} */}

                                <List id="viewNodeInfo" style={{display : this.state.viewNodeInfo}}>
                                    {
                                        this.state.selected.map(
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
                                    {
                                        this.state.selected.map(
                                            (item) => <TextField label={item[0]} value={item[1]}> </TextField>
                                        )
                                    }
                                </List>

                            <div id="addRelatedNode" style={{display : this.state.addReln}}>
                                <TextField
                                    label="New Person"
                                    value={this.state.newPerson.name}
                                    onChange={this.typeName}
                                />
                                <InputLabel >What is {this.state.newPerson.relnWith}'s relationship to {this.state.newPerson.name} </InputLabel>
                                <Select
                                    id="selectRelFromDropdown"
                                    value={this.state.newPerson.relnType}
                                    onChange={this.selectRelationship}
                                >
                                <MenuItem value=""><em>None</em></MenuItem>
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
                            <p class="text"> {this.state.family.name}'s Family </p>-
                            <svg ref="tree" id = "graph" width={1000} height={700}></svg>
                        </div>
            </SplitPane>

            </Container>

        )
    }
}

export default UpdateTree

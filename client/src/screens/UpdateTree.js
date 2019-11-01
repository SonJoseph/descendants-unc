import React from 'react'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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
            family : props.location.state.family,
            tree : [],
            newPerson : {
                name : "",
                relnType : "",
                relnOf : "" // ex: name is relnType of relnOf
            },
            confirm_msg : "" // for node creation
        }
    }

    getTree = async () => {
        const response = await fetch('/api/gettree/' + this.state.family)
        const myJson = await response.json()
        this.setState({tree : myJson})
        console.log(myJson)
    }

    componentDidMount() {
        this.getTree()
    }

   drawNode = () => {
     d3.select(this.refs.tree)
     .selectAll("circle")
     .data([1, 2, 3])
     .enter()
     .append("circle")
     .attr("cx", function(d, i) { return i * 50 + 47; })
     .attr("cy", function(d, i) { return i * 25 + 30; })
     .attr("r", function(d, i) { return (i+5) * 2; })
     .attr("fill", "purple")
   }


   drawTree = () => {
     var treeData = this.state.tree
          dTree.init(treeData,
            {
                target: this.refs.tree,
                debug: true,
                height: 800,
                width: 1200,
                callbacks: {
                    nodeClick: this.chooseNode
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
                relnOf : name,
                name : this.state.newPerson.name,
                relnType : this.state.newPerson.relnType
            }
        })
   }

    typeName = (e) => {
        // input handler for name of new person
        this.setState({
            newPerson : {
                name : e.target.value,
                relnType : this.state.newPerson.relnType,
                relnOf : this.state.newPerson.relnOf 
            }
        })
        console.log(e.target.value)
    }

    selectRelationship = (e) => {
        // input handler for selecting relationship of new person to selected node
        this.setState({
            newPerson : {
                name : this.state.newPerson.name,
                relnType : e.target.value,
                relnOf : this.state.newPerson.relnOf
            }
        })
        console.log(this.state.newPerson.relnType);
    }

    createNode = () => {
        this.setState({confirm_msg : 'Are you sure you want to add ' + this.state.newPerson.name + ' as a ' 
        + this.state.newPerson.relnType + ' of ' + this.state.newPerson.relnOf + '?'});
    }

    render() {
        return (
            <Container>

            <SplitPane split="vertical" defaultSize={350}>
                        <div>
                            Selected Person: {this.state.newPerson.relnOf}
                            <TextField
                                label="New Person"
                                value={this.state.newPerson.name}
                                onChange={this.typeName}
                            />
                            <InputLabel >What is {this.state.newPerson.name}'s relationship to {this.state.newPerson.relnOf}? </InputLabel>
                            <Select
                                value={this.state.newPerson.relnType}
                                onChange={this.selectRelationship}
                            >
                                <MenuItem value={'spouse'}>Spouse</MenuItem>
                                <MenuItem value={'child'}>Child</MenuItem>
                            </Select>
                            <Button onClick={this.createNode}>Create Node</Button>
                            {this.state.confirm_msg}
                        </div>
                        <div>
                            {this.state.family}'s Family
                            <svg ref="tree" id = "graph" width={800} height={500}></svg>
                            <Button onClick={this.getTree}>Get Tree data</Button>
                            <Button onClick={this.drawTree}>Draw Node</Button>
                        </div>
            </SplitPane>

            </Container>

        )
    }
}

export default UpdateTree

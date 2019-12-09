import React from 'react'

import ScreenRegistry from '../components/ScreenRegistry'
import Container from '@material-ui/core/Container'
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import Home from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button'


import * as d3 from "d3"
import _ from 'lodash'
import dTree from 'd3-dtree'
import '../css/UpdateTree.css'
import SplitPane from 'react-split-pane'
window.d3 = d3;

class UpdateTree extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            display : 'home',

            root_name : props.location.state.family.name,
            root_id : props.location.state.family.id,

            tree : [],

            selectedID : "",
            selectedArr : [],
            selectedJson : {},
        }
    }

    getTree = async () => { // We currently can't change the root of the tree
        const response = await fetch('/api/gettree/id='+ this.state.root_id)
        const myJson = await response.json()
        this.setState({
            root_name : myJson[0]['name'], // In case the name of the root changes
            tree : myJson
        })
        this.drawTree()
        console.log(this.state.tree)
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
        this.getNode(extra)
        this.setState({
            display : 'view'
        })
   }

   getNode = async (id) => {
        const response = await fetch('/api/getnode/id=' + id)
        const json = await response.json()

        let arr = []

        json['documents'] = JSON.parse(json['documents'].replace(/\n|\r/g,'').replace(/'/g, '"'))

        Object.entries(json).forEach(([key,value])=>{
            if(key !== "id" && key !== "root" && key !== "depth"){
                // Don't display these fields. If they're not displayed, then they also can't be edited
                arr.push([key, value])
            }
        })

        this.setState({
            selectedArr : arr, // we display this
            selectedID : id,
            selectedJson : json, // we use this to update fields
        })
    }

    changeRoot = (id) => {
        this.state.root_id = id // set a new root id
        this.back(false, id)
    }

    goHome = () => {
      this.props.history.push({
          pathname: '/',
      })
    }

   edit = () => {
       this.setState({
           display : 'update'
       })
   }

   back = (del=false, id=this.state.selectedID) => {
       console.log(del)
       if(del == true){
            this.setState({
                selectedArr : [],
                selectedID : '',
                selectedJson : {},
                display : 'home'
            })
        }else{
            this.getNode(id) // view the specified node
            this.setState({
                display : 'view'
            })
        }
        this.getTree() // refresh node
   }

   add = () => {
       this.setState({
           display : 'add'
       })
   }

    render() {

        const Form = ScreenRegistry[this.state.display]
        const props = {}

        return (

                <SplitPane split="vertical" minSize={450} defaultSize={450} maxSize={450}>

                            <div style={{maxHeight: '100%', overflowX: 'hidden', overflowY: 'auto'}}>
                                {<Form
                                    {...this.state} // parent's state can be accesed in child via this.props...
                                    isRoot={false}
                                    edit={this.edit.bind(this)}
                                    back={this.back.bind(this)}
                                    add={this.add.bind(this)}

                                    changeRoot={this.changeRoot.bind(this)}
                                    message={'Click a person to view their information!'}
                                />}
                            </div>
                            <Grid container spacing={3} justify= 'center' direction="column" >
                                <Grid item>
                                  <Container maxWidth='lg' style={{marginTop: '10px', marginBottom: '10px'}}>
                                    <Grid container spacing={3} justify= 'space-between' alignItems='center' direction="row" >
                                      <Grid item>
                                        <Typography variant='h2'style={{textAlign: "center", marginTop: '10px'}}> {this.state.root_name}'s Family </Typography>
                                      </Grid>
                                      <Grid item>
                                        <IconButton color="secondary" onClick={this.goHome} >
                                          <Home style={{ fontSize: 40, borderWidth:0 }}/>
                                        </IconButton>
                                      </Grid>
                                  </Grid>

                                  </Container >
                                </Grid >
                                <Container maxWidth='lg'>
                                  <div>
                                    <svg ref="tree" id = "graph" width="100%" height="560" style={{ borderWidth: "0px"}}></svg>
                                  </div>
                                </Container >
                            </Grid>
                </SplitPane>


        )
    }
}

export default UpdateTree

import React from 'react'

import ScreenRegistry from '../components/ScreenRegistry'
import Container from '@material-ui/core/Container'

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
            display : 'view',

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
   }

   getNode = async (id) => {
        const response = await fetch('/api/getnode/id=' + id)
        const json = await response.json()

        console.log(json)

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

   edit = () => {
       this.setState({
           display : 'update'
       })
   }

   back = (del) => {
       if(del){
            this.setState({
                selectedArr : [], 
                selectedID : '', 
                selectedJson : {},
            })
        }else{
            this.getNode(this.state.selectedID) // update info related to selected node in case there were a change
        }
        this.setState({
            display : 'view'
        })
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
            <Container>

                <SplitPane split="vertical" defaultSize={350}>

                            <div>
                                {<Form
                                    {...this.state} // parent's state can be accesed in child via this.props...
                                    isRoot={false}
                                    edit={this.edit.bind(this)}
                                    back={this.back.bind(this)}
                                    add={this.add.bind(this)}
                                    refreshTree={this.getTree.bind(this)}
                                />}
                            </div>

                            <div>
                                <p class="text"> {this.state.root_name}'s Family </p>
                                <svg ref="tree" id = "graph" width={1000} height={700}></svg>
                            </div>
                </SplitPane>

            </Container>

        )
    }
}

export default UpdateTree

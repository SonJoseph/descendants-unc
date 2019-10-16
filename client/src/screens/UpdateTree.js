import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import * as d3 from "d3"
import _ from 'lodash';
import dTree from 'd3-dtree';
import './UpdateTree.css';
window.d3 = d3;

class UpdateTree extends React.Component {
    /*
        A form to update an existing tree
    */
    constructor(props){
        super(props)
        this.state = {
            family : props.location.state.family,
            tree : []
        }
    }

    getTree = async () => {
        console.log(this.state.family)
        const response = await fetch('/api/gettree/' + this.state.family)
        const myJson = await response.json()
        this.setState({tree : myJson})
        console.log(myJson)
    }

    componentDidMount() {
        this.getTree()
    }

    handleChange = (e) => {
        this.setState({
            name : e.target.value
        })
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
      	dTree.init(treeData,{
						target: this.refs.tree,
						debug: true,
						height: 800,
						width: 1200,
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
					});
   }


    render() {
        return (
            <Container>
            <Container>
                {this.state.family}
                <TextField
                    label="Name"
                    value={this.state.name}
                    onChange={this.handleChange}
                />
                <Button onClick={this.getTree}>Get Tree data</Button>
                <Button onClick={this.drawTree}>Draw Node</Button>
            </Container>
            <Container>
                <svg ref="tree" id = "graph" width={800} height={500}></svg>
            </Container>


            </Container>

        )
    }
}

export default UpdateTree

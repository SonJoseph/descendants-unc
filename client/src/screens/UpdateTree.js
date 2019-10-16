import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import * as d3 from "d3"
import _ from 'lodash';
import dTree from 'd3-dtree';

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
     var treeData = [{
  "name": "Niclas Superlongsurname",
  "class": "man",
  "textClass": "emphasis",
  "marriages": [{
    "spouse": {
      "name": "Iliana",
      "class": "woman",
      "extra": {
        "nickname": "Illi"
      }
    },
    "children": [{
      "name": "James",
      "class": "man",
      "marriages": [{
        "spouse": {
          "name": "Alexandra",
          "class": "woman"
        },
        "children": [{
          "name": "Eric",
          "class": "man",
          "marriages": [{
            "spouse": {
              "name": "Eva",
              "class": "woman"
            }
          }]
        }, {
          "name": "Jane",
          "class": "woman"
        }, {
          "name": "Jasper",
          "class": "man"
        }, {
          "name": "Emma",
          "class": "woman"
        }, {
          "name": "Julia",
          "class": "woman"
        }, {
          "name": "Jessica",
          "class": "woman"
        }]
      }]
    }]
  }]
}]

      	dTree.init(treeData,
					{
						target: this.refs.tree,
						debug: true,
						height: 800,
						width: 1200
					});
   }


    render() {
        return (
            <Container>
                {this.state.family}
                <TextField
                    label="Name"
                    value={this.state.name}
                    onChange={this.handleChange}
                />
                <Button onClick={this.getTree}>Get Tree data</Button>
                <Button onClick={this.drawTree}>Draw Node</Button>

                <svg ref="tree" id = "graph" width={800} height={800}></svg>



            </Container>

        )
    }
}

export default UpdateTree

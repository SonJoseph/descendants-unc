import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import SplitPane from 'react-split-pane'

class SelectTree extends React.Component {
    /*
        Load the client with a list of the available family trees.
    */

    constructor(props){
        super(props)
        this.state = {
            tree_roots : [],
            newRoot : { // root person of a new tree
                name : "test",
                birth : "hi"
            },
            updateRoot : 'none',
            viewNodeInfo : 'block',
            updateNodeText : 'Create Tree'
        }
    }

    getTreeRoots = async () => {
        const response = await fetch('/api/gettrees')
        const myJson = await response.json()
        this.setState({tree_roots : myJson.tree_roots})
    }

    updateTree = (tree) => {
      console.log(tree)
        this.props.history.push({
            pathname: '/update',
            state: { family: tree }
        })
    }

    // redirect to a new view for new tree
    createRoot = async (name, birth) => {
      console.log(this.state.newRoot)
      //instantiate new root in the database
      let url = '/api/createroot/name='+name+'&birth='+birth
      const response = await fetch(url)
      const myJson = await response.json()
      console.log(myJson)

      //redirect to new view for the tree
      // this.props.history.push({
      //   pathname: '/' + this.props.newRoot.name,
      //   state: { family: tree }
      // })
    }

    componentDidMount() {
        this.getTreeRoots()
    }

    enterRootInfo = () => {
      console.log(this.state)
      if(this.state.updateRoot == 'none'){

          // this.setState({
          //     viewNodeInfo : 'none',
          //     updateRoot : 'block',
          //     updateNodeText : 'Finish!'
          // })

          this.setState({
            newRoot : {
                name : "Janey",
                birth : "04301998"
            }
          })

          console.log(this.state.newRoot)
          // Add this newly created root to trees array
          this.state.tree_roots.push(this.state.newRoot)
          this.createRoot("Janey", "04301998")
      }
    }

    render() {
        return (
          <SplitPane split="vertical" defaultSize={700}>
            <div>
                <h1>Select Existing Tree</h1>
                <List>
                    {
                        this.state.tree_roots.map(
                            (item) => <ListItem> <Button onClick={() => this.updateTree(item)}  variant="outlined" color="primary" > {item.name} </Button> </ListItem>
                        )
                    }
                    {/* <ListItem style={{ width: '100%', marginTop: '30px' }}><Button style={{ width: '100%' }} variant="outlined" color="primary" onClick={() => this.props.history.push('/createClass')}> Add a new class </Button></ListItem> */}
                </List>
            </div>
            <div>
              <h1>Create New Tree</h1>
              <Button onClick={this.enterRootInfo} variant="outlined" color="primary">
                  {this.state.updateNodeText}
              </Button>
            </div>
            </SplitPane>
        )
    }
}

export default SelectTree

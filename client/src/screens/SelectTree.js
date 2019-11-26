import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import SplitPane from 'react-split-pane'
import TextField from '@material-ui/core/TextField'

class SelectTree extends React.Component {
    /*
        Load the client with a list of the available family trees.
    */

    constructor(props){
        super(props)
        this.state = {
            tree_roots : [],
            root_name:'',
            root_birth:'',
            newRoot : { // root person of a new tree
                name:'',
                birth:''
            },
            updateRoot : 'none',
            viewNodeInfo : 'block',
            updateNodeText : 'Create Tree!'
        }
        this.updateRootInfo = this.updateRootInfo.bind(this)
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
    }

    componentDidMount() {
        this.getTreeRoots()
    }

    updateRootInfo = (event) => {
      this.setState({
            [event.target.name]: event.target.value
        // newRoot : {
        //   name: 'jesus',
        //   birth: '000'
        // }
        //
     });
   }

   clickFinish = () => {
     // Add this newly created root to trees array
     this.state.tree_roots.push(this.state.newRoot.name)
     console.log(this.state.tree_roots)
     this.createRoot(this.state.root_name, this.state.root_birth)
     // change view to the tree
     this.updateTree(this.state.root_name)
   }

          // this.setState({
          //   newRoot : {
          //       name : "Marissa",
          //       birth : "04391939"
          //   }
          // })



    //}

    render() {
        return (
          <SplitPane split='horizontal' defaultSize={200}>
          <div>
            <h1>The Descendants Project</h1>
          </div>

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
              <h1>Create Tree</h1>
              <h2>Specify Root Information</h2>
              <TextField label="Name" name='root_name' onChange={this.updateRootInfo}/>
              <TextField label="Birth Date" name='root_birth' onChange={this.updateRootInfo}/>
              <Button onClick={this.clickFinish} variant="outlined" color="primary" label="Finish">
                  {this.state.updateNodeText}
              </Button>
            </div>
            </SplitPane>

          </SplitPane>

        )
    }
}

export default SelectTree

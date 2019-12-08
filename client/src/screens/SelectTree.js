import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import SplitPane from 'react-split-pane'
import TextField from '@material-ui/core/TextField'
import CreateNode from '../components/CreateNode'

class SelectTree extends React.Component {
    /*
        Load the client with a list of the available family trees.
    */

    constructor(props){
        super(props)
        this.state = {
            tree_roots : [],
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

    componentDidMount() {
        this.getTreeRoots()
    }


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
            <CreateNode history={this.props.history} isRoot={true}/>

            </SplitPane>

          </SplitPane>

        )
    }
}

export default SelectTree

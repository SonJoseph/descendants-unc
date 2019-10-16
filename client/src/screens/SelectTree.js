import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import Button from '@material-ui/core/Button'

class SelectTree extends React.Component {
    /*
        Load the client with a list of the available family trees.
    */

    constructor(props){
        super(props)
        this.state = {
            tree_roots : []
        }
    }

    getTreeRoots = async () => { 
        const response = await fetch('/api/gettrees') 
        const myJson = await response.json()
        this.setState({tree_roots : myJson.tree_roots})
    }

    updateTree = (tree) => {
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
            <div>
                <h1>Select tree</h1>
                <List>
                    {
                        this.state.tree_roots.map(
                            (item) => <ListItem> <Button onClick={() => this.updateTree(item)}  variant="outlined" color="primary" > {item} </Button> </ListItem>
                        )
                    }
                    {/* <ListItem style={{ width: '100%', marginTop: '30px' }}><Button style={{ width: '100%' }} variant="outlined" color="primary" onClick={() => this.props.history.push('/createClass')}> Add a new class </Button></ListItem> */}
                </List>
            </div>
        )
    }
}

export default SelectTree
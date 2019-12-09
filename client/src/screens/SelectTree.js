import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import SplitPane from 'react-split-pane'
import TextField from '@material-ui/core/TextField'
import CreateNode from '../components/CreateNode'
import CreatePopup from '../components/CreatePopup'
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

class SelectTree extends React.Component {
    /*
        Load the client with a list of the available family trees.
    */

    constructor(props){
        super(props)
        this.state = {
            tree_roots : [],
        }
        this.name = this.props.selectedJson
    }

    getTreeRoots = async () => {
        const response = await fetch('/api/gettrees')
        const myJson = await response.json()
        this.setState({tree_roots : myJson.tree_roots})
        console.log(this.tree_roots)
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
          <div>
            <Grid container spacing={3} justify= 'center' direction="column" style={{margin:8}}>
              <Grid item >
                <Container maxWidth="md">
                  <Typography variant='h2' align='center'> The Descendants Project </Typography>
                </Container>
              </Grid>
              <Grid item >
                <Container maxWidth="sm">
                  <Grid container spacing={3} justify= 'center'>
                    <Grid item>
                      <Typography variant='h5'> Select Existing Tree </Typography>
                    </Grid>
                    <Grid item container spacing={1} justify="center" alignItems="center" style={{height:50%, overflow: 'auto'}}>
                        {
                            this.state.tree_roots.map(
                                (item) => <Grid item> <Button color="secondary" onClick={() => this.updateTree(item)}  variant="outlined" color="primary" > {item.name} </Button> </Grid>
                            )
                        }
                        {/* <ListItem style={{ width: '100%', marginTop: '30px' }}><Button style={{ width: '100%' }} variant="outlined" color="primary" onClick={() => this.props.history.push('/createClass')}> Add a new class </Button></ListItem> */}
                    </Grid>
                    <Grid item>
                      <CreatePopup  />
                    </Grid>
                  </Grid>
                </Container>
              </Grid>
            </Grid>
          </div>


        )
    }
}

export default SelectTree

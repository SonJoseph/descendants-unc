import React from 'react'
import Button from '@material-ui/core/Button'
import { List, ListItem, ListItemText } from '@material-ui/core'
import Property from '../components/Property'
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

class ViewNode extends React.Component {

    constructor(props) {
        super(props)
    }

    render(){
        const Display = []

        for(let i=0; i<this.props.selectedArr.length; i++){
          let key = this.props.selectedArr[i][0]
            if (key != 'name'){

              let val = this.props.selectedArr[i][1]

              Display.push(
                  <Property
                      k = {key}
                      val = {val}
                  />
                )
            }

        }

        return(
            <Grid style = {{margin:15}}>
                <Typography variant='h4'>Viewing {this.props.selectedJson['name']}</Typography>
                <List id="viewNodeInfo">
                    {
                        Display
                    }
                </List>
                <Button onClick={this.props.edit}> Edit </Button>
                <Button onClick={this.props.add}> Add Relative </Button>
            </Grid>
        )
    }
}

export default ViewNode

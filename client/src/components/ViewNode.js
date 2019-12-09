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
              switch(key){
                case "birth": case "death": case "gender":
                  key = key.charAt(0).toUpperCase() + key.slice(1);
                  break;
                case "moreinfo":
                  key="Notes"
              }

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
            <Grid direction="column" container style = {{margin:15}}>
                <Grid item>
                  <Typography variant='h4' style={{color: "#4253B8", textAlign: "center", marginTop: "5px"}}>Viewing {this.props.selectedJson['name']}</Typography>
                  <List id="viewNodeInfo">
                      {
                          Display
                      }
                  </List>
                </Grid>

                <Grid item>
                  <Grid container direction="row" justify="center" alignItems="center">
                  <Grid item><Button onClick={this.props.edit} variant="contained" color="primary" size="medium" style={{ margin: 8 }}> Edit </Button></Grid>
                  <Grid item><Button onClick={this.props.add} variant="outlined" color="primary" size="medium" style={{ margin: 8 }}> Add Relative to {this.props.selectedJson['name']}</Button></Grid>
                  </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default ViewNode

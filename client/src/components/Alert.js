import React from "react";
import Popup from "reactjs-popup";
import Button from '@material-ui/core/Button'
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

class Alert extends React.Component {

    constructor(props) {
        super(props)
    }

    render(){
      return(
        <Popup trigger={<Grid container justify="center" alignItems="center"><Grid item><Button variant="contained" size="large" style={{margin: 8}}> Delete This Person </Button></Grid></Grid>} position="right center" modal>
          {close => (
              <Grid container style = {{margin: '15px'}}>
              <Grid item>
                <Typography variant="h6" style={{color: "#c62828", margin: '15px'}}> Are you sure you want to delete this person from the tree? </Typography>
                <Typography variant="body2" style={{margin: '15px'}}> This will delete any people directly below this person in the tree, their spouse, and the data for all of those people.
                  </Typography>
              </Grid>
                <Grid item className="actions">
                  <Button className="button" onClick={() => { close(); }} style = {{margin: '8px'}}> Cancel </Button>
                  <Button className="button" variant="outlined" color="primary" onClick={() => { this.props.delete() }} style = {{margin: '8px'}}> Confirm </Button>
                </Grid>
              </Grid>
          )}
        </Popup>
      )
    }

}
export default Alert

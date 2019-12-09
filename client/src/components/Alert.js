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
        <Popup trigger={<Grid container justify="center" alignItems="center"><Grid item><Button variant="contained" color="red" size="large"> Delete </Button></Grid></Grid>} position="right center" modal>
          {close => (
              <div>
                <Typography variant="h6"> Are you sure you want to delete this person from the tree? </Typography>
                <Typography variant="body2"> This will delete any people directly below this person in the tree, their spouse, and the data for all of those people.
                  </Typography>
                <div className="actions">
                  <Button className="button" onClick={() => { close(); }}> Cancel </Button>
                  <Button className="button" variant="outlined" color="primary" onClick={() => { this.props.delete() }}> Confirm </Button>
                </div>
              </div>
          )}
        </Popup>
      )
    }

}
export default Alert

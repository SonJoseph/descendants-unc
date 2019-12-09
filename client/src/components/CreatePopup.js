import React from "react";
import Popup from "reactjs-popup";
import Button from '@material-ui/core/Button'
import CreateNode from '../components/CreateNode'
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

class CreatePopup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          isRoot : true
        }
    }

    render(){
      return(
        <Popup trigger={<Button color="secondary" variant="contained"> Add New Tree </Button>} position="right center" modal>
          {close => (
              <div>
                <Typography variant='h4'> Add your first person to the family tree! </Typography>
                <Typography variant='body1'>  Your family tree will be identifed by this person. You can change this later. </Typography>
                <CreateNode {...this.state}
                  close={close.bind(this)}
                  />
              </div>
          )}
        </Popup>
      )
    }

}
export default CreatePopup

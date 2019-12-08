import React from "react";
import Popup from "reactjs-popup";
import Button from '@material-ui/core/Button'

class Alert extends React.Component {

    constructor(props) {
        super(props)
    }

    render(){
      return(
        <Popup trigger={<Button> Delete </Button>} position="right center" modal>
          {close => (
              <div>
                <h1> Are you sure you want to delete {this.props.selectedID} from the tree? </h1>
                This will delete any people directly below this person in the tree, their spouse, and the data for all of those people.
                <div className="actions">
                  <Button className="button" onClick={() => { close(); }}> Cancel </Button>
                  <Button className="button" onClick={() => { this.props.delete() }}> Confirm </Button>
                </div>
              </div>
          )}
        </Popup>
      )
    }

}
export default Alert

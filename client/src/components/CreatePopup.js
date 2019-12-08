import React from "react";
import Popup from "reactjs-popup";
import Button from '@material-ui/core/Button'
import CreateNode from '../components/CreateNode'

class CreatePopup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          isRoot : true
        }
    }

    render(){
      return(
        <Popup trigger={<Button> Add New Tree </Button>} position="right center" modal>
          {close => (
              <div>
                <h1> Add your first person to the family tree! </h1>
                <p> Your family tree will be idenitifed by this person. You can change this later. </p>
                <CreateNode {...this.state}/>
                <div className="actions">
                  <Button className="button" onClick={() => { close(); }}> Cancel </Button>
                  <Button className="button" onClick={() => {  }}> Confirm </Button>
                </div>
              </div>
          )}
        </Popup>
      )
    }

}
export default CreatePopup

import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

class UpdateNode extends React.Component {

    constructor(props) {
        super(props)
        this.json = this.props.selectedJson
    }

    updateSelectedNode = (event) => {

        this.json[event.target.name] = event.target.value
        console.log(this.json)

     }

    submitUpdates = () => {
        // change to be the real API call
        console.log(this.json);
       this.props.back();
    }

    render(){
        return(
            <div>
                <div> Edit </div>
                {
                    this.props.selectedArr.map(
                        (item) => <TextField name={item[0]} label={item[0]} defaultValue={item[1]} onChange={this.updateSelectedNode}> </TextField>
                    )
                }
                <Button onClick={this.props.back}> Back </Button>
                <Button onClick={this.submitUpdates}> Submit </Button>
            </div>
        )
    }

}

export default UpdateNode
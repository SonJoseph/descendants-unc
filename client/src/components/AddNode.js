import React from 'react'

import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'

class AddNode extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            name : '',
            relnType : ''
        }
    }

    createNode = async () => {
        /* We should probably ask for validation before creating the node
        this.setState({confirm_msg : 'Are you sure you want to add ' + this.state.newPerson.name + ' where ' + this.state.newPerson.relnWith
        +  ' is the ' + this.state.newPerson.relnType});
        */

        let url = '/api/createnode/name='+this.state.name+'&relnId='+this.props.selectedID+'&relnType='+this.state.relnType
 
        const response = await fetch(url)
        const myJson = await response.json()

        // console.log(myJson) //this is going to return dummy. however, before we proceed, we should check this response
        this.props.refreshTree()
    }

    handleForm = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render(){

        return (
            <div>
                <div> Add </div>
                <div id="addRelatedNode">
                    <TextField
                        name="name"
                        label="New Person"
                        onChange={this.handleForm}
                    />
                    <InputLabel >What is {this.props.selectedJson['name']}'s relationship to {this.state.name} </InputLabel>
                    <Select
                        name="relnType"
                        value={this.state.relnType}
                        onChange={this.handleForm}
                    >
                        <MenuItem value={'spouse'}>Spouse</MenuItem>
                        <MenuItem value={'parent'}>Parent</MenuItem>
                    </Select>
                    <Button onClick={this.createNode}>Create Node</Button>
                    
                </div>
                <Button onClick={this.props.back}> Back </Button>
            </div>

        )
    }

}

export default AddNode
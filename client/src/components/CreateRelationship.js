import React from 'react'

import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import CreateNode from './CreateNode'

class CreateRelationship extends React.Component {

    constructor(props){
        super(props)

        console.log('Is the selected node the root of the tree?: ' + this.props.selectedIsRoot)

        this.state = {
            reln : ''
        }
    }

    update = (e) => {
        this.setState({ // Update the client
            reln : e.target.value
        })
        this.props.updateRelnForm(e.target.value) // We have to send the updated state back to the parent
    }

    render(){

        return (
            <div>
                    <InputLabel >What is {this.props.selectedName}'s relationship to {this.props.name} </InputLabel>
                    <Select
                        name="relnType"
                        onChange={this.update}
                        value={this.state.reln}
                    >
                        <MenuItem value={'spouse'}>Spouse</MenuItem>
                        <MenuItem value={'parent'}>Parent</MenuItem>
                        { this.props.selectedIsRoot && <MenuItem value={'child'}>Child</MenuItem>}
                    </Select>
            </div>

        )
    }

}

export default CreateRelationship

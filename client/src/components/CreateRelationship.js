import React from 'react'

import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import CreateNode from './CreateNode'
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

class CreateRelationship extends React.Component {

    constructor(props){
        super(props)

        console.log('Is the selected node the root of the tree?: ' + this.props.selectedIsRoot)

        this.state = {
            reln : '',
            hasSpouse: true
        }

        this.checkSpouse()
    }

    update = (e) => {
        this.setState({ // Update the client
            reln : e.target.value
        })
        this.props.updateRelnForm(e.target.value) // We have to send the updated state back to the parent
    }

    checkSpouse = async() => {
      const response_spouse = await fetch('/api/getspouseid/nodeid=' + this.props.nodeid)
      const json_spouse = await response_spouse.json()
      if (json_spouse['data'] === 'none'){
        this.setState({
          hasSpouse : false
        })
      }
    }

    render(){

        return (
            <div>
                    <FormControl variant="outlined" className="formControl">
                      <InputLabel>Relationship</InputLabel>
                    <Select
                        name="relnType"
                        onChange={this.update}
                        value={this.state.reln}
                    >
                        {!this.state.hasSpouse && <MenuItem value={'spouse'}>Spouse</MenuItem>}
                        <MenuItem value={'parent'}>Child</MenuItem>
                        { this.props.selectedIsRoot && <MenuItem value={'child'}>Parent</MenuItem>}
                    </Select>
                    <FormHelperText>What is this new person's relationship to {this.props.selectedName}? </FormHelperText>
                  </FormControl>
            </div>

        )
    }

}

export default CreateRelationship

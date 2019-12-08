import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Alert from '../components/Alert.js'

class UpdateNode extends React.Component {

    constructor(props) {
        super(props)
        this.json = this.props.selectedJson
    }

    updateSelectedNode = (event) => {
        this.json[event.target.name] = event.target.value
     }

    submitUpdates = async () => {
        let url = '/api/updatenode/person='+JSON.stringify(this.json);
        const response = await fetch(url)
        const myJson = await response.json()
        this.props.refreshTree()
        this.props.back()
    }

    deleteNode = async () => {
      let url = '/api/deletenode/id='+this.props.selectedID;
      const response = await fetch(url)
      const myJson = await response.json()
      this.props.refreshTree()
      this.props.back()
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
                <Alert {...this.state}
                  delete={this.deleteNode.bind(this)} />
                <Button onClick={this.props.back}> Back </Button>
                <Button onClick={this.submitUpdates}> Submit </Button>
            </div>
        )
    }

}

export default UpdateNode

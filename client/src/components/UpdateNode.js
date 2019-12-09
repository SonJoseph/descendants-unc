import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Alert from '../components/Alert.js'
import { Route , withRouter} from 'react-router-dom';
import CreateNode from '../components/CreateNode'

class UpdateNode extends React.Component {

    constructor(props) {
        super(props)
    }

    updateSelectedNode = (event) => {
        this.json[event.target.name] = event.target.value
     }

    submitUpdates = async(json) => {
        let url = '/api/updatenode/person='+JSON.stringify(json);
        const response = await fetch(url)
        const myJson = await response.json()
        this.props.back()
    }

    deleteNode = async () => {
      console.log(this.props.selectedJson['root'])
      let url = '/api/deletenode/id='+this.props.selectedID;
      const response = await fetch(url)
      const myJson = await response.json()
      if(this.props.selectedJson['root'] === 1){
        this.props.history.push({
            pathname: '/',
        })
      } else {
        this.props.back(true)
      }
    }

    render(){
        return(
            <div>
                <div> Edit </div>
                <CreateNode
                    selectedJson = {this.props.selectedJson}
                    isRoot = {false}
                    isUpdate = {true}
                    updateNode = {this.submitUpdates}
                    back = {this.props.back}
                />
                <Alert {...this.state}
                  delete={this.deleteNode.bind(this)} />
            </div>
        )
    }

}

export default withRouter(UpdateNode)

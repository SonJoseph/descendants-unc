import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import Document from './Document'
import CreateRelationship from './CreateRelationship'

class CreateNode extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            name:'',
            birth:'',
            death:'',
            isRoot: this.props.isRoot,
            
            documents:[
                {
                    name : '',
                    link : ''
                }
            ],

            relnType:''
        }
    }

    updateRootInfo = (event) => {
        this.setState({
              [event.target.name]: event.target.value
        });
     }

     addDocument = () => {
       this.state.documents.push({
           name : '',
           link :''
       })
       this.setState({
           documents : this.state.documents
       })
     }

     deleteLastDocument = () => {
        this.state.documents.splice(this.state.documents.length-1, 1);
        this.setState({
            documents : this.state.documents
        })
     }

     updateDocument = (idx, key, val) => {
        this.state.documents[idx][key] = val
     }

     updateRelnForm = (val) =>{
        this.state.relnType = val
     }

    create = async() => {
        let person = {
            name: this.state.name,
            birth: this.state.birth,
            death: this.state.death,
            documents: this.state.documents,
        }
        if(this.state.isRoot){
            person['root'] = 1
        }
        let url = '/api/createnode/person='+JSON.stringify(person)
        let response = await fetch(url)
        let myJson = await response.json()
        
        if(this.state.isRoot){
            this.props.history.push({
                pathname: '/update',
                state: { family: myJson }
            })
        }else{
            /*
                Create the specified relationship to the newly created node
            */

            // get spouse id
            const response_spouse = await fetch('/api/getspouseid/nodeid=' + this.props.selectedID)
            const json_spouse = await response_spouse.json()
            let spouse_id = json_spouse['spouseId']

            url = '/api/createrelationship/newId='+myJson['id']+'&relnId='+this.props.selectedID+'&relnType='+this.state.relnType+'&spouseId='+spouse_id
            const response = await fetch(url)
            myJson = await response.json()

            this.props.refreshTree() // go back to 'view node' in lhs of UpdateTree
            this.props.back()
        }
    }
    render(){
        const Documents = []

        for(let i=0; i<this.state.documents.length; i++){
            console.log(this.state.documents[i].name + " : " + this.state.documents[i].link)
            Documents.push(<Document 
                idx = {i}
                initName = {this.state.documents[i].name}
                initLink = {this.state.documents[i].link}
                updateDocument = {this.updateDocument}
                // deleteDocument = {this.deleteDocument}
            />)
        }

        return(
            <div>
                <TextField label="Name" name='name' onChange={this.updateRootInfo}/>
                <TextField label="Birth Date" name='birth' type="date" InputLabelProps={{shrink: true,}} onChange={this.updateRootInfo}/>
                <TextField label="Death Date" name='death' type="date" InputLabelProps={{shrink: true,}} onChange={this.updateRootInfo}/>
                {Documents}
                <Button onClick={this.addDocument} variant="outlined" color="primary">Add New Document</Button>
                <Button onClick={this.deleteLastDocument}> Delete Last Document </Button>
                
                {
                    !this.state.isRoot && <CreateRelationship 
                        updateRelnForm = {this.updateRelnForm}
                        selectedName = {this.props.selectedJson['name']}
                        name = {this.state.name}
                    />
                }
                <Button onClick={this.create} variant="outlined" color="primary" label="Finish">
                    Create!
                </Button>
                {
                    !this.state.isRoot &&
                    <Button onClick={this.props.back}> Back </Button>
                }
            </div>
        )
    }

}

export default CreateNode

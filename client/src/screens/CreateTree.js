import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import Document from '../components/Document'

class CreateTree extends React.Component {

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
            ] 
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
        let url = '/api/createnodetest/person='+JSON.stringify(person)
        const response = await fetch(url)
        const myJson = await response.json()
        
        if(this.state.isRoot){
            this.props.history.push({
                pathname: '/update',
                state: { family: myJson }
            })
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
                {Documents}

                <Button onClick={this.addDocument} variant="outlined" color="primary">Add New Document</Button>
                <Button onClick={this.deleteLastDocument}> Delte Last Document </Button>

                <h1>Create Tree</h1>
                <h2>Specify Root Information</h2>
                <TextField label="Name" name='name' onChange={this.updateRootInfo}/>
                <TextField label="Birth Date" name='birth' type="date" InputLabelProps={{shrink: true,}} onChange={this.updateRootInfo}/>
                <TextField label="Death Date" name='death' type="date" InputLabelProps={{shrink: true,}} onChange={this.updateRootInfo}/>

                <Button onClick={this.create} variant="outlined" color="primary" label="Finish">
                    Create!
                </Button>
            </div>
        )
    }

}

export default CreateTree

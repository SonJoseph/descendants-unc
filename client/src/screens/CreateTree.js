import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import Document from '../components/Document'

class CreateTree extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            root_name:'',
            root_birth:'',
            root_death:'',
            
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

    // redirect to a new view for new tree
    createRoot = async () => {
        //instantiate new root in the database
        let person = {
            name: this.state.root_name,
            birth: this.state.root_birth,
            death: this.state.root_death,
            documents: this.state.root_documents
        }
        //let url = '/api/createroot/person='+JSON.stringify(person)
        let url = '/api/createroot/name='+person.name+'&birth='+person.birth
        const response = await fetch(url)
        const myJson = await response.json()

        this.props.history.push({
            pathname: '/update',
            state: { family: myJson }
        })
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
                <TextField label="Name" name='root_name' onChange={this.updateRootInfo}/>
                <TextField label="Birth Date" name='root_birth' type="date" InputLabelProps={{shrink: true,}} onChange={this.updateRootInfo}/>
                <TextField label="Death Date" name='root_death' type="date" InputLabelProps={{shrink: true,}} onChange={this.updateRootInfo}/>

                <div>

                >
                </div>

                <Button onClick={this.createRoot} variant="outlined" color="primary" label="Finish">
                    Create Tree!
                </Button>
            </div>
        )
    }

}

export default CreateTree

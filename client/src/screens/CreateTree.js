import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

class CreateTree extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            root_name:'',
            root_birth:'',
            root_death:'',
            root_doc_name:'',
            root_documents:[]
        }
    }

    updateRootInfo = (event) => {
        this.setState({
              [event.target.name]: event.target.value
       });
     }
  
     updateDocsArr = (event) => {
       this.state.root_documents.push({
         name: this.state.root_doc_name,
         link: this.state.root_doc_link
       })
       console.log(this.state.root_documents)
       // clear input fields
       this.cleanInput()
     }
  
  
     cleanInput = () => {
       const docNameField = document.getElementById('doc_name');
       const docLinkField = document.getElementById('doc_link');
         docNameField.value = ''
         docLinkField.value = ''
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
        return(
            <div>
                <h1>Create Tree</h1>
                <h2>Specify Root Information</h2>
                <TextField label="Name" name='root_name' onChange={this.updateRootInfo}/>
                <TextField label="Birth Date" name='root_birth' onChange={this.updateRootInfo}/>
                <TextField label="Death Date" name='root_death' onChange={this.updateRootInfo}/>

                <div>
                <TextField label="Document Name" name='root_doc_name' id="doc_name" onChange={this.updateRootInfo} />
                <TextField label="Document Link" name='root_doc_link' id="doc_link" onChange={this.updateRootInfo} />
                <Button onClick={this.updateDocsArr} variant="outlined" color="primary" label="AddDoc">Add This Document</Button>
                </div>

                <Button onClick={this.createRoot} variant="outlined" color="primary" label="Finish">
                    Create Tree!
                </Button>
            </div>
        )
    }

}

export default CreateTree
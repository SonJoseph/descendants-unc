import React from 'react'
import { Route , withRouter} from 'react-router-dom';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl';

import Document from './Document'
import CreateRelationship from './CreateRelationship'

class CreateNode extends React.Component {

    constructor(props){
        super(props)
        this.state = { /* If we are updating a node, initialize the form to the existing fields */
            name: this.props.isUpdate ? this.props.selectedJson['name'] : '',
            gender: this.props.isUpdate ? this.props.selectedJson['gender'] : '',
            birth: this.props.isUpdate ? this.props.selectedJson['birth'] : '',
            death: this.props.isUpdate ? this.props.selectedJson['death'] : '',
            moreinfo: this.props.isUpdate ? this.props.selectedJson['moreinfo'] : '',
            isRoot: this.props.isRoot,

            documents: this.props.isUpdate ? this.props.selectedJson['documents'] : [
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
            gender: this.state.gender,
            birth: this.state.birth,
            death: this.state.death,
            documents: this.state.documents,
            moreinfo: this.state.moreinfo
        }
        if(!this.props.isUpdate){
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
                this.props.back(false)
            }
        }else{
            person['id'] = this.props.selectedJson['id']
            this.props.updateNode(person)
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
                <TextField label="Name" name='name' onChange={this.updateRootInfo} defaultValue={this.state.name}/>

                <InputLabel id="demo-mutiple-name-label">Gender</InputLabel>
                <Select
                    name="gender"
                    onChange={this.updateRootInfo}
                    value={this.state.gender}
                    defaultValue={this.state.gender}
                >
                    <MenuItem value={'female'}>Female</MenuItem>
                    <MenuItem value={'male'}>Male</MenuItem>
                    <MenuItem value={'non-binary'}>NonBinary</MenuItem>
                    <MenuItem value={'unknown'}>Unknown</MenuItem>
                </Select>

                <TextField label="Birth Date" name='birth' type="date" InputLabelProps={{shrink: true,}} onChange={this.updateRootInfo} defaultValue={this.state.birth}/>
                <TextField label="Death Date" name='death' type="date" InputLabelProps={{shrink: true,}} onChange={this.updateRootInfo} defaultValue={this.state.death}/>
                <TextField id="outlined-multiline-static" name='moreinfo' label="More Information" 
                multiline rows="4" defaultValue="Add here..." variant="outlined" onChange={this.updateRootInfo} defaultValue={this.state.moreinfo}/>
                {Documents}
                <Button onClick={this.addDocument} variant="outlined" color="primary">Add New Document</Button>
                <Button onClick={this.deleteLastDocument}> Delete Last Document </Button>
                { /* create relationship option when we aren't creating a new root or updating */
                    !this.state.isRoot && !this.props.isUpdate && <CreateRelationship
                        updateRelnForm = {this.updateRelnForm}
                        selectedName = {this.props.selectedJson['name']}
                        name = {this.state.name}
                    />
                }
                <Button onClick={this.create} variant="outlined" color="primary" label="Finish">
                    {this.props.isUpdate ? 'Update' : 'Create'}
                </Button>
                { /* This button should appear when we are updating the tree */
                    !this.state.isRoot &&
                    <Button onClick={this.props.back}> Cancel </Button>
                }
                {
                    this.state.isRoot &&
                    <Button onClick={this.props.close}> Cancel </Button>
                }
            </div>
        )
    }

}

export default withRouter(CreateNode);

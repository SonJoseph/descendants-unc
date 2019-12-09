import React from 'react'
import { Route , withRouter} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Typography } from '@material-ui/core';

import Document from './Document'
import CreateRelationship from './CreateRelationship'
import '../css/CreateNode.css';

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
        if(!this.state.name){
          return
        }
        let person = {
            name: this.state.name,
            gender: this.state.gender,
            birth: this.state.birth,
            death: this.state.death,
            documents: this.state.documents,
            moreinfo: this.state.moreinfo
        }
        if(!this.props.isUpdate){
          let newRootWithReln = this.state.relnType === 'child';
            if(this.state.isRoot || newRootWithReln){
              /*
                We are creating a new tree from scratch
                  OR
                We are adding a new root whose child is the selectedID
              */
                person['root'] = 1
            }
            let url = '/api/createnode/person='+JSON.stringify(person)
            let response = await fetch(url)
            let myJson = await response.json()

            if(!this.state.isRoot){
                /*
                    Create the specified relationship to the newly created node
                */
                let spouse_id = 'undefined'
                if(!newRootWithReln){
                  const response_spouse = await fetch('/api/getspouseid/nodeid=' + this.props.selectedID)
                  const json_spouse = await response_spouse.json()
                  spouse_id = json_spouse['spouseId']

                  
                  url = '/api/createrelationship/newId='+myJson['utoid']+'&relnId='+this.props.selectedID+'&relnType='+this.state.relnType+'&spouseId='+spouse_id
                  const response = await fetch(url)
                  let createRelnJson = await response.json()

                  this.props.back(false, myJson['id'])

                  return
                }else{
                  // Make the new node the parent of the selected (in this case, that is the old root node)
                  url = '/api/createrelationship/newId='+this.props.selectedID+'&relnId='+myJson['id']+'&relnType=parent&spouseId='+spouse_id
                  
                  const response = await fetch(url)
                  let createRelnJson = await response.json()
                  this.props.changeRoot(myJson['id'])
                }
            }else{
              this.props.history.push({
                pathname: '/update',
                state: { family: myJson }
              })
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

                <Grid container spacing={2} direction="column" justify="center" alignItems="center" style={{marginTop: '10px', maxHeight: '100%', overflowX: 'hidden', overflowY: 'auto'}}>
                  <Grid item>
                  {this.props.isUpdate && <Typography variant='h4' style={{color: "#4253B8", marginLeft: '5px'}}>Editing {this.state.name}</Typography>}
                  {!this.props.isUpdate && !this.props.isRoot && <Typography variant='h4' style={{color: "#4253B8", marginLeft: '5px'}}>Adding Relative to {this.props.selectedJson['name']}</Typography>}
                  </Grid>

                  <Grid item style = {{margin: 8}}>
                        {
                            !this.state.isRoot && !this.props.isUpdate && <CreateRelationship
                            updateRelnForm = {this.updateRelnForm}
                            selectedName = {this.props.selectedJson['name']}
                            selectedIsRoot = {
                              this.props.selectedJson.hasOwnProperty('root') ? true : false
                            } // For adding parent to root
                            name = {this.state.name}
                        />
                        }
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2} direction="row">
                      <Grid item>
                        <TextField label="Name" name='name' variant="outlined" style={{marginTop: 8}} onChange={this.updateRootInfo}  defaultValue={this.state.name} error={this.state.name === ""}
                        helperText={this.state.name === "" ? 'Name Field Required' : ' '} />
                      </Grid>

                      <Grid item>
                        <FormControl variant="outlined" className="formControl">
                          <InputLabel>Gender</InputLabel>
                            <Select
                                name="gender"
                                onChange={this.updateRootInfo}
                                value={this.state.gender}
                                defaultValue={this.state.gender}
                                style={{marginTop: 8}}
                            >
                                <MenuItem value={'female'}>Female</MenuItem>
                                <MenuItem value={'male'}>Male</MenuItem>
                                <MenuItem value={'non-binary'}>NonBinary</MenuItem>
                                <MenuItem value={'unknown'}>Unknown</MenuItem>
                            </Select>
                            <FormHelperText>Please select a gender here.</FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={2} direction="row">
                      <Grid item>
                        <TextField label="Birth Date" name='birth' type="date" variant="outlined" InputLabelProps={{shrink: true,}} onChange={this.updateRootInfo} defaultValue={this.state.birth}/>
                      </Grid>
                      <Grid item>
                        <TextField label="Death Date" name='death' type="date" variant="outlined" InputLabelProps={{shrink: true,}} onChange={this.updateRootInfo} defaultValue={this.state.death}/>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField id="outlined-multiline-static" name='moreinfo' label="Add more information here..." multiline rows="4"
                    variant="outlined" style={{ margin: 8 }} fullWidth onChange={this.updateRootInfo} defaultValue={this.state.moreinfo} style={{width: 400}}/>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container direction="column" alignItems="center">
                      <Grid item>
                        <h3>Add your documents (if any) here:</h3>
                      </Grid>

                      <Grid item>
                        {Documents}
                      </Grid>

                      <Grid item style={{ margin: 8 }}>
                        <ButtonGroup size="small" aria-label="small outlined button group" color="primary">
                          <Button onClick={this.addDocument} variant="contained">Add New Doc</Button>
                          <Button onClick={this.deleteLastDocument}> Delete Last Doc </Button>
                          </ButtonGroup>
                      </Grid>



                    </Grid>
                  </Grid>


                <Grid item>
                  <Button onClick={this.create} variant="contained" color="secondary" size="large" label="Finish"  style={{ margin: 8 }}>
                      {this.props.isUpdate ? 'Update' : 'Create'}
                  </Button>
                  {
                      !this.state.isRoot &&
                      <Button onClick={this.props.back} variant="outlined" color="secondary" size="large" label="Finish"  style={{ margin: 8 }}> Cancel </Button>
                  }
                  {
                      this.state.isRoot &&
                      <Button onClick={this.props.close} variant="outlined" color="secondary" size="large" label="Finish"  style={{ margin: 8 }}> Cancel </Button>
                  }

                </Grid>
                </Grid>
          </div>
        )
    }

}

export default withRouter(CreateNode);

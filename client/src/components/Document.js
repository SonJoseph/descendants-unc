import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

class Document extends React.Component {

    constructor(props){
        super(props)
        
        this.idx = this.props.idx
    }

    update = (e) => {
        this.props.updateDocument(this.idx, e.target.name, e.target.value)
    }

    delete = () => {
        this.props.deleteDocument(this.idx)
    }

    render(){
        
        return(
            <div>
                <TextField label="Document Name" name='name' onChange={this.update} defaultValue={this.props.initName}/>
                <TextField label="Document Link" name='link' onChange={this.update} defaultValue={this.props.initLink}/>
                {/* <Button onClick={this.delete}> Delete </Button> */}
            </div>
        )
    }
    
}

export default Document
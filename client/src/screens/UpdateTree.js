import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'

class UpdateTree extends React.Component {    
    /*
        A form to create a node
    */
    constructor(props){
        super(props)
        this.state = {
            family : props.location.state.family,
            name : ''
        }
    }

    createNode = async () => {
        const response = await fetch('/api/gettree/' + this.state.family) 
        const myJson = await response.json()
        console.log(myJson)
        // this.setState({message : myJson})
    }

    handleChange = (e) => {
        this.setState({
            name : e.target.value
        })
    }

    render() {
        return (
            <Container>
                {this.state.family}
                <TextField
                    label="Name"
                    value={this.state.name}
                    onChange={this.handleChange}
                />
                <Button onClick={this.createNode}>Create Node</Button>
            </Container>
        )
    }
}

export default UpdateTree
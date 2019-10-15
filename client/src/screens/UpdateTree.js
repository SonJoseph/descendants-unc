import React from 'react'

// const request = require('request')

class UpdateTree extends React.Component {    
    constructor(props){
        super(props)
        this.state = {
            message : ''
        }
    }
    createNode = async () => { // async allows this function to be called asynchronously 
        const response = await fetch('/api/createnode') //  await allows us to wait for the response of an asynchronous request.
        const myJson = await response.json()
        this.setState({message : myJson})
    }

    render() {
        return (
            <div>
                <button onClick={this.createNode}>Create Node </button>
                {this.state.message}
            </div>
        )
    }
}

export default UpdateTree
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
        const response = await fetch('/api/createnode') // await allows us to wait for the response of an asynchronous request.
        // const myJson = await response.json()
        // console.log(myJson)
        // this.setState({message : myJson})
    }

    getNodes = async () => { 
        const response = await fetch('/api/getnodes') 
        const myJson = await response.json()
        console.log(myJson.names) // This is an array of node names
    }

    render() {
        return (
            <div>
                <button onClick={this.getNodes}>Get Nodes</button>
                {this.state.message}
            </div>
        )
    }
}

export default UpdateTree
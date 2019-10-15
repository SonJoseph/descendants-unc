import React from 'react'

class SelectTree extends React.Component {
    /*
        Load the client with a list of the avaialble family trees.
    */

    constructor(props){
        super(props)
        this.state = {
            names : []
        }
    }

    getNodes = async () => { 
        const response = await fetch('/api/getnodes') 
        const myJson = await response.json()
        this.setState({names : myJson.names}) // This is an array of node names ["Joseph", "Jade"]
        console.log(this.state.names)
    }

    componentDidMount() {
        //this.setState({trees : getNodes})
    }

    render() {
        return (
            <div>
                <h1>Select tree</h1>
            </div>
        )
    }
}

export default SelectTree
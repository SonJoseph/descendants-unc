import React from 'react'

class SelectTree extends React.Component {
    /*
        Load the client with a list of the avaialble family trees.
    */

    getNodes = async () => { 
        const response = await fetch('/api/getnodes') 
        const myJson = await response.json()
        console.log(myJson.names) // This is an array of node names
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
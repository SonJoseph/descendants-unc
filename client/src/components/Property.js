/*
    Using this to display a field of a node
*/
import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import ViewDocument from '../components/ViewDocument'


class Property extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isDocument : this.props.k === 'documents'
        }
    }

    render() {
        let Display = this.props.k + ': ' + this.props.val // this.props.val is an array
        if(this.props.k === 'documents'){

            Display = []
            for(let i=0; i<this.props.val.length; i++){
                let key = this.props.val[i]['name']
                let val = this.props.val[i]['link']

                Display.push(
                    <ViewDocument
                        k = {key}
                        val = {val}
                    />
                )
            }
        }
        return(
            <ListItem>
                <ListItemText>
                    {
                        this.state.isDocument && <div> Documents </div>
                    }
                    {
                        Display
                    }
                </ListItemText>
            </ListItem>
        )
    }
}

export default Property

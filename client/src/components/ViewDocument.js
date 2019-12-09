/*
    Using this to display documents and make them clickable
*/
import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'


class ViewDocument extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        return(
            <ListItem>
                <ListItemText>
                    {this.props.k + " : "} <a href={this.props.val}> {this.props.val} </a>
                </ListItemText>
            </ListItem>
        )
    }   
}

export default ViewDocument
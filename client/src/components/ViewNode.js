import React from 'react'
import Button from '@material-ui/core/Button'
import { List, ListItem, ListItemText } from '@material-ui/core'

class ViewNode extends React.Component {

    constructor(props) {
        super(props)
    }


    render(){
        return(
            <div>
                <div>View</div>
                <List id="viewNodeInfo">
                    {
                        this.props.selectedArr.map(
                            (item) =>
                                    <ListItem>
                                        <ListItemText>
                                            {item[0] + ': ' + item[1]}
                                    </ListItemText>
                                </ListItem>
                        )
                    }
                </List>
                <Button onClick={this.props.edit}> Edit </Button>
                <Button onClick={this.props.add}> Add node </Button>
            </div>           
        )
    }
}

export default ViewNode
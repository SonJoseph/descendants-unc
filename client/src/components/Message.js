import React from 'react'
import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';


class Message extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
              <Grid style = {{margin:15}}>
                <Typography variant="h5">
                    {this.props.message}
                </Typography>
              </Grid>
        )
    }
}

export default Message

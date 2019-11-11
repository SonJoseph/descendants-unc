import Button from '@material-ui/core/Button'
import React from 'react'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

class Home extends React.Component {
  render() {
      return (
         <div>
           <Link to = "/select" >
             <Button  variant="outlined" color="primary" > View A Tree  </Button>
           </Link>
         </div>
      )
   }
}

export default Home

import Button from '@material-ui/core/Button'
import React from 'react'
import { Link } from 'react-router-dom'

function App() {
  return  <div>
	  	<h1> The Descendants Project </h1>

        <Link to = "/select" >
          <Button  variant="outlined" color="primary" > View A Tree  </Button>
        </Link>

	</div>
}

export default App;

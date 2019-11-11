import Button from '@material-ui/core/Button'
import React from 'react'

import SelectTree from './screens/SelectTree'
import UpdateTree from './screens/UpdateTree'
import Home from './Home'

import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

function App() {
  return  <div>
	  	<h1> The Descendants Project </h1>
      <Router>
          <div>
              <Route exact path="/" component={Home} />
              <Route path="/select" component={SelectTree} />
              <Route path="/update" component={UpdateTree} />
          </div>
      </Router>
      )

	</div>
}

export default App;

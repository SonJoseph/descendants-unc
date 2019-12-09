import Button from '@material-ui/core/Button'
import React from 'react'
import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';

/* Screens */
import SelectTree from './screens/SelectTree'
import UpdateTree from './screens/UpdateTree'
/* Routing */
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import Cookies from 'universal-cookie'

function App() {
    const cookies = new Cookies();
    const uuidv1 = require('uuid/v1')
    cookies.set('SESSION_ID', uuidv1(), { path: '/' });

    return  <div>
      <Router>
          <div>
              <Route exact path="/" component={SelectTree} />
              <Route path="/update" component={UpdateTree} />
          </div>
      </Router>

	</div>
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Movies from './Movies';
import * as serviceWorker from './serviceWorker';
import { Switch, Route,BrowserRouter } from 'react-router-dom';


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/movies/:movie" component={Movies}/>
      <Route path="/:page" component={Movies}/>
      <Route
        path="/"
        component={Movies}
      />
    </Switch>

  </BrowserRouter>,
  document.getElementById('root')
);





// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

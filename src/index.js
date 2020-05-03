import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Movies from './Movies';
import * as serviceWorker from './serviceWorker';
import { Switch, Route,BrowserRouter,Redirect } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>

    <Route path="/:id" render = {()=> (<p> I want this text to show up for all routes other than '/', '/products' and '/category' </p>)}/>
    <Route
      path="/"
      component={Movies}
    />


  </BrowserRouter>,
  document.getElementById('root')
);





// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

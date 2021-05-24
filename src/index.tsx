import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom'


/**
 * Renders App tree
 */
ReactDOM.render(
  <Router>
    <App />
  </Router> ,
  document.getElementById('root')
);

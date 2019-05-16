import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router} from 'react-router-dom'

const initialState = {
    user: "",
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case "NEW_USER":
            return {
                ...state, user: action.payload
            }
        case "LOG_OUT":
            return {
                ...state, user: ""
            }
            default:
                return state

    }
}

const store = createStore(reducer);

ReactDOM.render(  
  <Router><Provider store={store}>    
    <App />    
  </Provider></Router>
,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

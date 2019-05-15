import React from 'react';
import './App.css';
import MainContainer from './containers/MainContainer'
import { connect } from 'react-redux';

function App(props) {

  function test(){
    // let url = 'https://cloud.iexapis.com/stable/stock/fb/quote?token=pk_3d2d0ca1d6224b5da4270b1ff4414d01'
    let users = 'http://localhost:3000/users'
    fetch(users)
      .then(res => res.json())
  } 

  return (
    <div className="App">
    {console.log(props.user)}
      <header className="App-header">
       {test()}
       <MainContainer />
      </header>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
};

export default connect(mapStateToProps)(App);




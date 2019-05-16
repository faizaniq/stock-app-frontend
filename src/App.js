import React from 'react';
import './App.css';
import MainContainer from './containers/MainContainer'
import { connect } from 'react-redux';

class App extends React.Component {

  componentDidMount() {
    const token = localStorage.getItem("token")
    if (token) {
      fetch('http://localhost:3000/auto_login', {
          method: 'GET',
          headers: {
            Authorization: token
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.errors) {
              alert(data.errors)
          } else {
            this.props.dispatch({
                type: "NEW_USER",
                payload: data
            })
         }
      })
    }
  }

  render(){
    return (
      <div className="App">
      {console.log(this.props.user)}
        <header className="App-header">
          <MainContainer />
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
};

export default connect(mapStateToProps)(App);




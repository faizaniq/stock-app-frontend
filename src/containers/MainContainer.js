import React from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import NavBar from '../components/NavBar'
import Home from '../components/Home'
import Profile from '../components/Profile'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'



class MainContainer extends React.Component {

    render() {
        return (
           <div>
               maincontainer
               <NavBar />
               <Route exact path="/home" component= {Home}/>
               <Route exact path={`/${this.props.user.id}/profile`} component= {Profile}/>
               <Route exact path="/login" component= {Login } /> 
               <Route exact path="/signup" component= {Signup} /> 
           </div> 

        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(MainContainer)
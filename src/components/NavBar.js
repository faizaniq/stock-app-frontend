import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';


function NavBar(props){
    {console.log(props.user)}
    return(
        <div>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
            <NavLink to={`/${props.user.id}/profile`}>Profile</NavLink>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(NavBar)
import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';


function NavBar(props){

    function logout(){
        props.dispatch({
            type: "LOG_OUT"
        })
        localStorage.removeItem("token")
    }

    return(
        <div className="ui fluid five item inverted menu">
            <NavLink className="item" to="/home">Home</NavLink>
            <NavLink className="item" to="/research">Research</NavLink>
            {props.user ? null : <NavLink className="item" to="/login" >Login</NavLink>}
            {props.user ? null : <NavLink className="item" to="/signup" >Signup</NavLink>}
            {props.user ? <NavLink className="item" to={`/${props.user.id}/myportfolio`} > My Portfolio</NavLink> : null}
            {props.user ? <NavLink className="item" to={`/${props.user.id}/watchlists`} > Watchlists </NavLink> : null}
            {props.user ? <NavLink className="item" to="/home" onClick={logout}>Logout</NavLink> : null}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(NavBar)
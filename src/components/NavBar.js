import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';


function NavBar(props){

    function logout(){
        console.log(props)
        props.dispatch({
            type: "LOG_OUT"
        })
        localStorage.removeItem("token")
    }


    {console.log(props)}
    return(
        <div>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/research">Research</NavLink>
            {props.user ? null : <NavLink to="/login" >Login< /NavLink>}
            {props.user ? null : <NavLink to="/signup" >Signup< /NavLink>}
            {props.user ? <NavLink to={`/${props.user.id}/myportfolio`} > My Portfolio< /NavLink> : null}
            {props.user ? <NavLink to={`/${props.user.id}/watchlists`} > Watchlists < /NavLink> : null}
            {props.user ? <NavLink to="/home" onClick={logout}>Logout</NavLink> : null}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(NavBar)
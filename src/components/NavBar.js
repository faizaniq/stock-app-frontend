import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';

class NavBar extends React.Component{

    state = { 
        activeItem: 'home' 
    }


    logout = () => {
        this.props.dispatch({
            type: "LOG_OUT"
        })
        localStorage.removeItem("token")
    }
 
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render(){
        const { activeItem } = this.state
        return(
        
            <div className="ui pointing menu bar">
                <NavLink className="item" to="/"><img src="/Logo.png" /></NavLink>
                <NavLink className="item" to="/home">Home</NavLink>
                {this.props.user ? null : <NavLink className="item" to="/login" >Login</NavLink>}
                {this.props.user ? null : <NavLink className="item" to="/signup" >Signup</NavLink>}
                {this.props.user ? <NavLink className="item" to={`/${this.props.user.id}/myportfolio`} > My Portfolio</NavLink> : null}
                {this.props.user ? <NavLink className="item" to="/home" onClick={this.logout}>Logout</NavLink> : null}
            </div>
            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(NavBar)
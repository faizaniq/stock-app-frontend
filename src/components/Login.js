import React from 'react'
import { connect } from 'react-redux';

class Login extends React.Component{

    state={
        username: '',
        password: ''
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value  
        })
    }

    submitHandler = (e) => {
        e.preventDefault()
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json",
            },
            body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(data => {
            this.props.dispatch({
                type: "NEW_USER",
                payload: data.user
            })
        localStorage.setItem("token", data.token)
        this.props.history.push('/home')
        }) 
        this.setState({
            username: '',
            password: ''
        })
    }

    render(){
        return(
            <div>
                Login Here
                <form onSubmit={this.submitHandler}>
                    <input placeholder="Username" name="username" onChange={this.changeHandler} value={this.state.username} type="text" />
                    <input placeholder="Password" name="password" onChange={this.changeHandler} value={this.state.password} type="password" />
                    <button type="submit">Login</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(Login)
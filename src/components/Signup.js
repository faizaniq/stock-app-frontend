import React from 'react'
import { connect } from 'react-redux';

class Signup extends React.Component {

    state = {
        name: '',
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
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json",
            },
            body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('token', data.token)
            this.props.dispatch({
                type: "NEW_USER",
                payload: data.user
            })
        })
        this.setState({
            name: '',
            username: '',
            password: ''
        })
    }

    render() {
        return (
            <div>
                Signup
                <form onSubmit={this.submitHandler}>
                    <input placeholder="Name" name="name" onChange={this.changeHandler} value={this.state.name} type="text" />
                    <input placeholder="Username" name="username" onChange={this.changeHandler} value={this.state.username} type="text" />
                    <input placeholder="Password" name="password" onChange={this.changeHandler} value={this.state.password} type="password" />
                    <button type="submit">Signup</button>
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

export default connect(mapStateToProps)(Signup)
import React from 'react'
import { connect } from 'react-redux';
import { Button, Form, Grid } from 'semantic-ui-react'

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
            localStorage.setItem("token", data.token)
            this.props.history.push('/home')
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
            <React.Fragment>
            <img src= "./Logo.png" width="10%" style={{marginLeft: "40%", marginBottom: 0}}/>
            <Grid style={{marginTop: "5%", border: "2px solid gray", width: "40%", marginLeft: "25%"}}>
                <Grid.Column width={8} className='ui centered'>
                     <Form onSubmit={this.submitHandler}>
                        <Form.Field>
                        <label>Name</label>
                        <input placeholder="Name" name="name" onChange={this.changeHandler} value={this.state.name} type="text" />
                        </Form.Field>
                        <Form.Field>
                        <label>Username</label>
                        <input placeholder="Username" name="username" onChange={this.changeHandler} value={this.state.username} type="text" />
                        </Form.Field>
                        <Form.Field>
                        <label>Password</label>
                        <input placeholder="Password" name="password" onChange={this.changeHandler} value={this.state.password} type="password" />
                        </Form.Field>
                        <Button type='submit'>Signup</Button>
                    </Form>
                </Grid.Column>
            </Grid>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(Signup)
import React from 'react'
import { connect } from 'react-redux';
import { Button, Form, Grid } from 'semantic-ui-react'


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
            <React.Fragment>
            <img src= "./Logo.png" width="10%" style={{marginLeft: "40%", marginBottom: 0}}/>
            
            <Grid style={{marginTop: "5%", border: "2px solid gray", width: "40%", marginLeft: "25%"}}>
                <Grid.Column width={8} className='ui centered'>
                     <Form onSubmit={this.submitHandler}>
                        <Form.Field>
                        <label>Username</label>
                        <input placeholder='Username' name="username" onChange={this.changeHandler} value={this.state.username} style={{width: "100%"}}/>
                        </Form.Field>
                        <Form.Field>
                        <label>Password</label>
                        <input placeholder='Password' name="password" onChange={this.changeHandler} value={this.state.password}/>
                        </Form.Field>
                        <Button type='submit'>Submit</Button>
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

export default connect(mapStateToProps)(Login)
import React from 'react'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'
import { arrayExpression } from '@babel/types';
import { log } from 'util';
import { Line } from 'react-chartjs-2'




class MyPortfolio extends React.Component {

    state={
        funds: ""
    }

    onChange = (e) => {
        this.setState({
            funds: e.target.value
        })
    }

    addFunds = (e) => {
        e.preventDefault()
        fetch(`http://localhost:3000/users/${this.props.user.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                funds: (+this.props.user.funds + +this.state.funds)
            })
        })
        .then(res => res.json())
        .then(data => {
            this.props.dispatch({
                type: "ADD_FUNDS",
                payload: data.funds
            })
        })
        this.setState({
            funds: ""
        })
    }
    
    totalInvestments = () => {
        // debugger
        // const reducer = (accumulator, currentValue) => accumulator + currentValue
        // const array = this.props.user.investments.map(s => s.price)
        // return Number.parseFloat(array.reduce(reducer)).toFixed(2)
        return Number.parseFloat(this.props.user.investments.map(s => s.price).reduce((accumulator, currentValue) => accumulator + currentValue)).toFixed(2)
    }


    render() {
        console.log(this.props.user.investments)
        return (
           <div>
                Name: {this.props.user.name}
                <br/>
                Cash Available: {
                    this.props.user.funds ? Number.parseFloat(this.props.user.funds).toFixed(2) : 0
                }
                <form >
                    <input type="text" onChange={this.onChange} value={this.state.funds}/>
                    <button onClick={this.addFunds}>Add Funds</button>
                </form>
                Total Investment Value:  {this.props.user.investments.length > 0 ? this.totalInvestments() : 0}
                <br/>
                Total Portfolio Value: {
                    this.props.user.investments.length > 0 ? +this.totalInvestments() + +this.props.user.funds : Number.parseFloat(this.props.user.funds).toFixed(2)
                }
                <br/>
           </div> 

        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(MyPortfolio)
import React from 'react'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'
import Stock from './Stock';
import { all } from 'q';
import { thisExpression } from '@babel/types';
import { arrayExpression } from '@babel/types';
import { log } from 'util';
import { Line } from 'react-chartjs-2'




class MyPortfolio extends React.Component {

    state={
        funds: "",
        portfolio: "",
        ticker: "",
        quantity: ""
    }

    componentDidMount() {
        let portfolio = []
        let promisePortfolio = this.props.user.investments.map(s => {
            return fetch(`https://api.iextrading.com/1.0/stock/${s.ticker}/price`)
            .then(res => res.json())
            .then(data => {
                portfolio.push({price: Number.parseFloat(data).toFixed(2), quantity: s.quantity})
            })
        })

        Promise.all(promisePortfolio)
        .then(() => this.setState({portfolio: portfolio}))
    }

    fundHandler = (e) => {
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
        return Number.parseFloat(this.props.user.investments.map(s => (s.price*s.quantity)).reduce((accumulator, currentValue) => accumulator + currentValue)).toFixed(2)
    }



    totalPortfolio = () => {
        return +this.totalInvestments() + +this.props.user.funds 
    }
// 
    currentPortfolioValue = () => {
        if (this.state.portfolio.length > 0) {
            let investments = Number.parseFloat([...this.state.portfolio].map(s => (s.price * s.quantity)).reduce((accumulator, currentValue) => accumulator + currentValue)).toFixed(2)
            return (Number.parseFloat(+this.props.user.funds + +investments).toFixed(2))
        }
    }

    checkValue = () => {
        let portfolio = []
        let promisePortfolio = this.props.user.investments.map(s => {
            return fetch(`https://api.iextrading.com/1.0/stock/${s.ticker}/price`)
            .then(res => res.json())
            .then(data => {
                portfolio.push({price: Number.parseFloat(data).toFixed(2), quantity: s.quantity})
            })
        })

        Promise.all(promisePortfolio)
        .then(() => this.setState({portfolio: portfolio}))
    }

    tradeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    sell = () => {
        let investments = []
        let q = this.state.quantity
        this.props.user.investments.forEach(s => {
            if (s.ticker === this.state.ticker.toUpperCase() && s.quantity < q && q > 0) {
                q = q - s.quantity
                investments.push({...s, quantity: 0})
            }  else if (s.ticker === this.state.ticker.toUpperCase() && s.quantity >= q && q > 0) {
                investments.push({...s,quantity: s.quantity - q})
                q = 0
            } else {
                investments.push(s)
            }
        })
        console.log(investments)
        
    }


    render() {
        this.sell()
        return (
           <div>
                Name: {this.props.user.name}
                <br/>
                Cash Available: {
                    this.props.user.funds ? Number.parseFloat(this.props.user.funds).toFixed(2) : 0
                }
                <form >
                    <input type="text" onChange={this.fundHandler} value={this.state.funds}/>
                    <button onClick={this.addFunds}>Add Funds</button>
                </form>
                Total Investment Value:  {this.props.user.investments.length > 0 ? this.totalInvestments() : 0}
                <br/>
                Original Portfolio Value: {
                    this.props.user.investments.length > 0 ? this.totalPortfolio() : Number.parseFloat(this.props.user.funds).toFixed(2)
                }
                <br/>
                Current Portfolio Value: {this.currentPortfolioValue()} <button onClick={this.checkValue}>Update</button>
                <br/>
                Percent Gain / Loss: {
                    ((this.currentPortfolioValue() - this.totalPortfolio()) / this.totalPortfolio() * 100 + "%") 
                }
                 <form >
                    <input type="text" onChange={this.tradeHandler} name="ticker" value={this.state.ticker} placeholder="ticker"/>
                    <input type="integer" onChange={this.tradeHandler} name="quantity" value={this.state.quantity} placeholder="quantity"/>
                    <button onClick={this.addFunds}>Sell</button>
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


export default connect(mapStateToProps)(MyPortfolio)
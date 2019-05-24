import React from 'react'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'
import Stock from './Stock';




class MyPortfolio extends React.Component {
    state={
        funds: "",
        portfolio: "",
        ticker: "",
        quantity: "",
        stock: {},
        profit: [],
        interval: false
    }

    check = null

    componentDidMount() {
        let portfolio = []
        let promisePortfolio = this.props.user.investments.map(s => {
            if (s.purchase === true) {
                return fetch(`https://api.iextrading.com/1.0/stock/${s.ticker}/price`)
                .then(res => res.json())
                .then(data => {
                    portfolio.push({price: Number.parseFloat(+data).toFixed(2), quantity: s.current_quantity})
                })
            }
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
                funds: (+this.props.user.funds + +this.state.funds),
                original_funds: (+this.props.user.original_funds + +this.state.funds)
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("adding funds", data)
            this.props.dispatch({
                type: "ADD_FUNDS",
                payload: data.funds
            })
            this.props.dispatch({
                type: "ADD_TO_TOTAL_FUNDS",
                payload: data.original_funds
            })
        })
        this.setState({
            funds: ""
        })
    }
    
    totalInvestments = () => {
        if (this.props.user.investments.length === 0) {
            return 0 
        } else {
            let total = 0
            this.props.user.investments.map(s => {
                if (s.purchase === true) {
                    total = (total + (s.price * s.current_quantity))
                }
            })
        return total.toFixed(2)
        }
    }


    totalPortfolio = () => {
        return +this.totalInvestments() + +this.props.user.funds 
    }

    currentPortfolioValue = () => {
        if (this.state.portfolio.length > 0) {
            let total = 0
            this.state.portfolio.map(s => {
                total = +this.props.user.funds + (+s.price * +s.quantity)
            })
            return total.toFixed(2)
        } else {
            return +this.props.user.funds.toFixed(2)
        }
    }

    checkValue = () => {
        console.log("interval")
        let portfolio = []
        let promisePortfolio = this.props.user.investments.map(s => {
            if (s.purchase === true) {
                return fetch(`https://api.iextrading.com/1.0/stock/${s.ticker}/price`)
                .then(res => res.json())
                .then(data => {
                    portfolio.push({price: Number.parseFloat(data).toFixed(2), quantity: s.current_quantity})
                })
            }
        })

        Promise.all(promisePortfolio)
        .then(() => this.setState({portfolio: portfolio}))
    }

    intervalHandler = () => {
        this.setState({
            interval: !this.state.interval
        })
    }

    tradeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    intervalStart = () => {
        console.log('I am being called')
        if (this.state.interval && !this.check){
            console.log('setting interval')
            this.check = setInterval(this.checkValue, 3000)
        } else if(!this.state.interval && this.check) {
            console.log('removing interval')
            clearInterval(this.check)
            this.check = null
        }
    }


    sell = (e) => {
        e.preventDefault()
        fetch(`https://api.iextrading.com/1.0/stock/${this.state.ticker}/quote`)
        .then(res => res.json())
        .then(stock => this.setState({
            stock: stock
        },() => {
            fetch(`http://localhost:3000/sell`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: this.state.stock.companyName,
                    price: Number.parseFloat(this.state.stock.latestPrice).toFixed(2),
                    ticker: this.state.stock.symbol,
                    current_quantity: this.state.quantity,
                    user_id: this.props.user.id
                }),
            })
            .then(res => res.json())
            .then(data => {
                console.log("in .then", data)
                this.props.dispatch({
                    type: "SELL_STOCK",
                    payload: data
                })
            })
        }))
       
    }


    render() {
        console.log(this.state.interval)
        return (
           <div>
               {this.intervalStart()}
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
                    Number.parseFloat(this.props.user.original_funds).toFixed(2)
                }
                <br/>
                Current Portfolio Value: {this.currentPortfolioValue()} <button onClick={this.intervalHandler}>Update</button>
                <br/>
                Percent Gain / Loss: {
                    (((+this.currentPortfolioValue() - +this.totalPortfolio()) / +this.totalPortfolio()) * 100).toFixed(6) + "%"
                }
                 <form >
                    <input type="text" onChange={this.tradeHandler} name="ticker" value={this.state.ticker} placeholder="ticker"/>
                    <input type="integer" onChange={this.tradeHandler} name="quantity" value={this.state.quantity} placeholder="quantity"/>
                    <button onClick={this.sell}>Sell</button>
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
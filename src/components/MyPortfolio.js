import React from 'react'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { Polar } from 'react-chartjs-2'


class MyPortfolio extends React.Component {
    state={
        funds: "",
        portfolio: "",
        ticker: "",
        quantity: "",
        stock: {},
        profit: [],
        interval: false,
        data: [],
        labels: [],
        datasets: {}
    }

    check = null

    componentDidMount() {
        let portfolio = []
        console.log(this.props.user.investments)
        let promisePortfolio = this.props.user.investments.map(s => {
            if (s.purchase === true && s.current_quantity > 0) {
                this.setState(prevState => ({
                    data: [...prevState.data, (s.current_quantity * s.price)],
                    labels: [...prevState.labels, s.ticker]
                }))
                return fetch(`https://api.iextrading.com/1.0/stock/${s.ticker}/price`)
                .then(res => res.json())
                .then(data => {
                    portfolio.push({company: s.company, ticker: s.ticker, costBasis: s.price, price: Number.parseFloat(+data).toFixed(2), quantity: s.current_quantity})
                })
            }
        })
        Promise.all(promisePortfolio)
        .then(() => this.setState({portfolio: portfolio.sort()}))
        .then(() => {
            this.setState({
                datasets: {
                        labels: [...this.state.labels, "Cash"],
                        datasets: [{
                            label: "Latest Price",
                            backgroundColor: "rgba(75,192,192,1)",
                            data: [...this.state.data, this.props.user.funds] 
                        }]
                }
            })
        })
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
        }, () => {
            this.setState({
                datasets: {
                    labels: [...this.state.labels, "Cash"],
                    datasets: [{
                        label: "Latest Price",
                        backgroundColor: "rgba(75,192,192,1)",
                        data: [...this.state.data, this.props.user.funds]
                    }]
                }
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
                total = total + (+s.price * +s.quantity)
            })
            return (total + +this.props.user.funds).toFixed(2)
        } else {
            return +this.props.user.funds.toFixed(2)
        }
    }

    checkValue = () => {
        let portfolio = []
        let promisePortfolio = this.props.user.investments.map(s => {
            if (s.purchase === true) {
                return fetch(`https://api.iextrading.com/1.0/stock/${s.ticker}/price`)
                .then(res => res.json())
                .then(data => {
                    portfolio.push({company: s.company, ticker: s.ticker, costBasis: Number.parseFloat(s.price).toFixed(2), price: Number.parseFloat(data).toFixed(2), quantity: s.current_quantity})
                })
            }
        })
        Promise.all(promisePortfolio)
        .then(() => this.setState({portfolio: portfolio.sort()}))
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
        if (this.state.interval && !this.check){
            this.check = setInterval(this.checkValue, 3000)
        } else if(!this.state.interval && this.check) {
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
                this.props.dispatch({
                    type: "SELL_STOCK",
                    payload: data
                })
            })
        }))
    }

    showStocks = () => {
        let totalPValue = 0
        let totalCValue = 0
            return( 
                <Table celled>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Company</Table.HeaderCell>
                        <Table.HeaderCell>Ticker</Table.HeaderCell>
                        <Table.HeaderCell>Current Price</Table.HeaderCell>
                        <Table.HeaderCell>Cost Basis</Table.HeaderCell>
                        <Table.HeaderCell>Gain/Loss</Table.HeaderCell>
                        <Table.HeaderCell>% Change</Table.HeaderCell>
                        <Table.HeaderCell>Current Holdings</Table.HeaderCell>
                        <Table.HeaderCell>Current Value</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.portfolio.map(s => {
                            totalPValue = (totalPValue + (s.price * s.quantity))
                            totalCValue = (totalCValue + (s.costBasis * s.quantity))
                            if (s.costBasis < s.price) {

                        return( < Table.Row positive >
                                    <Table.Cell>{s.company}</Table.Cell>
                                    <Table.Cell>{s.ticker}</Table.Cell>
                                    <Table.Cell>${s.price}</Table.Cell>
                                    <Table.Cell>${s.costBasis}</Table.Cell>
                                    <Table.Cell>${Number.parseFloat(s.price - s.costBasis).toFixed(2)}</Table.Cell>
                                    <Table.Cell>+{Number.parseFloat(((s.price - s.costBasis) / s.costBasis)).toFixed(4)}%</Table.Cell>
                                    <Table.Cell>{s.quantity}</Table.Cell>
                                    <Table.Cell>${(s.quantity * s.price)}</Table.Cell>
                                </Table.Row>)
                            } else if (s.costBasis === s.price) {
                        return(  < Table.Row>
                                    <Table.Cell>{s.company}</Table.Cell>
                                    <Table.Cell>{s.ticker}</Table.Cell>
                                    <Table.Cell>${s.price}</Table.Cell>
                                    <Table.Cell>${s.costBasis}</Table.Cell>
                                    <Table.Cell>${Number.parseFloat(s.price - s.costBasis).toFixed(2)}</Table.Cell>
                                    <Table.Cell>{Number.parseFloat(((s.price - s.costBasis) / s.costBasis)).toFixed(4)}</Table.Cell>
                                    <Table.Cell>{s.quantity}</Table.Cell>
                                    <Table.Cell>${(s.quantity * s.price)}</Table.Cell>
                                </Table.Row>) 
                            } else {
                        return(  < Table.Row negative>
                                    <Table.Cell>{s.company}</Table.Cell>
                                    <Table.Cell>{s.ticker}</Table.Cell>
                                    <Table.Cell>${s.price}</Table.Cell>
                                    <Table.Cell>${s.costBasis}</Table.Cell>
                                    <Table.Cell>${Number.parseFloat(s.price - s.costBasis).toFixed(2)}</Table.Cell>                                    
                                    <Table.Cell>{Number.parseFloat(((s.price - s.costBasis) / s.costBasis)).toFixed(4)}%</Table.Cell>
                                    <Table.Cell>{s.quantity}</Table.Cell>
                                    <Table.Cell>${(s.quantity * s.price)}</Table.Cell>

                                </Table.Row>)
                            }
                        })
                    }
                    <Table.Row>
                            <Table.Cell>Cash Available</Table.Cell>
                            <Table.Cell>${Number.parseFloat(this.props.user.funds).toFixed(2)}</Table.Cell>
                            <Table.Cell>Current Invested Value</Table.Cell>
                            {totalCValue > totalPValue ? <Table.Cell negative>${Number.parseFloat(totalPValue).toFixed(2)}</Table.Cell> : <Table.Cell positive>${Number.parseFloat(totalPValue).toFixed(2)}</Table.Cell>}
                            <Table.Cell>Total Portfolio Value</Table.Cell>
                            <Table.Cell>${Number.parseFloat(totalPValue + this.props.user.funds).toFixed(2)}</Table.Cell>
                            <Table.Cell>Total Gain/Loss</Table.Cell>
                            {totalCValue > totalPValue ? <Table.Cell negative>${Number.parseFloat(totalPValue - totalCValue).toFixed(2)}</Table.Cell> : <Table.Cell positive>${Number.parseFloat(totalPValue - totalCValue).toFixed(2)}</Table.Cell>}
                        </Table.Row>
                    </Table.Body>
                </Table>
                )
    }







    render() {
        console.log(this.state.portfolio, this.state.labels, this.state.data)
        return (
           <div>
               {this.intervalStart()}
               <Polar data={this.state.datasets}/>
                <br/>
                <form >
                    <input type="text" onChange={this.fundHandler} value={this.state.funds}/>
                    <button onClick={this.addFunds}>Add Funds</button>
                </form>
               
                Current Portfolio Value: {this.currentPortfolioValue()} <button onClick={this.intervalHandler}>Update</button>
            
                 <form >
                    <input type="text" onChange={this.tradeHandler} name="ticker" value={this.state.ticker} placeholder="ticker"/>
                    <input type="integer" onChange={this.tradeHandler} name="quantity" value={this.state.quantity} placeholder="quantity"/>
                    <button onClick={this.sell}>Sell</button>
                </form>
                Current Holdings
                <br/>
                {this.state.portfolio.length > 0 ? this.showStocks() : null}

                  
                
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
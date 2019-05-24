import React from 'react'
import Stock from './Stock'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import '../App.css';
import {companyTickers} from './companyTickers'


class Research extends React.Component {

    state={
        currentSearch: "",
        search: "",
        stock: {},
        quantity: null,
        data: [],
        date: [],
        chart: {},
        watchStock: null
    }

    changeHandler = (e) => {
        this.setState({
            search: e.target.value
        })
    }

    quantityHandler = (e) => {
        this.setState({
            quantity: e.target.value
        })
    }


    getData = (time, search, title) => {
        let close = []
        let date = []
        fetch(`https://api.iextrading.com/1.0/stock/${search}/quote`)
            .then(res => res.json())
            .then(stock => this.setState({
                stock: stock
            }))
        fetch(`https://api.iextrading.com/1.0/stock/${search}/chart/${time}`)
            .then(res => res.json())
            .then(data => {
                data.map(p => {
                    close.push(p.close)
                    time === "1d" ? date.push(p.minute) : date.push(p.date)
                })
                this.setState({
                    data: close,
                    date: date
                })
            })
            .then(() => {
                this.setState({
                    chart: {
                        labels: this.state.date,
                        datasets: [{
                            label: title,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            data: this.state.data,
                            lineTension: 0.0,
                            fill: false,
                            borderColor: "rgba(75,192,192,1)",
                            pointHoverRadius: 2,
                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 0,
                            pointHitRadius: 2
                        }]
                    }
                })
            })
        this.setState({
            search: "",
            data: [],
            date: []
        })
    }

    submitHandler = (e, getData) => {
        e.preventDefault()
        if (companyTickers.find(s => s.symbol.toLowerCase().includes(this.state.search)) && this.state.search.length > 0 && this.state.search !== " ") {
            this.setState({currentSearch: this.state.search})
            this.getData("5y", this.state.search,"5 year")
        } 
        else if (companyTickers.find(s => s.name.toLowerCase().includes(this.state.search)) && this.state.search.length > 0 && this.state.search !== " ") {
            let ticker = companyTickers.find(s => s.name.toLowerCase().includes(this.state.search)).symbol
            this.setState({currentSearch: ticker})
            this.getData("5y", ticker, "5 year")
        }
    }


    oneDay = () => {
        this.getData("1d", this.state.currentSearch, "one day")
    }

    oneMonth = () => {
        this.getData("1m", this.state.currentSearch, "one month")
    }

    threeMonth = () => {
        this.getData("3m", this.state.currentSearch, "three month")
    }

    sixMonth = () => {
        this.getData("6m", this.state.currentSearch, "six month")
    }

    oneYear = () => {
        this.getData("1y", this.state.currentSearch, "one year")
    }

    twoYear = () => {
        this.getData("2y", this.state.currentSearch, "two year")
    }


    fiveYear = () => {
        this.getData("5y", this.state.currentSearch, "five year")
    }

    addToWatchlist = () => {
        if (this.props.user.watchlists.filter(stock => stock.ticker === this.state.stock.symbol).length === 0){
            fetch(`http://localhost:3000/stocks`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: this.state.stock.companyName,
                    price: this.state.stock.latestPrice,
                    ticker: this.state.stock.symbol
                }),
            })
            .then(res => res.json())
            .then(data => {
                fetch(`http://localhost:3000/watchlists`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: this.props.user.id,
                        stock_id: data.id
                    }),
                })
                .then(res => res.json())
                .then(data => {
                    this.props.dispatch({
                        type: "NEW_USER",
                        payload: data.user
                    })
                })
            })
        } else {
            alert("This Already Exists In Your Watchlists!!!")
        }
    }



    purchaseStock = (e) => {
        e.preventDefault()
        console.log("beginning", this.props.user)
        if (this.props.user.funds >= (this.state.stock.latestPrice * this.state.quantity)) {
            fetch(`http://localhost:3000/buy`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: this.state.stock.companyName,
                    price: Number.parseFloat(this.state.stock.latestPrice).toFixed(2),
                    ticker: this.state.stock.symbol,
                    current_quantity: this.state.quantity,
                    original_quantity: this.state.quantity,
                    user_id: this.props.user.id
                }),
            })
            .then(res => res.json())
            .then(data => {
                fetch(`http://localhost:3000/users/${this.props.user.id}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        funds: (data.user.funds - (Number.parseFloat(this.state.stock.latestPrice).toFixed(2) * data.current_quantity)),
                        original_funds: this.props.user.original_funds
                    }),
                })
            .then(res => res.json())
            .then(data => {
                // this.props.dispatch({
                //     type: "NEW_STOCK",
                //     payload: data.investments                
                // }) 
                this.props.dispatch({
                    type: "PURCHASE",
                    payload: data
                })
            })
        })
        console.log("end", this.props.user)
    } else {
        alert("Please Add More Funds To Place This Order!!!")
        }
    }
    

    // sellStock = () => {
    //     console.log(this.props.user.investments.find(s => s.ticker === this.state.stock.symbol))
        // fetch(`http://localhost:3000/stocks`, {
        //     method: 'DELETE'
        //     })
        // .then(res => res.json())
        // .then(console.log)
    // }

            // {Object.keys(this.state.stock).length > 0 && this.props.user ? <button onClick={this.purchaseStock}>Purchase Stock</button> : null}
    
    
    render(){
        return (
        <div>
            <form onSubmit={this.submitHandler}>
                <input type="text" value={this.state.search} onChange={this.changeHandler}/>
                <button type="submit">Search</button>
            </form>
            {Object.keys(this.state.stock).length > 0 ? <Stock stock={this.state.stock}/> : null}
            {Object.keys(this.state.stock).length > 0 ? <button onClick={this.oneDay}>1 Day</button> : null}
            {Object.keys(this.state.stock).length > 0 ? <button onClick={this.oneMonth}>1 Month</button> : null}
            {Object.keys(this.state.stock).length > 0 ? <button onClick={this.threeMonth}>3 Months</button> : null}
            {Object.keys(this.state.stock).length > 0 ? <button onClick={this.sixMonth}>6 Months</button> : null}
            {Object.keys(this.state.stock).length > 0 ? <button onClick={this.oneYear}>1 Year</button> : null}
            {Object.keys(this.state.stock).length > 0 ? <button onClick={this.twoYear}>2 Year</button> : null}
            {Object.keys(this.state.stock).length > 0 ? <button onClick={this.fiveYear}>5 Year</button> : null}
            {Object.keys(this.state.stock).length > 0 && this.props.user ? <button onClick={this.addToWatchlist}>Add To Watch List</button> : null}
             <form onSubmit={this.purchaseStock}>
                <input type="number" value={this.state.quantity} onChange={this.quantityHandler} />
                <button type="submit">Buy</button>
            </form>
            
            
            {Object.keys(this.state.stock).length > 0 && this.props.user ? <button onClick={this.sellStock}>Sell Stock</button> : null}
            <div style={{position:"relative", width:1300, height: 1000 }} >
                {Object.keys(this.state.stock).length > 0 ? <Line ref="chart" data={this.state.chart} /> : <div className="ping">...</div>}
            </div>
        </div> 
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(Research)
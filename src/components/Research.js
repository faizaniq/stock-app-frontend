import React from 'react'
import Stock from './Stock'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import '../App.css';



class Research extends React.Component {

    state={
        currentSearch: "",
        search: "",
        stock: {},
        data: [],
        date: [],
        chart: {}
    }

    changeHandler = (e) => {
        this.setState({
            search: e.target.value,
            currentSearch: e.target.value
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
                    date.push(p.date)
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
        this.getData("5y", this.state.search,"5 year")
    }


    oneDay = () => {
        this.getData("1d", this.state.currentSearch, "one day")
    }

    oneMonth = () => {
        this.getData("1m", this.state.currentSearch, "one day")        
    }

    threeMonth = () => {
        this.getData("3m", this.state.currentSearch, "one day")       
    }

    sixMonth = () => {
        this.getData("6m", this.state.currentSearch, "one day")        
    }

    oneYear = () => {
        this.getData("1y", this.state.currentSearch, "one day")
    }

    twoYear = () => {
        this.getData("2y", this.state.currentSearch, "one day")
    }

    fiveYear = () => {
        this.getData("5y", this.state.currentSearch, "one day")
    }



    render(){
        console.log(this.state.chart)
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
            <div style={{position:"relative", width:1300, height: 1000 }} >
                {Object.keys(this.state.stock).length > 0 ? <Line ref="chart" data={this.state.chart} /> : <div class="ping">...</div>}
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
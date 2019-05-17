import React from 'react'
import Stock from './Stock'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'
import { Line } from 'react-chartjs-2'



class Research extends React.Component {

    state={
        search: "",
        stock: {},
        data: [],
        date: [],
        chart: {}
    }

    changeHandler = (e) => {
        this.setState({
            search: e.target.value
        })
    }

    submitHandler = (e) => {
        e.preventDefault()
        fetch(`https://api.iextrading.com/1.0/stock/${this.state.search}/quote`)
        .then(res => res.json())
        .then(stock => this.setState({stock: stock}))
        fetch(`https://api.iextrading.com/1.0/stock/${this.state.search}/chart/5y`)
        .then(res => res.json())
        .then(data => { data.map(p => {
                    this.setState({
                        data: [...this.state.data, p.close],
                        date: [...this.state.date, p.date]
                    })
                }
            )
        })
        .then(() => {
            this.setState({
                chart: {
                    labels: this.state.date,
                    datasets: [{
                        label: "Closing Price Past 5 Years",
                        backgroundColor: "rgba(255, 0, 255, 0.75)",
                        data: this.state.data,
                        lineTension: 0.0,
                        fill: false
                    }]
                }
            })
        })
        this.setState({
            search: ""
        })
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
            <div style={{position:"relative", width:1000, height: 1000 }} >
                    <Line ref="chart" data={this.state.chart} />
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
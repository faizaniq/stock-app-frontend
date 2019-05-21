import React from 'react'
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2'
import { Line } from 'react-chartjs-2'
import '../App.css';

class HomeChart extends React.Component {

    state={
        names: [],
        prices: [],
        volume: [],
        dataVolume: {},
        dataPrice: {}
    }

    componentDidMount(){
        fetch('https://api.iextrading.com/1.0/stock/market/list/mostactive')
        .then(res => res.json())
        .then(data => { data.map(s => {
                    this.setState({
                        names: [...this.state.names, s.symbol],
                        prices: [...this.state.prices, s.latestPrice],
                        volume: [...this.state.volume, s.latestVolume]
                    })
                }
            )
        })
        .then(() => {
            this.setState({
                dataVolume: {
                    labels: this.state.names,
                    datasets: [{
                            label: "Latest Volume",
                            backgroundColor: "rgba(255, 0, 255, 0.75)",
                            data: this.state.volume
                        }]
                    },
                dataPrice: {
                    labels: this.state.names,
                    datasets: [{
                        label: "Latest Price",
                        backgroundColor: "rgba(75,192,192,1)",
                        data: this.state.prices,
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
    }

    render() {
        return (
           <div >
                < div > < h3 > Most Active - Volume < /h3></div >
                <div style={{position:"relative", width:600, height: 450 }} >
                    <Bar ref="chart" data={this.state.dataVolume} />
                </div>
                < h3 > Most Active - Price </h3>
                <div style={{position:"relative", width:600, height: 450 }} >
                    <Line ref="chart" data={this.state.dataPrice} />
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


export default connect(mapStateToProps)(HomeChart)
import React from 'react'
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2'
import { Line } from 'react-chartjs-2'
import { Icon, Input, Button, Message, Modal, Header, Grid } from 'semantic-ui-react'

import '../App.css';

class DefaultChart extends React.Component {

    state={
        gainNames: [],
        gainPrices: [],
        loseNames: [],
        losePrices: [],
        background: [],
        dataLoss: {},
        dataGain: {}
    }

    getColor = () => {
        let str = '0123456789ABCDEF'
        let color = "#"
        for (let i = 0; i < 6; i++) {
            color += str[Math.floor(Math.random() * 16)]
        }
        return color
    }

    componentDidMount(){
        fetch('https://api.iextrading.com/1.0/stock/market/list/gainers')
        .then(res => res.json())
        .then(data => { data.map(s => {
                    this.setState({
                        gainNames: [...this.state.gainNames, s.symbol],
                        gainPrices: [...this.state.gainPrices, s.latestPrice],
                        background: [...this.state.background, this.getColor()]
                    })
                }
            )
        })
        .then(() => {
            this.setState({
                dataGain: {
                    labels: this.state.gainNames,
                    datasets: [{
                        label: "Latest Price",
                        backgroundColor: this.state.background,
                        data: this.state.gainPrices,
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
        fetch('https://api.iextrading.com/1.0/stock/market/list/losers')
        .then(res => res.json())
        .then(data => { data.map(s => {
                    this.setState({
                        loseNames: [...this.state.loseNames, s.symbol],
                        losePrices: [...this.state.losePrices, s.latestPrice]
                    })
                }
            )
        })
        .then(() => {
            this.setState({
                dataLoss: {
                    labels: this.state.loseNames,
                    datasets: [{
                        label: "Latest Price",
                        backgroundColor: this.state.background,
                        data: this.state.losePrices,
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
           <Grid className='ui two column centered grid'>
               <Grid.Column width={7} >
                    < h3 > Gainers </h3>
                    <Bar ref="chart" data={this.state.dataGain} />
                </Grid.Column>
                <Grid.Column width={7}>
                    < h3 > Losers </h3>
                    <Bar ref="chart" data={this.state.dataLoss} />
                </Grid.Column>
           </Grid> 

        )
    }
}




const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(DefaultChart)
import React from 'react'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'



class Stock extends React.Component {

    render() {
        return (
           <div>
               <h2>Name: {this.props.stock.companyName}</h2>
               <p>Ticker Symbol: {this.props.stock.symbol}</p>
               <p>Latest Price: {this.props.stock.latestPrice}</p>
               <p>Sector: {this.props.stock.sector}</p>
               <p>Exchange: {this.props.stock.primaryExchange}</p>
               <p>Year To Date Change: {this.props.stock.ytdChange}%</p>
               <p>Sector: {this.props.stock.sector}</p>
               <p>52 Week Low: {this.props.stock.week52Low}</p>
               <p>52 Week High: {this.props.stock.week52High}</p>
           </div> 
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(Stock)
import React from 'react'
import { connect } from 'react-redux';

class StockWatch extends React.Component {

    render() {
        console.log(this.props.stock)
        return (
           <div>
               Name: {this.props.stock.company} Ticker: {this.props.stock.ticker} Price: {this.props.stock.price}
           </div> 

        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(StockWatch)
import React from 'react'
import StockWatch from './StockWatch'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'



class Watchlists extends React.Component {

    currentUserWatchlist = () => {
        return this.props.user.watchlists.map(s => <StockWatch stock={s}/>)
    }

    render() {
        return (
           <div>
               {this.currentUserWatchlist()}
           </div> 

        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(Watchlists)
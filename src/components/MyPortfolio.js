import React from 'react'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'



class MyPortfolio extends React.Component {

    render() {
        return (
           <div>
               Name: {this.props.user.name}
               <br/>
               Funds: {this.props.user.funds ? this.props.user.funds : 0}
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
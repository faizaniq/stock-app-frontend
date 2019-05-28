import React from 'react'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'
import { Image, Item } from 'semantic-ui-react'


class Stock extends React.Component {

    render() {
        return (
            < div >
              <Item.Group>
                    <Item>
                    <Item.Image size='small' src={this.props.logo} />

                    <Item.Content>
                        <Item.Header as='a'>{this.props.stock.companyName}</Item.Header>
                        <Item.Meta>{this.props.stock.symbol}</Item.Meta>
                        <Item.Description>
                            {this.props.stock.primaryExchange}
                        </Item.Description>
                        <Item.Extra>Sector: {this.props.stock.sector}</Item.Extra>
                        <Item.Extra>Current Price: {this.props.stock.latestPrice}</Item.Extra>
                        <Item.Extra>52 Week Low{this.props.stock.week52High}</Item.Extra>                        
                        <Item.Extra>52 Week High: {this.props.stock.week52Low}</Item.Extra>
                        <Item.Extra>Year To Date Change: {this.props.stock.ytdChange}%</Item.Extra>
                    </Item.Content>
                    </Item>
                </Item.Group>
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
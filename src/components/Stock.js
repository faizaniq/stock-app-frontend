import React from 'react'
import { connect } from 'react-redux';
import { Item } from 'semantic-ui-react'


class Stock extends React.Component {

    render() {
        console.log(this.props.stock)
        return (
            < div >
              <Item.Group>
                    <Item>
                    <Item.Image size='small' src={this.props.logo} />
                    <Item.Content>
                        <Item.Header>{this.props.stock.companyName}</Item.Header>
                        <Item.Meta>{this.props.stock.symbol}</Item.Meta>
                        <Item.Description>
                            {this.props.stock.primaryExchange}
                        </Item.Description>
                        <Item.Meta>Sector: {this.props.stock.sector}</Item.Meta>
                        <Item.Meta>Current Price: {this.props.stock.latestPrice} at {this.props.stock.latestTime}</Item.Meta>
                        <Item.Meta>52 Week Low: {this.props.stock.week52High}</Item.Meta>
                        <Item.Meta>52 Week High: {this.props.stock.week52Low}</Item.Meta>
                        <Item.Meta>Year To Date Change: {Number.parseFloat(this.props.stock.ytdChange * 100).toFixed(2)}%</Item.Meta>
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
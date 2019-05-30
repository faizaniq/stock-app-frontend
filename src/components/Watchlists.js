import React from 'react'
import StockWatch from './StockWatch'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'
import { Table, Grid, Accordion, Icon } from 'semantic-ui-react'

class Watchlists extends React.Component {
    
    state= {
        list: [],
        activeIndex: null
    }

    dynamicSort = (property) => {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            if(sortOrder == -1){
                return b[property].localeCompare(a[property]);
            }else{
                return a[property].localeCompare(b[property]);
            }        
        }
    }

    checkValue = () => {
        let list = []
        let promiseList = this.props.user.watchlists.map(s => {
            return fetch(`https://api.iextrading.com/1.0/stock/${s.ticker}/quote`)
            .then(res => res.json())
            .then(data => {
                list.push({company: s.company, ticker: s.ticker, price: Number.parseFloat(data.latestPrice).toFixed(2)})
            })
        })
        Promise.all(promiseList)
        .then(() => this.setState({list: list.sort(this.dynamicSort("company"))}))
    }

    componentDidMount(){
        setInterval(this.checkValue, 3000)
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }



    render() {
        const { activeIndex } = this.state 
        console.log(this.state.list)       
        return (
           <div>
                <Table celled>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Company</Table.HeaderCell>
                        <Table.HeaderCell>Ticker</Table.HeaderCell>
                        <Table.HeaderCell>Current Price</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.list.sort(this.dynamicSort("company")).map(s => {
                        return( < Table.Row >
                            <Table.Cell>{s.company}</Table.Cell>
                            <Table.Cell>{s.ticker}</Table.Cell>
                            <Table.Cell>${s.price}</Table.Cell>
                        </Table.Row>)
                        })
                    }
                </Table.Body>
            </Table>
                  
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
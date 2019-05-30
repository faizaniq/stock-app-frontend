import React from 'react'
import Watchlists from './Watchlists'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'
import { Table, Grid, Accordion, Icon, Dimmer, Loader, Image, Segment, Input, Label, Button } from 'semantic-ui-react'
import { Polar } from 'react-chartjs-2'

class MyPortfolio extends React.Component {
    state={
        funds: "",
        portfolio: "",
        ticker: "",
        quantity: "",
        stock: {},
        profit: [],
        interval: false,
        data: [],
        labels: [],
        datasets: {}, 
        background: [],
        activeIndex: 0
    }

    check = null

    getColor = () => {
        let str = '0123456789ABCDEF'
        let color = "#"
        for (let i = 0; i < 6; i++) {
            color += str[Math.floor(Math.random() * 16)]
        }
        return color
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

    componentDidMount() {
        let portfolio = []
        let background = []
        console.log(this.props.user.investments)
        let promisePortfolio = this.props.user.investments.map(s => {
            if (s.purchase === true && s.current_quantity > 0) {
                this.setState(prevState => ({
                    data: [...prevState.data, (s.current_quantity * s.price)],
                    labels: [...prevState.labels, s.ticker], 
                    background: [...prevState.background, this.getColor()]
                }))
                return fetch(`https://api.iextrading.com/1.0/stock/${s.ticker}/price`)
                .then(res => res.json())
                .then(data => {
                    portfolio.push({company: s.company, ticker: s.ticker, costBasis: s.price, price: Number.parseFloat(+data).toFixed(2), quantity: s.current_quantity})
                })
            }
        })
        Promise.all(promisePortfolio)
        .then(() => this.setState({portfolio: portfolio.sort()}))
        .then(() => {
            this.setState({
                datasets: {
                        labels: [...this.state.labels, "Cash"],
                        datasets: [{
                            label: "Latest Price",
                            backgroundColor: this.state.background,
                            data: [...this.state.data, this.props.user.funds]
                        }]
                }
            })
        })
        setInterval(this.checkValue, 3000)
    }

    fundHandler = (e) => {
        this.setState({
            funds: e.target.value
        })
    }

    addFunds = (e) => {
        e.preventDefault()
        fetch(`http://localhost:3000/users/${this.props.user.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                funds: (+this.props.user.funds + +this.state.funds),
                original_funds: (+this.props.user.original_funds + +this.state.funds)
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("adding funds", data)
            this.props.dispatch({
                type: "ADD_FUNDS",
                payload: data.funds
            })
            this.props.dispatch({
                type: "ADD_TO_TOTAL_FUNDS",
                payload: data.original_funds
            })
            this.setState({
                datasets: {
                    labels: [...this.state.labels, "Cash"],
                    datasets: [{
                        label: "Latest Price",
                        backgroundColor: this.state.background,
                        data: [...this.state.data, data.funds]
                    }]
                }
            })
        })
        this.setState({
            funds: ""
        })
    }

    
    totalInvestments = () => {
        if (this.props.user.investments.length === 0) {
            return 0 
        } else {
            let total = 0
            this.props.user.investments.map(s => {
                if (s.purchase === true) {
                    total = (total + (s.price * s.current_quantity))
                }
            })
        return total.toFixed(2)
        }
    }


    totalPortfolio = () => {
        return +this.totalInvestments() + +this.props.user.funds 
    }

    currentPortfolioValue = () => {
        if (this.state.portfolio.length > 0) {
            let total = 0 
            this.state.portfolio.map(s => {
                total = total + (+s.price * +s.quantity)
            })
            return (total + +this.props.user.funds).toFixed(2)
        } else {
            return +this.props.user.funds.toFixed(2)
        }
    }



    checkValue = () => {
        let portfolio = []
        let promisePortfolio = this.props.user.investments.map(s => {
            if (s.purchase === true && s.current_quantity > 0) {
                return fetch(`https://api.iextrading.com/1.0/stock/${s.ticker}/price`)
                .then(res => res.json())
                .then(data => {
                    portfolio.push({company: s.company, ticker: s.ticker, costBasis: Number.parseFloat(s.price).toFixed(2), price: Number.parseFloat(data).toFixed(2), quantity: s.current_quantity})
                })
            }
        })
        Promise.all(promisePortfolio)
        .then(() => this.setState({portfolio: portfolio}))
    }

    intervalHandler = () => {
        this.setState({
            interval: !this.state.interval
        })
    }

    tradeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    intervalStart = () => {
        if (this.state.interval && !this.check){
            this.check = setInterval(this.checkValue, 3000)
        } else if(!this.state.interval && this.check) {
            clearInterval(this.check)
            this.check = null
        }
    }


    showStocks = () => {
        let totalPValue = 0
        let totalCValue = 0
            return( 
                <Table celled>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Company</Table.HeaderCell>
                        <Table.HeaderCell>Ticker</Table.HeaderCell>
                        <Table.HeaderCell>Current Price</Table.HeaderCell>
                        <Table.HeaderCell>Cost Basis</Table.HeaderCell>
                        <Table.HeaderCell>Gain/Loss</Table.HeaderCell>
                        <Table.HeaderCell>% Change</Table.HeaderCell>
                        <Table.HeaderCell>Current Holdings</Table.HeaderCell>
                        <Table.HeaderCell>Current Value</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.portfolio.sort(this.dynamicSort("company")).map(s => {
                            totalPValue = (totalPValue + (s.price * s.quantity))
                            totalCValue = (totalCValue + (s.costBasis * s.quantity))
                            if (s.costBasis < s.price) {

                        return( < Table.Row positive >
                                    <Table.Cell>{s.company}</Table.Cell>
                                    <Table.Cell>{s.ticker}</Table.Cell>
                                    <Table.Cell>${s.price}</Table.Cell>
                                    <Table.Cell>${s.costBasis}</Table.Cell>
                                    <Table.Cell>${Number.parseFloat(s.price - s.costBasis).toFixed(2)}</Table.Cell>
                                    <Table.Cell>+{Number.parseFloat(((s.price - s.costBasis) / s.costBasis)).toFixed(4)}%</Table.Cell>
                                    <Table.Cell>{s.quantity}</Table.Cell>
                                    <Table.Cell>${Number.parseFloat(s.quantity * s.price).toFixed(2)}</Table.Cell>
                                </Table.Row>)
                            } else if (s.costBasis === s.price) {
                        return(  < Table.Row>
                                    <Table.Cell>{s.company}</Table.Cell>
                                    <Table.Cell>{s.ticker}</Table.Cell>
                                    <Table.Cell>${s.price}</Table.Cell>
                                    <Table.Cell>${s.costBasis}</Table.Cell>
                                    <Table.Cell>${Number.parseFloat(s.price - s.costBasis).toFixed(2)}</Table.Cell>
                                    <Table.Cell>{Number.parseFloat(((s.price - s.costBasis) / s.costBasis)).toFixed(4)}</Table.Cell>
                                    <Table.Cell>{s.quantity}</Table.Cell>
                                    <Table.Cell>${Number.parseFloat(s.quantity * s.price).toFixed(2)}</Table.Cell>
                                </Table.Row>) 
                            } else {
                        return(  < Table.Row negative>
                                    <Table.Cell>{s.company}</Table.Cell>
                                    <Table.Cell>{s.ticker}</Table.Cell>
                                    <Table.Cell>${s.price}</Table.Cell>
                                    <Table.Cell>${s.costBasis}</Table.Cell>
                                    <Table.Cell>${Number.parseFloat(s.price - s.costBasis).toFixed(2)}</Table.Cell>                                    
                                    <Table.Cell>{Number.parseFloat(((s.price - s.costBasis) / s.costBasis)).toFixed(4)}%</Table.Cell>
                                    <Table.Cell>{s.quantity}</Table.Cell>
                                    <Table.Cell>${Number.parseFloat(s.quantity * s.price).toFixed(2)}</Table.Cell>
                                </Table.Row>)
                            }
                        })
                    }
                    <Table.Row>
                            <Table.Cell>Cash Available</Table.Cell>
                            <Table.Cell>${Number.parseFloat(this.props.user.funds).toFixed(2)}</Table.Cell>
                            <Table.Cell>Current Invested Value</Table.Cell>
                            {totalCValue > totalPValue ? <Table.Cell negative>${Number.parseFloat(totalPValue).toFixed(2)}</Table.Cell> : <Table.Cell positive>${Number.parseFloat(totalPValue).toFixed(2)}</Table.Cell>}
                            <Table.Cell>Total Portfolio Value</Table.Cell>
                            <Table.Cell>${Number.parseFloat(totalPValue + this.props.user.funds).toFixed(2)}</Table.Cell>
                            <Table.Cell>Total Gain/Loss</Table.Cell>
                            {totalCValue > totalPValue ? <Table.Cell negative>${Number.parseFloat(totalPValue - totalCValue).toFixed(2)}</Table.Cell> : <Table.Cell positive>${Number.parseFloat(totalPValue - totalCValue).toFixed(2)}</Table.Cell>}
                        </Table.Row>
                    </Table.Body>
                </Table>
                )
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }

    transactions = () => {
            return( 
                <Table celled>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Company</Table.HeaderCell>
                        <Table.HeaderCell>Ticker</Table.HeaderCell>
                        <Table.HeaderCell>Purchase/Sale</Table.HeaderCell>
                        <Table.HeaderCell>Cost Basis/Sale Price</Table.HeaderCell>
                        <Table.HeaderCell>Purchase/Sale Quantity</Table.HeaderCell>
                        <Table.HeaderCell>Total Transaction</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.props.user.investments.map(s => {
                    return  (< Table.Row>
                                <Table.Cell>{s.company}</Table.Cell>
                                <Table.Cell>{s.ticker}</Table.Cell>
                            <Table.Cell>{s.purchase ? "Purchase" : "Sale"}</Table.Cell>
                                <Table.Cell>${s.price}</Table.Cell>
                                <Table.Cell>{s.purchase ? s.original_quantity : s.current_quantity}</Table.Cell>
                                <Table.Cell>{s.purchase ? `$${Number.parseFloat(s.original_quantity * s.price).toFixed(2)}` : `$${Number.parseFloat(s.current_quantity * s.price).toFixed(2)}`}</Table.Cell>
                            </Table.Row>)
                            })
                    }
                    </Table.Body>
                </Table>
            )
    }


    // <Button onClick={this.addFunds} icon=<Icon name="sync alternate" onClick={this.intervalHandler}/> />


    render() {
        const { activeIndex } = this.state        
        console.log("portfolio", this.state.portfolio)
        return (
        <div>
        {this.intervalStart()}
        {Object.keys(this.state.datasets).length > 0 ? 
        <div>
            <Grid>
                <Grid.Column width={8} className='ui two column centered grid'>
                    <Polar data={this.state.datasets}/> 
                </Grid.Column>
                <Grid.Column width={6} className='ui two column centered grid'>
                    <Accordion fluid styled>
                        <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Watchlist
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 2}>
                        <p>
                        <Watchlists />
                        </p>
                        </Accordion.Content>
                    </Accordion>
                </Grid.Column>
            </Grid>
            <br/>
            <br/>
            <Grid>
                 <Grid.Column width={4} className='ui two column centered grid'>
                    <form >
                        <Input labelPosition='right' type='text' placeholder='Amount' onChange={this.fundHandler} value={this.state.funds}>
                            <Label basic>$</Label>
                            <input />
                            <Label>.00</Label>
                        </Input>
                        <Button onClick={this.addFunds} content='Add Funds' />
                    </form> 
                </Grid.Column>
                <Grid.Column width={3} className='ui two column centered grid'>
                </Grid.Column>
            </Grid>
            <br/>
                <Accordion fluid styled>
                <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                <Icon name='dropdown' />
                Current Holdings
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                <p>
                    {this.state.portfolio.length > 0 ? this.showStocks() : null}
                </p>
                </Accordion.Content>
                <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                <Icon name='dropdown' />
                Transaction History
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                <p>
                    {this.transactions()}
                </p>
                </Accordion.Content>          
            </Accordion>
        </div> :    
                <div style={{marginTop: "20%"}}>
                    <Loader active inline='centered' />
                </div>    
                    }
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
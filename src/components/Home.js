import React from 'react'
import Stock from './Stock'
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2'
import '../App.css';
import {companyTickers} from './companyTickers'
import { Icon, Input, Button, Message, Modal, Header, Grid, Accordion} from 'semantic-ui-react'
import DefaultChart from './DefaultChart'


class Research extends React.Component {

    state={
        currentSearch: "",
        search: "",
        stock: {},
        buyQuantity: null,
        sellQuantity: null,
        data: [],
        date: [],
        chart: {},
        watchStock: null,
        logo: "",
        news: null, 
        activeIndex: null
    }

    changeHandler = (e) => {
        this.setState({
            search: e.target.value
        })
    }

    quantityHandler = (e) => {
        this.setState({
            buyQuantity: e.target.value
        })
    }

    sellQuantityHandler = (e) => {
        this.setState({
            sellQuantity: e.target.value
        })
    }


    getData = (time, search, title) => {
        let close = []
        let date = []
        fetch(`https://cloud.iexapis.com/stable/stock/${search}/quote?token=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then(stock => this.setState({
                stock: stock
            }))
        fetch(`https://cloud.iexapis.com/stable/stock/${search}/chart/${time}?token=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                data.map(p => {
                    close.push(p.close)
                    time === "1d" ? date.push(p.minute) : date.push(p.date)
                })
                this.setState({
                    data: close,
                    date: date
                })
            })
            .then(() => {
                this.setState({
                    chart: {
                        labels: this.state.date,
                        datasets: [{
                            label: title,
                            backgroundColor: "rgba(100, 100, 100, 1)",
                            data: this.state.data,
                            lineTension: 0.0,
                            fill: false,
                            borderColor: "rgba(100, 100, 100, 1)",
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
        this.setState({
            search: "",
            data: [],
            date: []
        })
    }


    getNews = (search) => {
        fetch(`https://cloud.iexapis.com/stable/stock/${search}/news?token=${process.env.REACT_APP_API_KEY}`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                news: data
            })
        })
    }

    getLogo = (search) => {
        fetch(`https://cloud.iexapis.com/stable/stock/${search}/logo?token=${process.env.REACT_APP_API_KEY}`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                logo: data.url
            })
        })
    }

    submitHandler = (e, getData, getNews, getLogo) => {
        e.preventDefault()
        if (companyTickers.find(s => s.symbol.toLowerCase().includes(this.state.search)) && this.state.search.length > 0 && this.state.search !== " ") {
            this.setState({currentSearch: this.state.search})
            this.getData("5y", this.state.search,"5 year")
            this.getNews(this.state.search)
            this.getLogo(this.state.search)
        } 
        else if (companyTickers.find(s => s.name.toLowerCase().includes(this.state.search)) && this.state.search.length > 0 && this.state.search !== " ") {
            let ticker = companyTickers.find(s => s.name.toLowerCase().includes(this.state.search)).symbol
            this.setState({currentSearch: ticker})
            this.getData("5y", ticker, "5 year")
            this.getNews(ticker)
            this.getLogo(ticker)
        } else {
            return <Message
                    error
                    header="Company Not Found"
                    content = "Please Enter a Valid Company Name or Ticker"
                />
        }
    }


    oneDay = () => {
        this.getData("1d", this.state.currentSearch, "1 Day")
    }

    oneMonth = () => {
        this.getData("1m", this.state.currentSearch, "1 Month")
    }

    threeMonth = () => {
        this.getData("3m", this.state.currentSearch, "3 Month")
    }

    sixMonth = () => {
        this.getData("6m", this.state.currentSearch, "6 Month")
    }

    oneYear = () => {
        this.getData("1y", this.state.currentSearch, "1 Year")
    }

    twoYear = () => {
        this.getData("2y", this.state.currentSearch, "2 Year")
    }


    fiveYear = () => {
        this.getData("5y", this.state.currentSearch, "5 Year")
    }

    addToWatchlist = () => {
        if (this.props.user.watchlists.filter(stock => stock.ticker === this.state.stock.symbol).length === 0){
            fetch(`http://localhost:3000/stocks`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: this.state.stock.companyName,
                    price: this.state.stock.latestPrice,
                    ticker: this.state.stock.symbol
                }),
            })
            .then(res => res.json())
            .then(data => {
                fetch(`http://localhost:3000/watchlists`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: this.props.user.id,
                        stock_id: data.id
                    }),
                })
                .then(res => res.json())
                .then(data => {
                    this.props.dispatch({
                        type: "NEW_USER",
                        payload: data.user
                    })
                })
            })
        } else {
            return <Message
                    error
                    header='Cannot Add to Watchlist'
                    content = 'This company already exists in your watchlist.'
                />
        }
    }

    purchaseStock = (e) => {
        e.preventDefault()
        if (this.props.user.funds >= (this.state.stock.latestPrice * this.state.buyQuantity)) {
            fetch(`http://localhost:3000/buy`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: this.state.stock.companyName,
                    price: Number.parseFloat(this.state.stock.latestPrice).toFixed(2),
                    ticker: this.state.stock.symbol,
                    current_quantity: this.state.buyQuantity,
                    original_quantity: this.state.buyQuantity,
                    user_id: this.props.user.id
                }),
            })
            .then(res => res.json())
            .then(data => {
                fetch(`http://localhost:3000/users/${this.props.user.id}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        funds: (data.user.funds - (Number.parseFloat(this.state.stock.latestPrice).toFixed(2) * data.current_quantity)),
                        original_funds: this.props.user.original_funds
                    }),
                })
            .then(res => res.json())
            .then(data => {
                this.props.dispatch({
                    type: "PURCHASE",
                    payload: data
                })
            })
        })
    } else {
        return <Message
                    error
                    header='Insufficient Funds'
                    content = 'Please Add More Funds To Place This Order.'
                />
        }
    }

    currentHolding = () => {
        let t = 0
        this.props.user.investments.map(s => {
            if (s.purchase === true && s.ticker === this.state.stock.symbol) {
                t = (t + s.current_quantity)
            }
        })
        return t
    }

    sell = (e) => {
        e.preventDefault()
        fetch(`https://cloud.iexapis.com/stable/stock/${this.state.stock.symbol}/quote?token=${process.env.REACT_APP_API_KEY}`)
        .then(res => res.json())
        .then(stock => this.setState({
            stock: stock
        },() => {
            fetch(`http://localhost:3000/sell`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: this.state.stock.companyName,
                    price: Number.parseFloat(this.state.stock.latestPrice).toFixed(2),
                    ticker: this.state.stock.symbol,
                    current_quantity: this.state.sellQuantity,
                    user_id: this.props.user.id
                }),
            })
            .then(res => res.json())
            .then(data => {
                    this.props.dispatch({
                        type: "SELL_STOCK",
                        payload: data
                    })
            })
        }))
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }
    
    displayNews = () => {
        return this.state.news.map(n => {
            return (<div>
                        <h3>{n.headline}</h3>
                        <p>{n.datetime}</p>
                        <h5>{n.source}</h5>
                        <img src={n.image} width="325" height="250"/>
                        <p>{n.summary}</p><a href={n.url} target="_blank"><Icon name="globe" /></a>
                        <br/>
                    </div>
                )
        })
    }


    render(){
        const { activeIndex } = this.state        
        return (
        <div>
            <br/>
            <Grid>
                <Grid.Column width={12} className='ui centered'>
                    <Input className="ui center aligned grid" icon={<Icon name='search'  inverted circular link onClick={this.submitHandler} />} placeholder='Search...' onChange={this.changeHandler}/>
                </Grid.Column>
            </Grid>
             <br/>
            {Object.keys(this.state.stock).length > 0 ? null : <DefaultChart/>}

                <br/>            
            <Grid className='ui two column centered grid'>
                <Grid.Column width={10}>
                    {Object.keys(this.state.stock).length > 0 ? <Stock stock={this.state.stock} logo={this.state.logo}/> : null}
                </Grid.Column>
                <Grid.Column width={10}>
                {Object.keys(this.state.stock).length > 0 ?
                    <Button.Group>
                        <Button onClick={this.oneDay}>1 Day</Button>
                        <Button onClick={this.oneMonth}>1 Month</Button>
                        <Button onClick={this.threeMonth}>3 Months</Button>
                        <Button onClick={this.sixMonth}>6 Months</Button>
                        <Button onClick={this.oneYear}>1 Year</Button>
                        <Button onClick={this.twoYear}>2 Year</Button>
                        <Button onClick={this.fiveYear}>5 Year</Button>
                    </Button.Group> : null}
                    {this.props.user && Object.keys(this.state.stock).length > 0 ? <Button.Group>
                        <Button onClick={this.addToWatchlist}>Add To Watchlist</Button>
                        <Modal trigger={<Button>Trade</Button>} style={{width: "30%"}} closeIcon>
                            <Header icon='archive' content={this.state.stock.companyName} />
                            <Modal.Content >
                            <div style={{marginBottom: 0, textAlign: "center"}}>
                                <h3>Avaliable Funds: ${Number.parseFloat(this.props.user.funds).toFixed(2)}</h3>
                                <br/>
                                <h3>Current Price: ${this.state.stock.latestPrice}</h3>
                                <br/> 
                                <h3>Order Total: ${Number.parseFloat(this.state.buyQuantity*this.state.stock.latestPrice).toFixed(2)}</h3>
                                <br/>
                                <h3>Quantity Owned: {this.props.user.investments ? this.currentHolding() : 0}</h3>
                                 <form onSubmit={this.purchaseStock}>
                                    <input type="integer" value={this.state.buyQuantity} onChange={this.quantityHandler} />
                                    <Button size="tiny" type="submit">Buy</Button>
                                </form>
                                <form onSubmit={this.sell}>
                                    <input type="integer" onChange={this.sellQuantityHandler} name="quantity" value={this.state.sellQuantity} />
                                    <Button size="tiny" type="submit">Sell</Button>
                                </form>
                            </div>
                            </Modal.Content>
                        </Modal> 
                    </Button.Group> : null}
                    </Grid.Column>
                    <Grid.Column width={12} className='ui two column centered grid'>
                        {Object.keys(this.state.stock).length > 0 ? <Line ref="chart" data={this.state.chart} /> : null}
                    </Grid.Column>
                
            </Grid>
                    
            {this.state.news ? <Accordion fluid styled>
                <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                <Icon name='dropdown' />
                News
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    {this.state.news ? this.displayNews() : null}
                </Accordion.Content>
            </Accordion> : null}
            
        </div> 
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(Research)
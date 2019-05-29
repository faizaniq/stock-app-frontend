import React from 'react'
import Article from './Article'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import { Icon, Input, Button, Message, Modal, Header, Grid, Accordion } from 'semantic-ui-react'

import '../App.css';


class News extends React.Component{

    state={
        news: [],
        activeIndex: null
    }

    componentDidMount(){
        fetch('https://api.iextrading.com/1.0/stock/market/news')
        .then(res => res.json())
        .then(data => {
            this.setState({
                news: data
            })
        })
    }

    renderNews = () => {
        return this.state.news.map(a => {
            console.log(a)
        })
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
                    <p>{n.summary} <a href={n.url} target="_blank"><Icon name="globe" /></a> </p>
                    <br/>
                </div>
            )
        })
    }


    
    render(){
        const { activeIndex } = this.state        
        return(
            <div>
                <Accordion fluid styled>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                    <Icon name='dropdown' />
                    News
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        {this.state.news ? this.displayNews() : null}
                    </Accordion.Content>
                </Accordion>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(News)
import React from 'react'
import Article from './Article'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import '../App.css';


class Home extends React.Component{

    state={
        news: []
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
        return this.state.news.map(article => <Article key={article.datetime} article={article}/>)
    }

    
    render(){
        return(
            <div>
                home
                {this.renderNews()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(Home)
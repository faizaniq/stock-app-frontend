import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';


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

    
    render(){
        let headlines = this.state.news.map(article => <ul><h5>{article.headline}</h5></ul>)
        console.log(this.state.news)
        return(
            <div>
                home
                {headlines}
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
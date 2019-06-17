import React from 'react'
import { connect } from 'react-redux';



class Article extends React.Component {

    render() {
        return (
           <div>
               <h2>{this.props.article.headline}</h2>
               <p>{this.props.article.summary}</p>
               <img src= "https://frontera.net/wp-content/uploads/2017/08/bigstock-Stock-Market-Indicator-And-Fin-163040681.jpg" / >
               <p>{this.props.article.url}</p>
           </div> 

        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(Article)
import React from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import NavBar from '../components/NavBar'
import Home from '../components/Home'
import MyPortfolio from '../components/MyPortfolio'
import Research from '../components/Research'
import Watchlists from '../components/Watchlists'
import { connect } from 'react-redux';
import { Route } from 'react-router-dom'


class MainContainer extends React.Component {
    

    //  <Menu inverted>
    //     <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
    //     <Menu.Item
    //       name='messages'
    //       active={activeItem === 'messages'}
    //       onClick={this.handleItemClick}
    //     />
    //     <Menu.Item
    //       name='friends'
    //       active={activeItem === 'friends'}
    //       onClick={this.handleItemClick}
    //     />
    //   </Menu>


    render() {
        return (
           <div>
               <NavBar />
               <Route exact path="/home" component= {Home}/>
               <Route exact path={`/${this.props.user.id}/myportfolio`} component={MyPortfolio}/>
               <Route exact path="/login" component= {Login } /> 
               <Route exact path="/signup" component= {Signup} />
               <Route exact path="/research" component={Research} /> 
               <Route exact path={`/${this.props.user.id}/watchlists`} component={Watchlists} /> 
           </div> 
           
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};


export default connect(mapStateToProps)(MainContainer)
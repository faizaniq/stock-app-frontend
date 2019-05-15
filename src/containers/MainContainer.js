import React from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import NavBar from '../components/NavBar'

class MainContainer extends React.Component {
    render() {
        return (
           <div>
               maincontainer
               <NavBar />
               <Login />
               <Signup />
           </div> 

        )
    }
}

export default MainContainer
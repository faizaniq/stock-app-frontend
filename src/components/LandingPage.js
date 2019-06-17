import React from 'react'
import { NavLink } from 'react-router-dom'

import {
  Button,
  Container,
  Header,
  Icon
} from 'semantic-ui-react'




function LandingPage() {
    return(
    <div className="landingpage">
        <Container text >
            <Header
            as='h1'
            content='Stock-Up'
            inverted
            style={{
                fontSize: '4em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: "10px",
                color: "white"
            }}
            />
            <Header
            as='h2'
            content='Invest in the market without any of the risk.'
            inverted
            style={{
                fontSize: '1.7em',
                fontWeight: 'normal',
                marginTop: '1.5em',
                color: "white"
            }}
            />
            <NavLink className="item" to="/home">
                <Button primary size='medium'>
                    Get Started
                    <Icon name='right arrow' />
                </Button>
            </NavLink>
        </Container>
    </div>
    )
}

export default LandingPage
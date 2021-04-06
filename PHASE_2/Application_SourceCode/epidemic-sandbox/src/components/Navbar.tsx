import React, { Component } from 'react';
import { ReactComponent as Logo } from '../images/logo.svg';
import Grid from '@material-ui/core/Grid';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import Home from "./Home";
import Map from "./Map";
import ChartPage from "./Charts";
import ContactUs from './ContactUs';

interface NavProps {
    text: string
    link: string
}

const NavStyle = {
    height: "100px",
    width: "100%",
}

const NavItemStyle = {
    "color": "#126577",
    "text-transform": "uppercase",
    "font": "Rambla"
}

const NavItem = (props:NavProps) => {
    return (
        <Link to={props.link}>
            <Grid item>
                <div className="navItem" style={NavItemStyle}>{props.text}</div>
            </Grid>
        </Link>
        
    )
}

const LogoItem = (props:NavProps) => {
    return (
        <Grid item>
            <Grid container alignItems="center" justify="space-around">
                <Grid item>
                    <Logo/>
                </Grid>
                <NavItem {...{"text": props.text,
                            "link": props.link}}/>
            </Grid>
        </Grid>
    );
}

export const Routes = () => {
    return (
      <div>
        <Navbar/>
        <Switch>
          <Route exact path="/Home" component={Home} />
          <Route exact path="/">
            <Redirect to="/Home" />
          </Route>
          <Route exact path="/Map" component={Map} />
          <Route exact path="/Chart" component={ChartPage} />
          <Route exact path="/Contact" component={ContactUs} />
        </Switch>
      </div>
    );
  };

class Navbar extends Component {
    render() {
        return (
            <>
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="center"
                    style={NavStyle}
                    >
                    <LogoItem text="Epidemic Sandbox" link="/Home"/>
                    <NavItem text="Outbreak Map" link="/Map"/>
                    <NavItem text="Regression Analysis" link="/Chart"/>
                    <NavItem text="Contact Us" link="/Contact"/>
                    
                </Grid>
            </>
        );
    }
}

export default Navbar;
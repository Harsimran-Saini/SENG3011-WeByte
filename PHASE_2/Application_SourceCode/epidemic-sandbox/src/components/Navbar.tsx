import React, { Component } from 'react';
import { ReactComponent as Logo } from '../images/logo.svg';
import Grid from '@material-ui/core/Grid';

interface NavProps {
    text: string
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
        <Grid item>
            <div className="navItem" style={NavItemStyle}>{props.text}</div>
        </Grid>
    )
}

const LogoItem = (props:NavProps) => {
    return (
        <Grid item>
            <Grid container alignItems="center" justify="space-around">
                <Grid item>
                    <Logo/>
                </Grid>
                <NavItem text={props.text}/>
            </Grid>
        </Grid>
    );
}

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
                    <LogoItem text="Epidemic Sandbox"/>
                    <NavItem text="Outbreak Map"/>
                    <NavItem text="Regression Analysis"/>
                    <NavItem text="Contact Us"/>
                    
                </Grid>
            </>
        );
    }
}

export default Navbar;
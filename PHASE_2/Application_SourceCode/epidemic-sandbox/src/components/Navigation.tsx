import React, { Component } from 'react';
import { ReactComponent as Logo } from '../images/logo.svg';
import Grid from '@material-ui/core/Grid';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import Home from "./Home";
import Map from "./Map";
import ChartPage from "./Charts";
import ContactUs from './ContactUs';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Navigation = () => {
    return (
        <>
            <Navbar collapseOnSelect fixed='top' expand='sm' bg='light' variant='dark'>
                <Container>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                    <Navbar.Collapse id='responsive-navbar-nav'>
                        <Nav>
                            <Nav.Link href='/'>Home</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Navigation;
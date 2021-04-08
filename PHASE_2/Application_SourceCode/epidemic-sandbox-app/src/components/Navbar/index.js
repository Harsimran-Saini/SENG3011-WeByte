import React from 'react'
import * as ReactBootStrap from 'react-bootstrap'
import Logo from "../../images/logo.svg"

const navbar = {backgroundColor: '#e4f1f5'};

const Navbar = () => {
    return (
        <>
            <ReactBootStrap.Navbar className="nav1" style={navbar}>
                <ReactBootStrap.Navbar.Brand>
                    <img alt="" src={Logo} width="40" height="40" className="d-inline-block align-top"/>    
                </ReactBootStrap.Navbar.Brand>
                {/* <p className="text-center mt-4 mb-4">Or right-aligned</p> fontWeight: 'bold' , */ }
                <span id="textSpan" style={ {fontSize: 25, fontFamily: "Impact"} } >Epidemic Sandbox</span>
            </ReactBootStrap.Navbar>
            
        </>
    )
}

export default Navbar

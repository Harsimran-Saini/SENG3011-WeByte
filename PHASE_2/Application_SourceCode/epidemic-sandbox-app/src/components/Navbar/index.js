import React from 'react'
import * as ReactBootStrap from 'react-bootstrap'
import Logo from "../../images/logo.svg"
import "./navbar.css";
import { saveAs } from "file-saver";
import { AlignmentType,Document,HeadingLevel,Packer,Paragraph,TabStopPosition,TabStopType,TextRun } from "docx";

const navbar = {backgroundColor: '#e4f1f5'};
  

const generate = () => {
    var myElement = document.getElementsByClassName("chartjs-render-monitor");
    var dataURL = myElement[0].toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
    console.log(dataURL)
    const doc = new Document({
        sections: []
      });
    

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });
  }

const Navbar = () => {
    return (
        <>
            <ReactBootStrap.Navbar className="nav1" style={navbar}>
                <ReactBootStrap.Navbar.Brand>
                    <img alt="" src={Logo} width="40" height="40" className="d-inline-block align-top"/>    
                </ReactBootStrap.Navbar.Brand>
                <span id="textSpan" style={ {fontSize: 25} } >Epidemic Sandbox<button onClick={generate} style={{ backgroundColor: 'transparent', boxShadow: '0 0 0 transparent', border: '0 solid transparent', textShadow: '0 0 0 transparent'}}><i style={ {fontSize: 30, position: 'absolute', right: 20, top: 18} }class="fa fa-cloud-download"></i></button></span>
                
            </ReactBootStrap.Navbar>
            
        </>
    )
}

export default Navbar

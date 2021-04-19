import React, { Component } from 'react'
import "./Card.css";
import Arrow from "../../images/blue-arrow.png"

class TemplateCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sheetsRefresh: false,
            url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlw_9hbBksRs9MfxY2J3AMZd4nwhssHxuNBBIyInRj3rRe6YV_GvXohMErj1b2YNo6ZV5a0tr7hXn4/pubhtml?widget=true&amp;headers=false"
        }
        this.handleSheetsRefresh = this.handleSheetsRefresh.bind(this);

    }
    handleSheetsRefresh() {
        this.setState(({ sheetsRefresh }) => ({ sheetsRefresh: !sheetsRefresh }));
        this.setState(({ url }) => ({ url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlw_9hbBksRs9MfxY2J3AMZd4nwhssHxuNBBIyInRj3rRe6YV_GvXohMErj1b2YNo6ZV5a0tr7hXn4/pubhtml?widget=true&amp;headers=false" }));

    }
    render() {
        return (
            <div className="template_front">
                <p><i className="fa-fw fa fa-edit"></i>      Google Sheets Template</p>
                <button><img src={Arrow} alt="" onClick={this.handleSheetsRefresh}/></button>  
                <hr/>
                <div>
                    <iframe key={this.state.sheetsRefresh} title="Google Sheets Template" src={this.state.url}>Template</iframe>
                    <button onClick={()=> window.open("https://docs.google.com/spreadsheets/d/1BCNRtoJorviGwx1aZia5o8ObbshvLVuIc7Xjgn5xrvc/edit?usp=sharing", "_blank")}>Click to edit Google Sheets</button>
                </div> 
            </div>
        );
    }
}

export default TemplateCard;
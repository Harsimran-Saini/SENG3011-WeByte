import React from 'react'
import "./Card.css";

const TemplateCard = () => {
    return (
        <div className="template_front">
            <p><i class="fa-fw fa fa-edit"></i>      Google Sheets Template</p>
              
            <hr/>
            <div>
            <iframe title="Google Sheets Template" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRlw_9hbBksRs9MfxY2J3AMZd4nwhssHxuNBBIyInRj3rRe6YV_GvXohMErj1b2YNo6ZV5a0tr7hXn4/pubhtml?widget=true&amp;headers=false">Template</iframe>
            
            <button onClick={()=> window.open("https://docs.google.com/spreadsheets/d/1BCNRtoJorviGwx1aZia5o8ObbshvLVuIc7Xjgn5xrvc/edit?usp=sharing", "_blank")}>Click to edit Google Sheets</button>

            </div>
            
          </div>
    )
}

export default TemplateCard

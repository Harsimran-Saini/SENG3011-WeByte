import React from 'react'
import "./Card.css";
import Twitter from "../../images/trump-blocked.png"
const Vaccines2Card = () => {
    return (
        <div className="social_media_front">
        {/* <i class="fa fa-hashtag"></i> */}
            <p><i class="fa fa-twitter"></i>Social Media</p>
            <hr/>
            <img src={Twitter} alt="twitter-post"/>
        </div>
    )
}

export default Vaccines2Card

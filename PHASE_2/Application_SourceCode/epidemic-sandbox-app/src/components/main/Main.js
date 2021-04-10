import "./Main.css";
import React from 'react';
import CasesCard from '../Card/Cases_Card'
import DeathsCard from '../Card/Deaths_Card'
import VaccinesCard from '../Card/Vaccines_Card'
import RegressionCard from '../Card/Regression_Card'
import TemplateCard from "../Card/TemplateCard";
import SocialMediaCard from "../Card/SocialMediaCard";
import MapCard from "../Card/MapCard";

const Main = () => {
  
  return (
    <div> 
    <main>
      <div className="main__container">

        <div className="dashboard_title">
          <div className="dashboard">
            <h1><i className="fa fa-home"></i>  / Dashboard</h1>
          </div>
        </div>
        
        <div className="top_cards">
          <CasesCard/>
          <DeathsCard/>
          <VaccinesCard/>
        </div>
        
        <div className="first_row">
            <RegressionCard />
            <TemplateCard/>
        </div>
        
        <div className="charts">
          <SocialMediaCard/>
          <MapCard/>
          <br/><br/>
        </div>
        
      </div>
      
    </main>
    </div>
  );
};

export default Main;
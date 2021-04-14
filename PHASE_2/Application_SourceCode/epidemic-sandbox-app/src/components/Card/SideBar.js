import React, { useState } from 'react'
import "./Card.css";
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SideBar = () => {
    const [startDate, setStartDate] = useState(new Date());
    //if sidebar is opened or closed
    const [showSidebar, setShowSidebar] = useState(true)
    const onClickSidebar = () => {
      setShowSidebar(!showSidebar);
    };

    // filter by date, change api, filter by location
    const countryFilter = [
      { value: 'australia', label: 'Australia' },
      { value: 'china', label: 'China' },
      { value: 'usa', label: 'USA' },
      { value: 'ghana', label: 'Ghana' },
      { value: 'newzealand', label: 'New Zealand' },
      { value: 'russia', label: 'Russia' },
      { value: 'world', label: 'World' }
    ]
    
    const apiFilter = [
      { value: 'promed', label: 'PROMED-Mail (default)' },
      { value: 'who', label: 'World Health Organisation (WHO)' },
      { value: 'googlesheets', label: 'Google Sheets (Upload Your Own Data)' },
      { value: 'covid', label: 'COVID-19 API' }
    ]
    return (
        <div className="nav">
        
          <button onClick={onClickSidebar}><i className="fa fa-times"></i></button>
          <p>Filters</p>
          
          <DatePicker className="date" selected={startDate} onChange={date => setStartDate(date)} />
          <Select className="cFilter" options={countryFilter} />
          <Select className="aFilter" options={apiFilter} />
          
        </div>
    )
}


export default SideBar

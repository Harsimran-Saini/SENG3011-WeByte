import React from 'react';
import './Marker.css';
import { makeStyles } from "@material-ui/core/styles";
//import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
      color: "rgba(255, 255, 255, 0.87)"
    },
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 13
    }
  }));
  
  function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();
  
    return <Tooltip arrow classes={classes} {...props} />;
  }

const Marker = (props) => {
    const { reports, cases, name } = props;
    return (
        <BootstrapTooltip placement="top"
        title={
          <React.Fragment>
            <Typography style={{fontSize: 14, fontWeight: 700}} color="inherit">{name}</Typography>
            {" "}{"- COVID-Cases: "}{cases}<br/>{"- News Reports: "}{reports}
          </React.Fragment>
        }
      >
      <div className="marker"
        style={{ backgroundColor: 'rgba(245, 56, 56, 0.8)', cursor: 'pointer'}}
      />
      </BootstrapTooltip>
    );
  };

  export default Marker;

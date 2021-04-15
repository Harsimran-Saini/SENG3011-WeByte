import React from 'react'
import * as ReactBootStrap from 'react-bootstrap'
import Logo from "../../images/logo.svg"
import "./navbar.css";
import { saveAs } from "file-saver";
import { ImageRun,Document,HeadingLevel,Table,TableCell,TableRow,Packer,Paragraph,WidthType } from "docx";

import { Chart } from "chart.js"
const navbar = {backgroundColor: '#e4f1f5'};
  

const generate = () => {
  var regressionHTML = document.getElementById("regression-back")
  // var canvas = myElement1.getElementsByClassName("chartjs-render-monitor")
  // console.log(canvas[0].getContext('2d'))
  // var chart = new Chart(canvas[0].getContext('2d'))
  // console.log(chart)
  var scatterdata=[];
  var linedata=[];
  Chart.helpers.each(Chart.instances, function(instance){
    console.log(instance)
    if (instance.config.type === "scatter"){
      var mydata = {}
      mydata['label'] = instance.config.data.datasets[0].label;
      mydata['coordinates'] = instance.config.data.datasets[0].data;
      var i = 0;
      while (i < mydata['coordinates'].length){
        mydata['coordinates'][i]['label'] = instance.config.data.labels[i];
        i++;
      }
      mydata['image'] = instance.canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
      scatterdata.push(mydata)
    }else if (instance.config.type === "line"){
      var mydata = {}
      mydata['label'] = instance.config.data.datasets[0].label;
      mydata['coordinates'] = []
      var i = 0;
      while (i < instance.config.data.datasets[0].data.length){
        var myobj = {}
        myobj['label'] = instance.config.data.labels[i];
        myobj['value'] = instance.config.data.datasets[0].data[i];
        mydata['coordinates'].push(myobj)
        i++;
      }
      mydata['image'] = instance.canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
      linedata.push(mydata)
    }
  })

  var scattertables = [];
  scattertables = 
    [...scatterdata
      .map(mytable=> {
        const arr = [];
        arr.push(
          new Table({
            style: "MyCustomTableStyle",
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({
                      text: mytable['label'],
                      heading: HeadingLevel.HEADING_1
                    })],
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      text: "x",
                      heading: HeadingLevel.HEADING_1
                    })],
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      text: "y",
                      heading: HeadingLevel.HEADING_1
                    })],
                  }),
                ],
              }),
              ...mytable['coordinates']
                .map(myval => {
                  const arr1 = [];
                  arr1.push(
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph({
                            text: myval["label"].toString()
                          })],
                        }),
                        new TableCell({
                          children: [new Paragraph({
                            text: myval["x"].toString()
                          })],
                        }),
                        new TableCell({
                          children: [new Paragraph({
                            text: myval["y"].toString()
                          })],
                        }),
                      ],
                    }),
                  )
                  return arr1;
                })
                .reduce((prev, curr) => prev.concat(curr), [])
            ],
          })
        )
        return arr;
      })
      .reduce((prev, curr) => prev.concat(curr), [])
    ]
  
  var linetables = [];
  linetables = 
    [...linedata
      .map(mytable=> {
        const arr = [];
        arr.push(
          new Table({
            style: "MyCustomTableStyle",
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({
                      text: "Months",
                      heading: HeadingLevel.HEADING_1
                    })],
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      text: mytable['label'],
                      heading: HeadingLevel.HEADING_1
                    })],
                  }),
                ],
              }),
              ...mytable['coordinates']
                .map(myval => {
                  const arr1 = [];
                  arr1.push(
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph({
                            text: myval["label"].toString()
                          })],
                        }),
                        new TableCell({
                          children: [new Paragraph({
                            text: myval["value"].toString()
                          })],
                        }),
                      ],
                    }),
                  )
                  return arr1;
                })
                .reduce((prev, curr) => prev.concat(curr), [])
            ],
          })
        )
        return arr;
      })
      .reduce((prev, curr) => prev.concat(curr), [])
    ]
  
  const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: regressionHTML.innerText
          }),
          ...scatterdata
            .map(mytable => {
              const arr = [];
              arr.push(
                new Paragraph({
                  children:[
                    new ImageRun({
                      data: Uint8Array.from(atob(mytable['image']), c =>
                        c.charCodeAt(0)
                      ),
                      transformation: {
                        width: 600,
                        height: 500
                      }
                    }),
                  ]
                }),
              )
              return arr;
            })
            .reduce((prev, curr) => prev.concat(curr), []),
          ...linedata
            .map(mytable => {
              const arr = [];
              arr.push(
                new Paragraph({
                  children:[
                    new ImageRun({
                      data: Uint8Array.from(atob(mytable['image']), c =>
                        c.charCodeAt(0)
                      ),
                      transformation: {
                        width: 300,
                        height: 200
                      }
                    }),
                  ]
                }),
              )
              return arr;
            })
            .reduce((prev, curr) => prev.concat(curr), []),
          ...scattertables,
          ...linetables,
        ],
      }]
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
                <span id="textSpan" style={ {fontSize: 25} } >Epidemic Sandbox<button title="Click to Download a report!" onClick={generate} style={{ backgroundColor: 'transparent', boxShadow: '0 0 0 transparent', border: '0 solid transparent', textShadow: '0 0 0 transparent'}}><i style={ {fontSize: 30, position: 'absolute', right: 20, top: 18} }class="fa fa-cloud-download"></i></button></span>
                
            </ReactBootStrap.Navbar>
            
        </>
    )
}

export default Navbar

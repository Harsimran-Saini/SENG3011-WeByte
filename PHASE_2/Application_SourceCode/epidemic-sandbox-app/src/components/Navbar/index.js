import React from 'react'
import * as ReactBootStrap from 'react-bootstrap'
import Logo from "../../images/logo.svg"
import "./navbar.css";
import { saveAs } from "file-saver";
import { ImageRun,Document,HeadingLevel,Table,PageNumberFormat,TableOfContents,StyleLevel,Header,TextRun,PageNumber,Footer,AlignmentType,PageBreak,TableCell,TableRow,Packer,Paragraph,WidthType } from "docx";

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
                      children: [
                        new TextRun({
                          text: mytable['label'],
                          bold: true
                        }),
                      ]
                    })],
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [
                        new TextRun({
                          text: "x",
                          bold: true
                        }),
                      ]
                    })],
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [
                        new TextRun({
                          text: "y",
                          bold: true
                        }),
                      ]
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
                      children: [
                        new TextRun({
                          text: "Months",
                          bold: true
                        }),
                      ]
                    })],
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [
                        new TextRun({
                          text: mytable['label'],
                          bold: true
                        }),
                      ]
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
  var date = new Date();
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "MySpectacularStyle",
          name: "My Spectacular Style",
          basedOn: "Heading1",
          next: "Heading1",
          quickFormat: true,
          run: {
              italics: true,
              color: "990000",
          },
        },
      ],
    }, 
    sections: [{
      properties: {
        page: {
          pageNumbers: {
              start: 1,
              formatType: PageNumberFormat.DECIMAL,
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun("Epidemic Sandbox. "),
                new TextRun({
                  children: ["Page Number ", PageNumber.CURRENT],
                }),
                new TextRun({
                  children: [" to ", PageNumber.TOTAL_PAGES],
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun("Epidemic Sandbox. "),
                new TextRun({
                  children: ["Page Number: ", PageNumber.CURRENT],
                }),
                new TextRun({
                  children: [" to ", PageNumber.TOTAL_PAGES],
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({
          text: ""
        }),
        new Paragraph({
          text: ""
        }),
        new Paragraph({
          text: ""
        }),
        new Paragraph({
          text: "Epidemic Sandbox Report.",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `Created ${date}`,
              bold: true
            }),
            new PageBreak(),
          ]
        }),
        new Paragraph({
          text: "Table of Contents.",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER
        }),
        new TableOfContents("Summary", {
          hyperlink: true,
          headingStyleRange: "1-5",
          stylesWithLevels: [new StyleLevel("MySpectacularStyle", 1)],
        }),
        new Paragraph({
          children: [
            new PageBreak(),
          ]
        }),
        new Paragraph({
          text: "Regression Analysis",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: regressionHTML.innerText
        }),
        new Paragraph({
          text: ""
        }),
        new Paragraph({
          text: "Scatter Graphs",
          heading: HeadingLevel.HEADING_2,
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
        new Paragraph({
          text: ""
        }),
        new Paragraph({
          text: "Line Graphs",
          heading: HeadingLevel.HEADING_2,
        }),
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
        new Paragraph({
          children: [
            new PageBreak(),
          ]
        }),
        new Paragraph({
          text: "Bibliography",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "https://app.swaggerhub.com/apis/Seng-We-Byte/We-Byte/1.0.0#/",
          bullet: {
            level: 0 
          }
        }),
        new Paragraph({
          text: "https://documenter.getpostman.com/view/10808728/SzS8rjbc#7934d316-f751-4914-9909-39f1901caeb8",
          bullet: {
            level: 0 
          }
        }),
        new Paragraph({
          children: [
            new PageBreak(),
          ]
        }),
        new Paragraph({
          text: "Appendix",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "Data from scatter plots:",
          bullet: {
            level: 0
          }
        }),
        ...scattertables,
        new Paragraph({
          text: ""
        }),
        new Paragraph({
          text: "Data from line graphs:",
          bullet: {
            level: 0
          }
        }),
        ...linetables,
      ],
    }]
});
  

  Packer.toBlob(doc).then(blob => {
    console.log(blob);
    saveAs(blob, "Epidemic Sandbox Report.docx");
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

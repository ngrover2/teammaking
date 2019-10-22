import React from 'react';
import { parse } from 'csv-parse/lib/sync';
var path = require('path');

import { Button, Card, Image } from 'semantic-ui-react'
import { default as PickRosterFileComponent } from "./PickRosterFileComponent";
import { default as DisplayRosterDetailsComponent  } from "./DisplayRosterDetailsComponent"
import { default as ErrorMessageComponent } from "./ErrorMessageComponent";
import { Table, Header, HeaderCell, Row } from 'semantic-ui-react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

class DisplayCourseComponent extends React.Component {
  constructor(props){
    super(props)
    this.errorMessageRef = React.createRef();
    this.getRosterFile = this.getRosterFile.bind(this);
    this.state = {
        selectedFile: null,
        redirectTo:"courseDetails",
        errorMessageModalOpen:false,
        errorMessage:""
    }
  }

  getRosterFile(fileObj){
    if (fileObj) this.setState({selectedFile:fileObj.name}, () => console.log(`Selected: ${fileObj.name}`));
    let fileReader = new FileReader();
    try{
      var dataArray = [];
      fileReader.readAsText(fileObj)
      
      fileReader.onload = ((e) => {
        try{
          var data = fileReader.result
          if (data) dataArray = data.match(/[^\r\n]+/g);
          if (dataArray instanceof Array) {
            // get the first row of csv as header using Array.splice() which would remove the first row from data.
            let headerString = dataArray.splice(0,1);
            let headerFields = headerString[0].split(",");

            // construct value objects from rest of the data
            let valueObjects = []
            dataArray.forEach((value)=>{
              let valueObj = {}
              value.split(",").forEach((splitVal,splitIdx)=>{
                valueObj[headerFields[splitIdx]] = splitVal
              })
              valueObjects.push(valueObj);
            });

            // console.log("header", headerFields);
            // console.log("values", valueObjects)

            if (headerFields.length == 4){
              this.setState({
                fileHeaderFieldsArray:headerFields,
                fileValueObjects:valueObjects
              }, () => this.setState({redirectTo:"viewUploadedRoster"}) );
            }else{
              this.setState({errorMessage: `Num of columns in the selected file is not 4`, errorMessageModalOpen:true},() => this.errorMessageRef.current.ref.current.click());
            }
          }else{
            this.setState({errorMessage: "The selected file does not have data in the right format", errorMessageModalOpen:true},() => this.errorMessageRef.current.ref.current.click());
          };
        }catch(error){
          throw error;
        }
      })
      fileReader.onerror = ((e) => {
        if (this.errorMessageRef && this.errorMessageRef.current) {
          this.setState({errorMessage:`Error reading ${fileObj.name || "undefined"} file`, errorMessageModalOpen:true},() => this.errorMessageRef.current.ref.current.click());
        };
      })
    }catch(error){
      if (this.errorMessageRef && this.errorMessageRef.current) {
        console.log("Errormessagemodal exists")
        this.setState({errorMessage: error.message || (`Error reading ${fileObj.name || "undefined"} file`), errorMessageModalOpen:true},() => this.errorMessageRef.current.ref.current.click());
      }else{
        console.log("Errormessagemodal doesnt exist")
      };
      console.log(error)
    }
  }


  render() {
    this.filePickerRef = React.createRef();
      return (this.state.redirectTo === "courseDetails" && (
        <Card style={{marginLeft:"10rem", marginTop:"10rem"}}>
              <Card.Content>
                <Image
                  floated='right'
                  size='mini'
                  src='https://via.placeholder.com/128.png'
                />
                <Card.Header>{this.props.name}</Card.Header>
                <Card.Meta>{this.props.classCode}</Card.Meta>
                <Card.Description>
                  {this.props.courseDescription}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button basic color='green' onClick={() => this.setState({redirectTo:"viewDownloadedRoster"})}>
                    View Roster
                  </Button>
                  <Button basic color='red' onClick={() => {
                      if (document.getElementById("hiddenFilePickerButtonId") != "undefined"){
                        var fp = document.getElementById("hiddenFilePickerButtonId");
                        fp.click();
                      }else{
                        console.log("fp is undefined");
                      }
                    }
                  }>
                    Import Roster
                  </Button>
                  <PickRosterFileComponent passSelectedFile={this.getRosterFile} />
                </div>
              </Card.Content>
              <ErrorMessageComponent ref={this.errorMessageRef} open={this.state.errorMessageModalOpen} errorMessage={this.state.errorMessage} closeModal={() => this.setState({errorMessageModalOpen:false})}/>
        </Card>
      )
      ||
      (this.state.redirectTo === "viewDownloadedRoster" && (
        <Redirect push={true} to="/course/roster/9"/>
      ))
      ||
      (this.state.redirectTo === "viewUploadedRoster" && (
        <Redirect push={true} to={{ pathname:"/course/chooseroster/view", state : {header:this.state.fileHeaderFieldsArray, data:this.state.fileValueObjects}  }} />
      ))
      );
    }
  }

export default DisplayCourseComponent;
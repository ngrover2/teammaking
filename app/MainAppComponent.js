import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import {default as DisplayCourseComponent} from "./DisplayCourseComponent";
import {default as RosterDetails} from "./DisplayRosterDetailsComponent";
import {default as DisplayPickedFile} from "./DisplayPickedFile";
import { Table, Header, Cell } from 'semantic-ui-react';





export default function MainAppComponent() {
    var courseDetails = {
        name:"SSDI Fall'19",
        classCode:"ITCS 6112 - 8112",
        proffessorName:"Harini Ramaprasad",
        taName:"Manav Mittal",
        courseStartDate:"August 19, 2019",
        courseEndDate:"December 12, 2019",
        courseDescription:"This course is about teaching software programming principles and Software architecture and design."
    }

    const HeaderCellComponent = (props) => (<Table.HeaderCell singleLine>{props.headerName}</Table.HeaderCell>);
    var getHeaders = () => {
        const header = ["name", "email", "skill", "age"]
        var ret = []
        header.forEach((v,i) => {
            ret.push(<HeaderCellComponent key={v} headerName={v}/>);
        });
        return ret;
    }
    const headers = getHeaders();

    return (
        <Router>
            <Link to="/course"/>
            <Link to="/"/>
            <Switch>
                <Route exact={true} path="/course">
                    <DisplayCourseComponent {...courseDetails}/>
                </Route>
                <Route exact={true} path={`/course/roster/9`}>
                    <RosterDetails>{headers}</RosterDetails>
                </Route>
                <Route 
                    exact={true} 
                    path={"/course/chooseroster/view"}>
                        <DisplayPickedFile />
                </Route>
                <Route path="/">
                    <DisplayCourseComponent {...courseDetails}/>
                </Route>
            </Switch>
        </Router>
    );
}


// <Route 
//                     exact={true} 
//                     path={"/course/chooseroster/view"} 
//                     children={({ match })=>{
//                             console.log("match is: ", match);
//                             return (match.path == "/course/chooseroster/view") ? <DisplayPickedFile /> : <RosterDetails></RosterDetails>
//                         }
//                     }
//                 >
//                 </Route>
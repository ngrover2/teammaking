// Main App script. Compiles components from other files.
import React from 'react';
import { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";

  // navit
import {default as DisplayCourseComponent} from "./Course/DisplayCourseComponent";
import {default as RosterDetails} from "./Roster/DisplaySavedRosterComponent";
import {default as DisplayPickedFile} from "./Roster/DisplayPickedFile";
import { Table, Header, Cell, Icon, Button, Grid, GridColumn, Container } from 'semantic-ui-react';
import {default as SidebarComponent } from "./SidebarComponent";
import { default as HeaderComponent } from "./AppHeaderComponent";
import { default as SurveyFormQuestionComponent } from "./Survey/SurveyFormQuestionComponent";
import { default as ShowStudentCompatibilityScoresComponent } from "./Teams/ShowStudentsComponent";

import {default as AnswerSurveyComponent } from "./StudentAnswerSurvey/AnswerSurveyComponent.jsx"; // rahul
import { default as RenderSavedSurveyComponent } from "./Survey/RenderSavedSurveyComponent"

export default function MainAppComponent() {
    const wHeight = window.innerHeight;
    const [ sidebarVisible, setSidebarVisible ] = useState(false);
    
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
    const appBackGroundStyle = {
        background:"linear-gradient(0deg,rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(/assets/images/background.jpg)"
        // background:"linear-gradient(0deg,rgba(0,0,0,0.7),rgba(0,0,0,0.7))"
    }

    return (
        <div>
        <Router>
            <Route path="/professor/:pid/">
                <SidebarComponent setVisible={setSidebarVisible} visible={sidebarVisible} pushStyle={appBackGroundStyle}>
                    <Grid style={{ background:"inherit"}}>
                        <Grid.Row>
                            <HeaderComponent setSidebarVisible={setSidebarVisible}/>
                        </Grid.Row>
                        <Grid.Row>
                            <GridColumn width={1}/>
                            <GridColumn width={14}>
                                <Switch>
                                    <Route exact={true} path={`/professor/:pid/course/:cid/roster/:rid`}>
                                        <RosterDetails>{headers}</RosterDetails>
                                    </Route>
                                    <Route 
                                        exact={true} 
                                        path={"/professor/:pid/course/:cid/survey/create"}>
                                            <SurveyFormQuestionComponent />
                                    </Route>
                                    <Route 
                                        exact={true} 
                                        path={"/professor/:pid/course/:cid/survey/:sid"}>
                                            <RenderSavedSurveyComponent />
                                    </Route>
                                    <Route 
                                        exact={true} 
                                        path={"/professor/:pid/course/:cid/chooseroster/view"}>
                                            <DisplayPickedFile />
                                    </Route>
                                    <Route exact={true} 
                                            path="/professor/:pid/course"
                                            children = {({ match }) => <DisplayCourseComponent match={match}/>}
                                    />
                                    <Route exact={true} 
                                            path="/professor/:pid/course/:cid/survey/:sid/teams"
                                            children = {({ match }) => <ShowStudentCompatibilityScoresComponent match={match}/>}
                                    />
                                    <Route
                                            path ="/"
                                            children = {() => <Redirect to={"/"}/>}
                                    />
                                </Switch>
                            </GridColumn>
                            <GridColumn width={1}/>
                        </Grid.Row>
                    </Grid>
                </SidebarComponent>
            </Route>
            <Route exact = {true} path={"/respond/:surveyId"}>
                <AnswerSurveyComponent/>
            </Route>
            <Route exact = {true} path="/">
                <SidebarComponent setVisible={setSidebarVisible} visible={sidebarVisible} pushStyle={appBackGroundStyle} pid={1}>
                    <Grid style={{ background:"inherit"}}>
                        <Grid.Row>
                            <HeaderComponent setSidebarVisible={setSidebarVisible} pid={1}/>
                        </Grid.Row>
                        <Grid.Row style={{height:wHeight}}>
                            <Container style={{ display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                                <div style={{ fontSize:"5rem", color:"white", lineHeight:"initial" }}>Welcome to Team Maker</div>
                                <div style={{ margin:"5px", fontSize:"1.5rem", color:"ghostwhite" }}>Click <Link style={{ margin:"1rem 1rem" }} to={"/professor/1/course"}><Button positive>Here</Button></Link> to get started</div>
                            </Container>
                        </Grid.Row>
                    </Grid>
                </SidebarComponent>
            </Route>
        </Router>
        </div>
    );
}

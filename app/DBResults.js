import React from 'react';
import { Button, Modal, Grid, Segment, Label } from 'semantic-ui-react';
var { reject, resolve } = Promise;
// reject.bind(Promise)
// resolve.bind(Promise)

const DBRow = (props) => {
    return (
        <Grid.Row columns={12}>
            <Grid.Column computer={2} largeScreen={2} mobile={8} tablet={8}>
                <Label>
                    {props.rank}
                </Label>
            </Grid.Column>
            <Grid.Column computer={3} largeScreen={3} mobile={8} tablet={8}>
                <Label>
                    {props.artist}
                </Label>
            </Grid.Column>
            <Grid.Column computer={7} largeScreen={7} mobile={12} tablet={12}>
                <Label>
                    {props.title}
                </Label>
            </Grid.Column>
        </Grid.Row>
    );
}


class DisplayGreetingsComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            dbResults:"Fetching Results...",
            modalOpen:false
        }
        this.getDataFromDB = this.getDataFromDB.bind(this);
    }

    

    getDataFromDB(){
        var setDbResults = function(results){
            this.setState({dbResults:results});
        }.bind(this);

        this.setState({modalOpen:true});
        // var results = fetch("http://localhost:3000/api/helloTeam");
        // var results = fetch("http://localhost:3000/api/helloTeam");
        var results = fetch("/api/helloTeam");
        results
            .then((res) => {
                console.log("Resolving")
                console.log(res);
                return Promise.resolve(res)
                
            },(error) => {
                return Promise.reject(error)
            })
            .then((resolved)=>{
                if (resolved.status == 200){
                    return resolved.json()
                }
            })
            .then((jsonResult)=>{
                if (jsonResult){
                    console.log("resolved",jsonResult);
                    const dbRows = jsonResult.result.map((row, i) => <DBRow key={i} {...row}/>);
                    console.log(dbRows)
                    setDbResults(dbRows);
                }else{
                    console.log("status is 200")
                    setDbResults(<div>{`No Results Returned`}</div>);
                }
            })
            .catch((error)=>{
                setDbResults(<div>{`Error Occurred: ${error.message}`}</div>);
            })
    }
    render(){
    return (
            <Grid stackable={true} centered={true} divided verticalAlign={"middle"} style={{ width:"inherit", height:"inherit" }}>
                <Grid.Row style={{ width:"inherit", height:"inherit" }}>
                    <Grid.Column computer={6} largeScreen={6} mobile={12} tablet={6}>
                        <div style={{ display:"flex" }}>
                            <Segment color='red' size={"massive"} style={{ margin:"auto" }}>
                                <Modal trigger={
                                    <Button>
                                        {"Say Hi"}
                                    </Button>
                                }
                                >
                                    <Modal.Content>
                                        <Label>{"Hello!"}</Label>
                                    </Modal.Content>
                                </Modal>
                                
                            </Segment>
                        </div>
                    </Grid.Column>
                    <Grid.Column computer={6} largeScreen={6} mobile={12} tablet={6}>
                        <div style={{ display:"flex" }}>
                            <Segment color='red' size={"massive"} style={{ margin:"auto" }}>
                                <Modal trigger={
                                    <Button onClick={this.getDataFromDB}>
                                        {"Show DB Trick"}
                                    </Button>
                                }
                                open={this.state.modalOpen}
                                >
                                    <Modal.Content>
                                        {"SONGS ON MY MIND:"}
                                        {this.state.dbResults}
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button onClick={()=> this.setState({modalOpen:false})}>
                                            {"Ok"}
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </Segment>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
    );
}
}

export default DisplayGreetingsComponent;
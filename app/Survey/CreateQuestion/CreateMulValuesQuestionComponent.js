import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Input, Label, Grid, Segment, Message, Header } from 'semantic-ui-react';
import { questionWeights,QuestionWeightFormFieldComponent } from "../../Utils/UtilComponents";


export default function CreateMulValuesQuestionComponent(props){
    const [ questionText, setQuestionText ] = useState("");
	const [ questionWeight, setQuestionWeight ] = useState("");
	const [ maxNumValues, setMaxNumValues ] = useState(0);
    const [ qtexterror ,setQtexterror ] = useState(false);
    const [ qMaxNumError, setQMaxNumError ] = useState(false);
    const [ questionObject, setQuestionObject ] = useState({
		qtext: "",
		qid: props.qid,
		qtype: props.qtype,
        qweight: "",
        qMaxVals: 0
	});
    const [ questionUpdatedId, setQuestionUpdatedId ] = useState(0);
    const [ questionObjectUpdatedId, setQuestionObjectUpdatedId ] = useState(0);

    const [ clearInputsId, setClearInputsId ] = useState(0);

    useEffect(() => {
		setQuestionText("");
        setQuestionWeight(null);
        setMaxNumValues(null);
        setQMaxNumError(false);
	},[clearInputsId]);

    useEffect(() => {
        setQuestionText("");
    },[props.qid])
    
    useEffect(() => {
        if (questionUpdatedId == 0) return
        let updatedQuestionObj = {
            qid: props.qid,
            qtype: props.qtype,
            qtext: questionText,
            qweight: questionWeight,
            qMaxVals: maxNumValues
        }
        setQuestionObject(updatedQuestionObj);
        setQuestionObjectUpdatedId(questionObjectUpdatedId+1);
    },[questionUpdatedId])


    useEffect(() => {
        if (questionObjectUpdatedId == 0) return
        props.setNewQuestionId();
        props.onQuestionUpdated(questionObject);
        setQuestionText("");
        setQuestionWeight(null);
        setMaxNumValues(null);
        setQMaxNumError(false);
    },[questionObjectUpdatedId])
    

    return  [
        <Grid.Row key={`addTextType-q${props.qid}-grid`} columns={16}>
			<Grid.Column width={16} key={`addMC-q${props.qid}-grid-col-1`}>
                <Segment>
                    <Form error>
                        <Form.Field
                            error={qtexterror}
                        >
                            <Label size="large">Enter Question Text : </Label>
                            <input  placeholder="Type Question Text.."  value={questionText} onChange={(e) => {
                                if (qtexterror == true && questionText != "") {
                                    setQtexterror(false);
                                }
                                setQuestionText(e.target.value)
                            }}/>
						</Form.Field>
						<Form.Select
							options={[1,2,3,4,5,6,7,8,9,10].map((v)=> Object.assign({},{key:v,value:v,text:v}))}
							onChange={(e,{value}) => setMaxNumValues(value)}
							value={maxNumValues}
							label={<Label size="large">Select number of values that can be added</Label>}
						>
                        </Form.Select>
                        {
                            qMaxNumError == true &&
							<Form.Field
								key={`mvals-Q-${props.qid ||-1}-max-vals-not-set`}
							>
								<Message error size="tiny">{`Attention Professor! You have not set a maximum number of values for this question yet!`}</Message>
							</Form.Field>
						}
                        <QuestionWeightFormFieldComponent options={questionWeights} onWeightUpdated={(weight) => setQuestionWeight(weight)} selectedWeight={questionWeight}/>
                        <Form.Group>
							<Form.Button onClick={() => {
								if (questionText != ""){
                                    if (maxNumValues == 0){
                                        setQMaxNumError(true);
                                    }else{
                                        setQuestionUpdatedId(questionUpdatedId+1);
                                    }
								}else{
									setQtexterror(true);
								}
							}}>
								Save Question
							</Form.Button>
							<Form.Button onClick={() => {
                                // setQuestionText("");
								// setQuestionWeight(null);
                                // setMaxNumValues(null);
                                // setQMaxNumError(false);
                                setClearInputsId(clearInputsId+1);
							}}>
								Clear
							</Form.Button>
						</Form.Group>
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid.Row>
    ];
}
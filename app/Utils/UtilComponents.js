import React from 'react'
import { useState, useEffect } from 'react';
import { Form, Divider, Grid, Message, Header, Label, Segment } from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import moment from 'moment';
moment.locale("en-gb");
export const FullWidthDivider = (props) => <Divider id="visiblefullwidthdivider"/>

export const questionWeights = [ "Extremely Important", "Very Important", "Somewhat Important", "Little Important", "Not Important" ];
export const qtypeToReadableMapping = {
	text: "Text", 
	multiplechoice: "Multiple Choice",
	multiplevalues: "Multiple Values", 
	singlevalue: "Single Choice", 
	schedule: "Schedule"
}

export const DatePickerComponent = (props) => {
	const [ date, setDate ] = useState((props.defaultDate && moment.isMoment(props.defaultDate)) ? moment(props.defaultDate).toDate() : moment().toDate());
	useEffect(()=> {
		let isMoment = moment.isMoment(props.defaultDate)
		// console.log("Recived new props.defaultDate", props.defaultDate, "which isMoment ? - ", isMoment);
		if (isMoment) {
			setDate(moment(props.defaultDate).toDate());
		}else{
			setDate(props.defaultDate);
		}
	},[props.defaultDate]);
    return (
      <DatePicker dateFormat="yyyy/MM/dd" selected={date} style={props.style ? props.style : {}} onChange={date => {let d = moment(date).utc() /*.format("YYYY-MM-DD HH:mm:ss")*/; setDate(date);console.log("will change date to", d); props.onChange(d)}} />
    );
};

export const GridRowMessageComponent = (props) => {
	return(
		<Grid.Row>
			<Grid.Column width={16}>
				<Message size={props.size || "small"} header={<Header>{props.message || ""}</Header>}/>
			</Grid.Column>
		</Grid.Row>
	);
}

export const QuestionWeightGridRowComponent = (props) => {

	const [ selected, setSelected ] = useState(props.selectedWeight || "None");
	const [ weightUpdatedId, setWeightUpdatedId ] = useState(0);

	useEffect(() => {
		if (weightUpdatedId == 0) return;
		props.onWeightUpdated(selected);
	},[weightUpdatedId])

	useEffect(() => {
		setSelected(props.selectedWeight)
	},[props.selectedWeight])

	const renderWeightOptions = () => {
		let renderedOptions = props.options.map((v,i)=> 
			<Form.Radio
				key={`qweight-option-${i}`}
				label={v}
				value={v}
				checked={selected == v}
				onChange={()=> {setSelected(v);setWeightUpdatedId(weightUpdatedId+1)} }
			/>
		)
		return renderedOptions;
	}

	return(
		<Grid.Row columns={16}>
			<Grid.Column width={16}>	
				<Message size="small" >Choose a weight for the question below</Message>
			<Form>
				<Form.Group>
					{renderWeightOptions()}
				</Form.Group>
				<Form.Field>
					<Message size="small" >Selected Weight: <Label color="green">{(selected && selected!= "") ? selected : "None"}</Label></Message>
				</Form.Field>
			</Form>
			</Grid.Column>
		</Grid.Row>
	);
}

export const QuestionWeightFormFieldComponent = (props) => {

	const [ selected, setSelected ] = useState(props.selectedWeight || "None");
	const [ weightUpdatedId, setWeightUpdatedId ] = useState(0);

	useEffect(() => {
		if (weightUpdatedId == 0) return;
		props.onWeightUpdated(selected);
	},[weightUpdatedId])

	useEffect(() => {
		// console.log(`props.selectedWeight received is ${props.selectedWeight}`)
		setSelected(props.selectedWeight)
	},[props.selectedWeight])

	const renderWeightOptions = () => {
		let renderedOptions = props.options.map((v,i)=> 
			<Form.Radio
				key={`qweight-option-${i}`}
				label={v}
				value={v}
				checked={selected == v}
				onChange={()=> {setSelected(v);setWeightUpdatedId(weightUpdatedId+1)} }
			/>
		)
		return renderedOptions;
	}

	return [
		<Form.Field
			key={`qweight-select`}
			// label={"Choose a weight for the question below"}
		>
			<Label size="large" >{"Choose a weight for the question below"}</Label>
		</Form.Field>,
		<Form.Group key={`qweight-options`}>
			{renderWeightOptions()}
		</Form.Group>,
		<Form.Field
			key={`qweight-selected`}
		>
			<Message>Selected Weight: <Label size="tiny" color="green">{(selected && selected!= "") ? selected : "None"}</Label></Message> 
		</Form.Field>
	];
}

export const DatePickerGridRowComponent = (props) => {
    return (
		<Grid.Row columns={16} >
			<Grid.Column width={16}>
				<Form style={{ display:"flex" }}>
					<Form.Group style={{ alignItems:"center" }}>
						<Form.Field
							label={<Label size="large">Choose a deadline for this survey</Label>}
						/>
						<Form.Field>
						<DatePickerComponent {...props} style={{width:"inherit"}} />
						</Form.Field>
					</Form.Group>
				</Form>
			</Grid.Column>
	  	</Grid.Row>
    );
};

// Selected Weight: <Label color="green">{(selected && selected!= "") ? selected : "None"}</Label>
// <Message size="mini" header={<Header>Select a weight for the question below</Header>}></Message>
// <Message size="mini" header={<Header>Selected Weight: <Label color="green">{selected}</Label></Header>}></Message>
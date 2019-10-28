import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import DisplayRosterDetailsComponent from '../DisplayRosterDetailsComponent'

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

it('renders correctly', () => {
  const tree = renderer.create(
    <RosterDetails>{headers}</RosterDetails>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
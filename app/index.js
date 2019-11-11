// Render MainAppComponent in div "root" on index.html
import React from 'react';
import ReactDOM from 'react-dom';
import { default as App } from "./MainAppComponent";

ReactDOM.render(<App />, document.getElementById("root"));
import React from "react";
import { List, Datagrid, TextField } from "react-admin";

const FocusList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="date" />
      <TextField source="focusedTime" />
      <TextField source="outOfFocusTime" />
      <TextField source="totalTime" />
      <TextField source="score" />
    </Datagrid>
  </List>
);

export default FocusList;

import React from 'react';
import { FieldSheet } from '../../types/types';
import Template from './Template';

export interface FieldSheetLetterProps {
  fieldSheets?: FieldSheet[];
  classes?: any;
}

// This has to be class component, in order to integrate with react-to-print
class ComponentToPrint extends React.Component<FieldSheetLetterProps> {
  render() {
    const { fieldSheets } = this.props;

    return (
      <div>
        {fieldSheets?.map((sheet: FieldSheet, index: number) => (
          <Template key={index} fieldSheet={sheet} />
        ))}
      </div>
    );
  }
}

export default ComponentToPrint;

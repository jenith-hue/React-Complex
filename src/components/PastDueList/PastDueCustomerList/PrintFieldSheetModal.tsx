import { RACButton, RACModal, RACRadio } from '@rentacenter/racstrap';
import clsx from 'clsx';
import React, { ChangeEvent, useState } from 'react';
import { printLetterOptions } from '../../../constants/constants';
import { useFieldSheets } from '../../../context/FieldSheets/FieldSheetsProvider';
import { Option } from '../../../types/types';
import { useStyles } from './PrintLetterModal';

export interface ModalProps {
  onClose: (onclose: boolean) => void;
  onConfirm: (selectedOption: string) => void;
  customerName: string;
  disableActionButtons?: boolean;
}

interface PrintLetterOptionsProps {
  options: Option[];
  selectedValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  style: string;
}

const generatePrintLetterOptions = ({
  options,
  selectedValue,
  onChange,
  style,
}: PrintLetterOptionsProps) =>
  options.map((option, index) => (
    <RACRadio
      name="printLetter"
      {...option}
      checked={option.value === selectedValue}
      classes={{ label: style }}
      onChange={onChange}
      key={index}
    />
  ));

export const PrintFieldSheetModal = ({
  onClose,
  onConfirm,
  customerName,
}: ModalProps) => {
  const classes = useStyles();
  const { isLoading } = useFieldSheets();

  const [selectedValue, setSelectedValue] = useState<string>('NONE');

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  return (
    <RACModal
      isOpen
      classes={{
        dialogContent: classes.dialogContent,
        dialogActions: classes.dialogActions,
        dialog: classes.dialogRoot,
      }}
      maxWidth="xs"
      title="Print Field Sheet"
      content={
        <>
          <div className={clsx(classes.letter)}>
            <label className={clsx(classes.label)}>{customerName}</label>
          </div>
          {generatePrintLetterOptions({
            options: printLetterOptions,
            selectedValue,
            onChange: handleChange,
            style: classes.radioLabel,
          })}
        </>
      }
      onClose={() => onClose(false)}
      buttons={
        <>
          <RACButton
            variant="outlined"
            color="secondary"
            onClick={() => onClose(false)}
          >
            Cancel
          </RACButton>
          <RACButton
            disabled={isLoading}
            loading={isLoading}
            variant="contained"
            color="primary"
            onClick={() => {
              onConfirm(selectedValue);
            }}
          >
            OK
          </RACButton>
        </>
      }
    />
  );
};

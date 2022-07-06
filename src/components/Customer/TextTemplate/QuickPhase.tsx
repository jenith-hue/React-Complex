import {
  makeStyles,
  RACCOLOR,
  RACRadio,
  Typography,
} from '@rentacenter/racstrap';
import React from 'react';
import { QuickResponse } from '../../../domain/TextConversation/TextTemplate';

interface QuickPhaseProps {
  quickPhases: QuickResponse[];
  onChange: (selectedPhase: string) => void;
  selectedPhase?: QuickResponse;
}

const useStyles = makeStyles((theme: any) => ({
  quickPhaseContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '1.25rem',
    paddingRight: '1rem',
    marginTop: '1rem',
  },
  quickPhaseItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: theme.typography.pxToRem(203),
    overflowY: 'auto',
  },
  quickPhaseHeader: {
    marginBottom: '.5rem',
  },
  quickPhaseInput: {
    paddingLeft: 0,
  },
  quickPhaseInputLabel: {
    fontFamily: 'OpenSans-regular !important',
  },
  generatedTextLabel: {
    marginTop: '1rem',
    marginBottom: '.5rem',
  },
  generatedTextValue: {
    borderRadius: '5px',
    minHeight: 'calc(1.5em + 0.75rem + 2px)',
    border: '1px solid #C4C4C4',
    padding: '0.375rem 0.75rem',
    marginBottom: '1rem',
    backgroundColor: RACCOLOR.CULTURED,
  },
}));

export const QuickPhase = ({
  quickPhases,
  onChange,
  selectedPhase,
}: QuickPhaseProps) => {
  const classes = useStyles();
  return (
    <div className={classes.quickPhaseContainer}>
      <Typography variant="h5" className={classes.quickPhaseHeader}>
        Quick Phrase
      </Typography>
      <div className={classes.quickPhaseItemContainer}>
        {quickPhases?.map((option) => (
          <RACRadio
            name={option.title}
            label={option.title}
            value={option.title}
            checked={selectedPhase && option.title === selectedPhase.title}
            onChange={(event) => onChange(event.target.value)}
            key={option.title}
            classes={{
              checked: classes.quickPhaseInput,
              label: classes.quickPhaseInputLabel,
            }}
          />
        ))}
      </div>
      <Typography variant="h5" className={classes.generatedTextLabel}>
        Generated Text
      </Typography>
      <span className={classes.generatedTextValue}>
        {selectedPhase?.message}
      </span>
    </div>
  );
};

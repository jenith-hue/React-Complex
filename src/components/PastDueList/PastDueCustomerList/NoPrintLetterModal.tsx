import { RACChip, RACCOLOR, RACModal } from '@rentacenter/racstrap';
import { Typography } from '@rentacenter/racstrap';
import { RACButton, makeStyles } from '@rentacenter/racstrap';
import React, { useContext } from 'react';
import { PastDueListCustomerStateContext } from '../../../context/PastDueListCustomer/PastDueListCustomerProvider';
import { usePrintLetter } from '../../../context/PrintLetter/PrintLetterProvider';
import { PastDueCustomerResponse } from '../../../domain/PastDueList/PastDueCustomerList';

interface ModalProps {
  onClose: () => void;
  onConfirm: () => void;
  disableActionButtons?: boolean;
}

export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    textAlign: 'center',
    margin: `2rem 0`,
  },
  dialogActions: {
    justifyContent: 'center',
  },
  dialogRoot: {
    '& .MuiPaper-rounded': {
      borderRadius: theme.typography.pxToRem(12),
    },
    '& .MuiDialog-paperWidthXs': {
      maxWidth: theme.typography.pxToRem(600),
    },
    '& .MuiTypography-h5': {
      fontSize: theme.typography.pxToRem(20),
      fontWeight: 500,
      lineHeight: theme.typography.pxToRem(30),
    },
  },
  radioLabel: {
    fontFamily: 'OpenSans-regular',
  },
  label: {
    fontFamily: 'OpenSans-semibold',
    fontSize: theme.typography.pxToRem(14),
    color: RACCOLOR.BLUE_CRAYOLA,
  },
  letter: {
    paddingBottom: theme.typography.pxToRem(14),
  },
  chip: {
    margin: '.1rem',
  },
  customerNames: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
}));

const groupBy = (
  list: PastDueCustomerResponse[] | undefined,
  keyGetter: any
) => {
  const map = new Map();
  list?.forEach((item: PastDueCustomerResponse) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, `${item.customerFirstName} ${item.customerLastName}`);
    }
  });
  return map;
};

export const NoPrintLetterModal = ({
  onClose,
  onConfirm,
  disableActionButtons,
}: ModalProps) => {
  const classes = useStyles();
  const { selectedCustomerIds, pastDue } = useContext(
    PastDueListCustomerStateContext
  );
  const { letters } = usePrintLetter();

  const customersHavingLetter =
    letters?.customer.map((customer) => String(customer.customerId)) || [];
  const customerIdsWithNoPrintletter = selectedCustomerIds.filter(
    (customerId) => !customersHavingLetter.includes(customerId)
  );

  const groupedPastDue = groupBy(pastDue, (pastDue: any) => pastDue.customerId);

  for (const key of groupedPastDue.keys()) {
    if (!customerIdsWithNoPrintletter.includes(key)) {
      groupedPastDue.delete(key);
    }
  }

  return (
    <RACModal
      isOpen
      classes={{
        dialogContent: classes.dialogContent,
        dialogActions: classes.dialogActions,
        dialog: classes.dialogRoot,
      }}
      maxWidth="xs"
      title="Customers not eligible for 15 days letter"
      content={
        <>
          <Typography display="inline" variant="body1">
            The following customer(s) are not eligible for the selected letter:
          </Typography>
          <div className={classes.customerNames}>
            {Array.from(groupedPastDue).map((id) => (
              <RACChip
                classes={{ root: classes.chip }}
                key={id?.[0]}
                label={id?.[1]}
                icon={<></>}
              />
            ))}
          </div>
          <Typography display="inline" variant="body1">
            Do you wish to continue printing for the rest of the customers?
          </Typography>
        </>
      }
      onClose={onClose}
      buttons={
        <>
          <RACButton
            variant="contained"
            color="primary"
            onClick={onConfirm}
            disabled={disableActionButtons}
          >
            Yes
          </RACButton>
          <RACButton
            variant="outlined"
            color="secondary"
            onClick={onClose}
            disabled={disableActionButtons}
          >
            No
          </RACButton>
        </>
      }
    />
  );
};

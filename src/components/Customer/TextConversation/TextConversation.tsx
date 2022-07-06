import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Icon,
  makeStyles,
  RACCard,
  RACTabs,
  Typography,
} from '@rentacenter/racstrap';
import React from 'react';
import { CO_CUSTOMER_TAB, CUSTOMER_TAB } from '../../../constants/constants';
import {
  AVAILABLE_TABS,
  useTextConversation,
  useTextConversationActions,
} from '../../../context/TextConversationProvider/TextConversationProvider';
import { TextConversationContent } from './TextConversationContent';

export const textConversationDataTestid = 'textConversationDataTestid';

const useStyles = makeStyles((theme: any) => ({
  textConversationRoot: {
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  row: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  cardContentContainer: {
    marginLeft: '1.25rem',
    marginRight: '1.25rem',
  },
  tabPanel: {
    height: '26rem',
    maxHeight: '26rem',
    overflow: 'auto',
  },
  icon: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: theme.typography.pxToRem(20),
    position: 'absolute',
    right: 0,
    height: '100%',
  },
}));
export const TextConversation = () => {
  const classes = useStyles();

  const { disabledTabs, customerPhones, coCustomerPhones } =
    useTextConversation();
  const { onRefresh, setTextConversationSelectedTab } =
    useTextConversationActions();

  if (!customerPhones?.length && !coCustomerPhones?.length) return null;

  return (
    <div
      className={classes.textConversationRoot}
      data-testid={textConversationDataTestid}
    >
      <div className={classes.row}>
        <Typography variant="h4">Text Conversation</Typography>
      </div>
      <RACCard>
        <div className={classes.cardContentContainer}>
          <RACTabs
            classes={{
              tabPanel: classes.tabPanel,
            }}
            icon={
              <Icon onClick={onRefresh} classes={{ root: classes.icon }}>
                <FontAwesomeIcon icon={faSync} />
              </Icon>
            }
            defaultValue={0}
            tabs={AVAILABLE_TABS}
            contentForTabs={[
              <TextConversationContent
                key="customer"
                onComponentDidMount={() => {
                  setTextConversationSelectedTab(CUSTOMER_TAB);
                }}
              />,
              <TextConversationContent
                key="co-customer"
                onComponentDidMount={() =>
                  setTextConversationSelectedTab(CO_CUSTOMER_TAB)
                }
              />,
            ]}
            disabledTabs={disabledTabs}
          />
        </div>
      </RACCard>
    </div>
  );
};

import {
  makeStyles,
  RACCOLOR,
  RACSelect,
  RACTextConversationMessage,
  RACTextMessageInput,
  Typography,
} from '@rentacenter/racstrap';
import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import {
  useTextConversation,
  useTextConversationActions,
} from '../../../context/TextConversationProvider/TextConversationProvider';
import { TextTemplateModal } from '../TextTemplate/TextTemplateModal';
import { ApiStateWrapper } from '../../../common/ApiStateWrapper/ApiStateWrapper';
import { formatPhoneNumber } from '../../../utils/utils';
import { useStoreDetails } from '../../../context/Store/StoreProvider';
import { useUserPermissions } from '../../../context/permission/PermissionsProvider';
import { useUserStateContext } from '../../../context/user/user-contexts';
import { FRCStoreType, RentACenter } from '../../../constants/constants';

export interface TextConversationContentProps {
  onComponentDidMount: () => void;
}

const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: '1rem 0.5rem 1rem 0.5rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    width: '100%',
    // eslint-disable-next-line sonarjs/no-duplicate-string
    justifyContent: 'flex-start',
  },
  body: {
    width: '100%',
    overflowY: 'auto',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  noRecord: {
    display: 'flex',
    justifyContent: 'center !important',
  },
  headerItem: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    flex: 1,
  },
  headerItemValue: {
    color: `${RACCOLOR.INDEPENDENCE} !important`,
    whiteSpace: 'nowrap',
  },
  centered: {
    alignItems: 'center',
  },
  messageDate: {
    fontSize: `${theme.typography.pxToRem(12)} !important`,
    color: `${RACCOLOR.ARGENT} !important`,
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  leftMargin: {
    marginLeft: '2rem',
  },
}));
export const TextConversationContent = ({
  onComponentDidMount,
}: TextConversationContentProps) => {
  const classes = useStyles();
  const ref = useRef(null);
  const {
    phoneOptions,
    selectedPhoneOption,
    fullName,
    messages,
    isLoading,
    hasApiError,
    preferredLanguage,
    isCommunicationAllowed,
  } = useTextConversation();

  const { onPhoneOptionChanged, sendMessage } = useTextConversationActions();
  const [openTextTemplateModal, setOpenTextTemplateModal] = useState(false);
  const { store } = useStoreDetails();
  const { user } = useUserStateContext();
  const CoworkerName = `${user?.firstName} ${user?.lastName
    .charAt(0)
    .toUpperCase()}`;
  const companyName =
    store?.storeType === FRCStoreType
      ? `${CoworkerName} ${store?.storeNumber}`
      : RentACenter;
  const { hasAccessToTextTemplate, hasAccessToFreeFormText } =
    useUserPermissions();
  const DEFAULT_PRE_INPUT_TEXT = 'Templates';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onComponentDidMount, []);

  useEffect(() => {
    if (ref?.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ref?.current?.scroll({
        top: Number.MAX_SAFE_INTEGER,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <div className={classes.root}>
      <div
        className={clsx(
          classes.body,
          isLoading || !messages.length || hasApiError ? classes.noRecord : null
        )}
        ref={ref}
      >
        <ApiStateWrapper
          loading={isLoading}
          hasApiError={hasApiError}
          response={messages}
          successContent={
            <>
              {messages.map(
                ({
                  textMessageId,
                  isSentByRAC,
                  message,
                  messageDate,
                  initials,
                  tooltipTitle,
                  tooltipSubTitle,
                }) => (
                  <div key={textMessageId}>
                    <Typography
                      align="center"
                      variant="body1"
                      className={classes.messageDate}
                    >
                      {messageDate}
                    </Typography>
                    <RACTextConversationMessage
                      key={textMessageId}
                      isOwnMessage={isSentByRAC}
                      avatarText={initials}
                      message={message}
                      tooltipTitle={tooltipTitle}
                      tooltipSubtitle={tooltipSubTitle}
                    />
                  </div>
                )
              )}
            </>
          }
        />
      </div>
      <div className={classes.header}>
        <div className={classes.headerItem}>
          <Typography align="left" variant="h5">
            Name
          </Typography>
          <Typography
            className={classes.headerItemValue}
            variant="body1"
            align="left"
          >
            {fullName}
          </Typography>
        </div>
        <div className={clsx(classes.headerItem, classes.leftMargin)}>
          <Typography align="left" variant="h5">
            Phone
          </Typography>
          <RACSelect
            isDisabled={!isCommunicationAllowed || !phoneOptions?.length}
            defaultValue={selectedPhoneOption?.value}
            options={phoneOptions.map((phone) => ({
              ...phone,
              label: formatPhoneNumber(phone.label, !isCommunicationAllowed),
            }))}
            onChange={(e: React.ChangeEvent<{ value: any }>) => {
              onPhoneOptionChanged(e.target.value);
            }}
          />
        </div>

        <div className={clsx(classes.headerItem, classes.centered)}>
          <Typography align="center" variant="h5">
            Type
          </Typography>
          <Typography
            align="center"
            className={classes.headerItemValue}
            variant="body1"
          >
            {selectedPhoneOption?.phoneType}
          </Typography>
        </div>
        <div className={classes.headerItem}>
          <Typography align="center" variant="h5">
            Language
          </Typography>
          <Typography
            align="center"
            className={classes.headerItemValue}
            variant="body1"
          >
            {preferredLanguage}
          </Typography>
        </div>
      </div>
      {hasAccessToTextTemplate && hasAccessToFreeFormText && (
        <div>
          <Typography variant="h5">Send Text To:</Typography>
          <Typography variant="body1">
            Choose Text Template or Free Form Text
          </Typography>
        </div>
      )}
      <TextTemplateModal
        open={openTextTemplateModal}
        onClose={setOpenTextTemplateModal}
        preferredLanguageDesc={preferredLanguage}
        isCommunicationAllowed={isCommunicationAllowed}
      />
      <RACTextMessageInput
        onSend={(e) => {
          sendMessage(`${e} - ${companyName}`);
        }}
        onPreInputTextClicked={() =>
          hasAccessToTextTemplate && setOpenTextTemplateModal(true)
        }
        isCommunicationAllowed={
          isCommunicationAllowed &&
          hasAccessToFreeFormText &&
          phoneOptions?.length > 0
        }
        preInputText={
          hasAccessToTextTemplate && phoneOptions?.length > 0
            ? DEFAULT_PRE_INPUT_TEXT
            : ' '
        }
      />
    </div>
  );
};

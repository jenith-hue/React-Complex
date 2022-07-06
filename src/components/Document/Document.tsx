import React, { useState, useEffect, useRef } from 'react';
import { RACModal, RACButton, makeStyles } from '@rentacenter/racstrap';
import { getDocument } from '../../api/document';
import { ApiStateWrapper } from '../../common/ApiStateWrapper/ApiStateWrapper';
import { b64toBlob, getContentType } from '../../utils/utils';

export const useStyles = makeStyles((theme: any) => ({
  dialogContent: {
    textAlign: 'center',
    margin: `2rem 0`,
    height: '90%',
    overflow: 'hidden',
  },
  dialogActions: {
    justifyContent: 'flex-end',
    position: 'sticky',
    bottom: 0,
  },
  dialogRoot: {
    height: '90%',
    '& .MuiPaper-rounded': {
      borderRadius: theme.typography.pxToRem(12),
    },
    '& .MuiDialog-paperScrollPaper': {
      height: '90%',
    },
    '& .MuiTypography-h5': {
      fontSize: theme.typography.pxToRem(20),
      fontWeight: 500,
      lineHeight: theme.typography.pxToRem(30),
    },
  },
  contentHeight: {
    height: '100%',
    overflow: 'scroll',
  },
}));
export interface DocumentProps {
  title?: string;
  documentId: string;
  typeId: string;
  onClose: () => void;
}

export const Document = ({
  title,
  documentId,
  typeId,
  onClose,
}: DocumentProps) => {
  const classes = useStyles();
  const [fileInBase64, setFileInBase64] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiError, setHasApiError] = useState(false);
  const eventFrame = useRef<HTMLIFrameElement>(null);

  const print = () => {
    eventFrame.current?.contentWindow?.print();
  };

  useEffect(() => {
    setHasApiError(false);
    setIsLoading(true);
    getDocument(documentId, typeId)
      .then((response) => {
        const contentType = getContentType(response?.fileList?.[0]?.fileName);
        const fileObject = response?.fileList?.[0]?.fileObject;

        if (fileObject)
          setFileInBase64(
            URL.createObjectURL(b64toBlob(fileObject, contentType))
          );
        setHasApiError(false);
      })
      .catch(() => setHasApiError(true))
      .finally(() => setIsLoading(false));
  }, [documentId, typeId]);

  return (
    <RACModal
      isOpen
      classes={{
        dialogContent: classes.dialogContent,
        dialog: classes.dialogRoot,
      }}
      maxWidth="lg"
      title={title || 'Document'}
      content={
        <ApiStateWrapper
          loading={isLoading}
          hasApiError={hasApiError}
          response={fileInBase64 || {}}
          noItemAdditionalText=" for payment receipt document"
          successContent={
            <iframe
              ref={eventFrame}
              frameBorder={0}
              width="100%"
              height="100%"
              src={`${fileInBase64}#toolbar=0`}
            ></iframe>
          }
          classes={{
            loader: classes.contentHeight,
            apiError: classes.contentHeight,
            noItems: classes.contentHeight,
          }}
        />
      }
      onClose={onClose}
      buttons={
        <>
          <RACButton variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </RACButton>
          <RACButton
            disabled={isLoading || hasApiError}
            variant="contained"
            color="primary"
            onClick={print}
          >
            Print
          </RACButton>
        </>
      }
    />
  );
};

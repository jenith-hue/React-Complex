import React, { createContext, ReactNode, useContext, useState } from 'react';
import { getLetters } from '../../api/letter';
import {
  PrintLetterDetails,
  PrintLetterRequestPayload,
  PrintLetterResponse,
} from '../../types/types';

export interface PrintLetterState {
  letters: PrintLetterDetails | undefined;
  loading: boolean;
  hasApiError: boolean;
  noLetter: boolean;
}

export interface PrintLetterDispatchState {
  fetchPrintLetter: (
    printLetterDetailPayload: PrintLetterRequestPayload
  ) => Promise<void | PrintLetterResponse>;
}

export const PrintLetterStateContext = createContext<PrintLetterState>(
  {} as PrintLetterState
);

export const PrintLetterDispatchContext =
  createContext<PrintLetterDispatchState>({} as PrintLetterDispatchState);

export const PrintLetterProvider = (props: { children: ReactNode }) => {
  const [letters, setLetters] = React.useState<PrintLetterDetails>();
  const [hasApiError, setHasApiError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noLetter, setNoLetter] = useState(false);

  const fetchPrintLetter = async (
    printLetterDetailPayload: PrintLetterRequestPayload
  ) => {
    setNoLetter(false);
    setHasApiError(false);
    setLoading(true);
    getLetters(printLetterDetailPayload)
      .then((response) => {
        if (!response.letterDetails?.customer?.length) {
          setNoLetter(true);
        }
        setLetters(response.letterDetails);
      })
      .catch(() => setHasApiError(true))
      .finally(() => setLoading(false));
  };

  return (
    <PrintLetterStateContext.Provider
      value={{
        letters,
        loading,
        hasApiError,
        noLetter,
      }}
    >
      <PrintLetterDispatchContext.Provider
        value={{
          fetchPrintLetter,
        }}
      >
        {props.children}
      </PrintLetterDispatchContext.Provider>
    </PrintLetterStateContext.Provider>
  );
};

export const usePrintLetter = () => useContext(PrintLetterStateContext);

export const usePrintLetterActions = () =>
  useContext(PrintLetterDispatchContext);

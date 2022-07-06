import { useEffect, useCallback, useReducer } from 'react';

const blacklistedTargets = ['INPUT', 'TEXTAREA'];

const keysReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'set-key-down':
      return { ...state, [action.key]: true };
    case 'set-key-up':
      return { ...state, [action.key]: false };
    default:
      return state;
  }
};

const initialState = (shortcutKeys: string[]) =>
  shortcutKeys.reduce(
    (currentKeys: { [index: string]: boolean }, key: string) => {
      currentKeys[key.toLowerCase()] = false;
      return currentKeys;
    },
    {}
  );

const useKeyboardShortcut = (
  shortcutKeys: string[],
  callback: (keys: string[]) => void
) => {
  if (!Array.isArray(shortcutKeys))
    throw new Error(
      'The first parameter to `useKeyboardShortcut` must be an ordered array of `KeyboardEvent.key` strings.'
    );

  if (!shortcutKeys.length)
    throw new Error(
      'The first parameter to `useKeyboardShortcut` must contain atleast one `KeyboardEvent.key` string.'
    );

  if (!callback || typeof callback !== 'function')
    throw new Error(
      'The second parameter to `useKeyboardShortcut` must be a function that will be envoked when the keys are pressed.'
    );

  const [keys, setKeys] = useReducer(keysReducer, initialState(shortcutKeys));

  const setKeyAction = useCallback(
    (type: string, keyEvent) => {
      const { key, target, repeat } = keyEvent;
      const loweredKey = key?.toLowerCase();

      if (repeat) return;
      if (blacklistedTargets.includes(target.tagName)) return;
      if (keys[loweredKey] === undefined) return;

      if (keys[loweredKey] === false) setKeys({ type, key: loweredKey });
    },
    [keys]
  );

  const keydownListener = useCallback(
    (keydownEvent) => setKeyAction('set-key-down', keydownEvent),
    [setKeyAction]
  );

  const keyupListener = useCallback(
    (keyupEvent) => setKeyAction('set-key-up', keyupEvent),
    [setKeyAction]
  );

  useEffect(() => {
    if (!Object.values(keys).filter((value) => !value).length) callback(keys);
  }, [callback, keys]);

  useEffect(() => {
    window.addEventListener('keydown', keydownListener, true);
    window.addEventListener('keyup', keyupListener, true);

    return () => {
      window.removeEventListener('keydown', keydownListener, true);
      window.removeEventListener('keyup', keyupListener, true);
    };
  }, [keydownListener, keyupListener]);
};

export default useKeyboardShortcut;

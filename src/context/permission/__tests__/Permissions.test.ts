/* eslint-disable @typescript-eslint/ban-ts-comment */
import { StoreConfigsResponse } from '../../../types/types';
import { checkIfTextMessagingAllowed } from '../PermissionsProvider';

describe('Permissions', () => {
  describe('checkIfTextMessagingAllowed', () => {
    it('returns [], when response is missing', () => {
      //@ts-ignore
      expect(checkIfTextMessagingAllowed(null)).toStrictEqual([]);
    });
    it('returns [], when response is not array', () => {
      const response = {
        configDetails: [
          {
            paramGroupName: 'TwoWayTexting',
            paramValue: '1',
          },
        ],
      };

      //@ts-ignore
      expect(checkIfTextMessagingAllowed(response)).toStrictEqual([]);
    });
    it('returns [], when configDetails is missing', () => {
      const response: StoreConfigsResponse[] = [];

      expect(checkIfTextMessagingAllowed(response)).toStrictEqual([]);
    });
    it('returns empty [], when paramValue is 0 (as number)', () => {
      const response: StoreConfigsResponse[] = [
        {
          configDetails: [
            {
              paramGroupName: 'TwoWayTexting',
              //@ts-ignore
              paramValue: 0,
            },
            {
              paramGroupName: 'ShowTextTemplate',
              //@ts-ignore
              paramValue: 0,
            },
            {
              paramGroupName: 'ShowFreeFormText',
              //@ts-ignore
              paramValue: 0,
            },
          ],
        },
      ];

      expect(checkIfTextMessagingAllowed(response)).toStrictEqual([]);
    });
    it('returns empty [], when paramValue is 0 (as string)', () => {
      const response: StoreConfigsResponse[] = [
        {
          configDetails: [
            //@ts-ignore
            {
              paramGroupName: 'TwoWayTexting',
              paramValue: '0',
            },
            //@ts-ignore
            {
              paramGroupName: 'ShowTextTemplate',
              paramValue: '0',
            },
            //@ts-ignore
            {
              paramGroupName: 'ShowFreeFormText',
              paramValue: '0',
            },
          ],
        },
      ];

      expect(checkIfTextMessagingAllowed(response)).toStrictEqual([]);
    });
    it('returns true, when paramValue is 1 (as number)', () => {
      const response: StoreConfigsResponse[] = [
        {
          configDetails: [
            {
              paramGroupName: 'TwoWayTexting',
              //@ts-ignore
              paramValue: 1,
            },
            {
              paramGroupName: 'ShowTextTemplate',
              //@ts-ignore
              paramValue: 0,
            },
            {
              paramGroupName: 'ShowFreeFormText',
              //@ts-ignore
              paramValue: 0,
            },
          ],
        },
      ];

      expect(checkIfTextMessagingAllowed(response)).toStrictEqual([
        'TWO_WAY_TEXTING',
      ]);
    });
    it('returns true, when paramValue is 1 (as string)', () => {
      const response: StoreConfigsResponse[] = [
        {
          configDetails: [
            //@ts-ignore
            {
              paramGroupName: 'TwoWayTexting',
              paramValue: '1',
            },
            //@ts-ignore
            {
              paramGroupName: 'ShowTextTemplate',
              paramValue: '0',
            },
            //@ts-ignore
            {
              paramGroupName: 'ShowFreeFormText',
              paramValue: '0',
            },
          ],
        },
      ];

      expect(checkIfTextMessagingAllowed(response)).toStrictEqual([
        'TWO_WAY_TEXTING',
      ]);
    });
    it('ShowTextTemplate and ShowFreeFormText returns false, when TwoWayTexting paramValue is 0 (as string)', () => {
      const response: StoreConfigsResponse[] = [
        {
          configDetails: [
            //@ts-ignore
            {
              paramGroupName: 'TwoWayTexting',
              paramValue: '0',
            },
            //@ts-ignore
            {
              paramGroupName: 'ShowTextTemplate',
              paramValue: '1',
            },
            //@ts-ignore
            {
              paramGroupName: 'ShowFreeFormText',
              paramValue: '1',
            },
          ],
        },
      ];
      expect(checkIfTextMessagingAllowed(response)).toStrictEqual([]);
    });
    it('TwoWayTexting and ShowTextTemplate returns true, when  paramValue is 1 (as string) and ShowFreeFormText returns false', () => {
      const response: StoreConfigsResponse[] = [
        {
          configDetails: [
            //@ts-ignore
            {
              paramGroupName: 'TwoWayTexting',
              paramValue: '1',
            },
            //@ts-ignore
            {
              paramGroupName: 'ShowTextTemplate',
              paramValue: '1',
            },
            //@ts-ignore
            {
              paramGroupName: 'ShowFreeFormText',
              paramValue: '0',
            },
          ],
        },
      ];
      expect(checkIfTextMessagingAllowed(response)).toStrictEqual([
        'TWO_WAY_TEXTING',
        'SHOW_TEXT_TEMPLATE',
      ]);
    });
    it('TwoWayTexting, ShowTextTemplate and ShowFreeFormText returns true, when  paramValue is 1 (as string)', () => {
      const response: StoreConfigsResponse[] = [
        {
          configDetails: [
            //@ts-ignore
            {
              paramGroupName: 'TwoWayTexting',
              paramValue: '1',
            },
            //@ts-ignore
            {
              paramGroupName: 'ShowTextTemplate',
              paramValue: '1',
            },
            //@ts-ignore
            {
              paramGroupName: 'ShowFreeFormText',
              paramValue: '1',
            },
          ],
        },
      ];
      expect(checkIfTextMessagingAllowed(response)).toStrictEqual([
        'TWO_WAY_TEXTING',
        'SHOW_TEXT_TEMPLATE',
        'SHOW_FREE_FORM_TEXT',
      ]);
    });
  });
});

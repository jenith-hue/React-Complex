/* eslint-disable sonarjs/no-duplicate-string */
import { mapCustomerAlertResponse } from '../CustomerAlertsProvider';

const response = [
  {
    alertText: '07-01-21 MESQUITE PD WORKING CASE',
    alertTypeDescEn: 'Other',
    alertTypeDescEs: null,
    alertCleared: 0,
    alertTypeId: '3',
    customerAlertId: '10801414',
  },
  {
    alertText: 'Club membership auto cancelled due to non payment for 32 days',
    alertTypeDescEn: 'Other',
    alertTypeDescEs: null,
    alertCleared: 1,
    alertTypeId: '3',
    customerAlertId: '10801415',
  },
  {
    alertText: '06-19-21 FILED TOS WITH MESQUITE PD',
    alertTypeDescEn: 'Other',
    alertTypeDescEs: null,
    alertCleared: 0,
    alertTypeId: '3',
    customerAlertId: '10801416',
  },
  {
    alertText: 'Certified Letter 6/18/21',
    alertTypeDescEn: 'Other',
    alertTypeDescEs: null,
    alertCleared: 0,
    alertTypeId: '3',
    customerAlertId: '10801417',
  },
  {
    alertText: 'FIRST PAYMENT DEFAULT',
    alertTypeDescEn: 'Other',
    alertTypeDescEs: null,
    alertCleared: 0,
    alertTypeId: '3',
    customerAlertId: '10801418',
  },
  {
    alertText: "Added classification for customer as 'Hard'",
    alertTypeDescEn: 'Added classification for customer as hard',
    alertTypeDescEs: null,
    alertCleared: 0,
    alertTypeId: '2',
    customerAlertId: '10824058',
  },
  {
    alertText: null,
    alertTypeDescEn: 'Added classification for customer as hard',
    alertTypeDescEs: null,
    alertCleared: 0,
    alertTypeId: '2',
    customerAlertId: '10824059',
  },
  {
    alertText: null,
    alertTypeDescEn: 'Added classification for customer as stolen',
    alertTypeDescEs: null,
    alertCleared: 0,
    alertTypeId: '5',
    customerAlertId: '10825482',
  },
];
describe('CustomerAlertsProvider', () => {
  describe('mapCustomerAlertResponse', () => {
    it('returns empty array, when input missing', () => {
      expect(mapCustomerAlertResponse(null)).toStrictEqual([]);
    });
    it('returns empty array, when input is empty array', () => {
      expect(mapCustomerAlertResponse([])).toStrictEqual([]);
    });
    it('use alertTypeDescEn when present', () => {
      expect(mapCustomerAlertResponse(response)).toStrictEqual([
        {
          alertText: '07-01-21 MESQUITE PD WORKING CASE',
          alertTypeDescEn: '07-01-21 MESQUITE PD WORKING CASE',
          alertTypeDescEs: null,
          alertCleared: 0,
          alertTypeId: '3',
          customerAlertId: '10801414',
        },
        {
          alertText:
            'Club membership auto cancelled due to non payment for 32 days',
          alertTypeDescEn:
            'Club membership auto cancelled due to non payment for 32 days',
          alertTypeDescEs: null,
          alertCleared: 1,
          alertTypeId: '3',
          customerAlertId: '10801415',
        },
        {
          alertText: '06-19-21 FILED TOS WITH MESQUITE PD',
          alertTypeDescEn: '06-19-21 FILED TOS WITH MESQUITE PD',
          alertTypeDescEs: null,
          alertCleared: 0,
          alertTypeId: '3',
          customerAlertId: '10801416',
        },
        {
          alertText: 'Certified Letter 6/18/21',
          alertTypeDescEn: 'Certified Letter 6/18/21',
          alertTypeDescEs: null,
          alertCleared: 0,
          alertTypeId: '3',
          customerAlertId: '10801417',
        },
        {
          alertText: 'FIRST PAYMENT DEFAULT',
          alertTypeDescEn: 'FIRST PAYMENT DEFAULT',
          alertTypeDescEs: null,
          alertCleared: 0,
          alertTypeId: '3',
          customerAlertId: '10801418',
        },
        {
          alertText: "Added classification for customer as 'Hard'",
          alertTypeDescEn: 'Added classification for customer as hard',
          alertTypeDescEs: null,
          alertCleared: 0,
          alertTypeId: '2',
          customerAlertId: '10824058',
        },
        {
          alertText: null,
          alertTypeDescEn: 'Added classification for customer as hard',
          alertTypeDescEs: null,
          alertCleared: 0,
          alertTypeId: '2',
          customerAlertId: '10824059',
        },
        {
          alertText: null,
          alertTypeDescEn: 'Added classification for customer as stolen',
          alertTypeDescEs: null,
          alertCleared: 0,
          alertTypeId: '5',
          customerAlertId: '10825482',
        },
      ]);
    });
  });
});

import { PastDueCustomerResponse } from '../domain/PastDueList/PastDueCustomerList';

let lastCustomerId = 1;

export class PastDueCustomerResponseMock implements PastDueCustomerResponse {
  customerId = String(lastCustomerId++);
  globalCustomerId = '1fc287ca-b2e8-4829-aed4-8a5552f7d048';
  customerFirstName = 'Tory';
  customerLastName = 'Smith';
  daysPastDue = '10';
  languageRef = 'E';
  callResultType = { code: 'NA', description: 'No Answer' };
  route = { code: '73', description: 'Route 73' };
  pastDueDate = '2021-07-25';
  commitment = {
    commitmentDate: '2021-08-03',
    commitmentType: { code: 'PY', description: 'Payment' },
    commitmentStatus: { code: 'GD', description: 'Good' },
    commitmentActualStatus: { code: 'GD', description: 'Good' },
  };
  activeAgreementCount = '1';
  myStoreAgreementCount = '1';
  nsfChargebackAmount = '10';
  communicationsTotal = '5';
  communicationsToday = '1';
  autoPayFlag = 'Y';
  sentLetterFlag = 'N';
  skip = 'N';
  stolen = 'N';
  hard = 'Y';
  firstPaymentDefault = 'N';
  secondPaymentDefault = 'N';
  accountActivityType = {
    code: 'TXTS',
    description: 'Text Sent To Phone',
  };
  accountActivitySubType = {
    code: '',
    description: '2 WAY Text',
  };
  letterType = {
    code: 'COL',
    description: '15 Day Letter',
  };
}

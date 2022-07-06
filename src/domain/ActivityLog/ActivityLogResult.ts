import { Coworker } from '../../types/types';
import { Commitment, GenericObject } from '../PastDueList/PastDueCustomerList';

export interface ActivityLogResponse {
  storeNumber: string;
  accountActivities: AccountActivity[];
}

export interface PhoneContact {
  phoneNumber: number;
  firstName: string;
  lastName: string;
  phoneType: GenericObject;
  relationshipType: GenericObject;
}
export interface AccountActivity {
  activityDate: string;
  customerId: string;
  customerFirstName: string;
  customerLastName: string;
  route: GenericObject;
  callDate: string;
  phoneNumberDialed: string;
  callResultType: GenericObject;
  accountActivityType: GenericObject;
  accountActivitySubType: GenericObject;
  phoneContact: PhoneContact;
  relationshipType: GenericObject;
  pastDueDate: string;
  daysLate: string;
  commitment: Commitment;
  commitmentStatus: GenericObject;
  coWorker: Coworker;
}

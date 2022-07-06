import { StateAbbreviation } from '../domain/Common';
import { Address, AddressType } from '../types/types';

let lastAddressId = 1;

export class AddressMock implements Address {
  addressId = lastAddressId++;
  addressLine1 = 'address Line1';
  addressLine2 = 'address Line2';
  city = 'city';
  state = StateAbbreviation.TX;
  postalCode = '75024';
  longitude = '';
  latitude = '';
  addressType = AddressType.MAILING;
}

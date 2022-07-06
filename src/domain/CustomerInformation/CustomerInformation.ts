export interface CustomerAddressResponse {
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  addressId: number;
}

export interface CustomerInformationResponse {
  addresses: CustomerAddressResponse;
}

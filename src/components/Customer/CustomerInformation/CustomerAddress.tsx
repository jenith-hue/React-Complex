import {
  Grid,
  makeStyles,
  Typography,
  RACTextField,
  RACButton,
  RACSelect,
} from '@rentacenter/racstrap';
import React, { useEffect, useState } from 'react';
import { orderBy } from 'lodash';
import { useCustomerDetails } from '../../../context/CustomerDetails/CustomerDetailsProvider';
import { useStoreDetails } from '../../../context/Store/StoreProvider';
import { AddressType } from '../../../types/types';
import {
  AddressNotValidatedModal,
  AddressValidationModal,
} from '../../Customer/CustomerInformation/AddressValidationModal';
import { format } from 'date-fns';
import * as api from '../../../api/Customer';
import {
  getSelectedStore,
  randomNumericStringGenerator,
} from '../../../utils/utils';
import { API_ERROR_MESSAGE } from '../../../constants/constants';
import { ApiErrorModal } from '../../../common/ApiError/ApiError';

export const customerAddressTestId = 'customerAddressTestId';
export const customerAddressLine1TestId = 'customerAddressLine1TestId';
export const customerAddressLine2TestId = 'customerAddressLine2TestId';
export const customerPostalCodeTestId = 'customerPostalCodeTestId';
export const customerCityTestId = 'customerCityTestId';
export const customerStateTestId = 'customerStateTestId';
export const customerAddressFormId = 'customerAddressFormId';

enum ErrorMessage {
  INVALID_FORMAT_ERROR_MESSAGE = 'Postal code should be either in *****-**** or ***** format!',
  MAX_LENGTH_ERROR_MESSAGE = 'Max length exceeded!',
  ALL_0_ERROR_MESSAGE = `Postal code value can't be all 0's!`,
}

const useClasses = makeStyles((theme: any) => ({
  customerAddress: {
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.typography.pxToRem(0)} ${theme.typography.pxToRem(12)}`,
  },
  addressLineWrapper: { display: 'flex', flexDirection: 'row' },
  saveButton: {
    height: theme.typography.pxToRem(43),
    marginTop: theme.typography.pxToRem(16),
  },
  row: { marginBottom: theme.typography.pxToRem(24) },
  selectOptionsPaper: {
    maxHeight: theme.typography.pxToRem(200),
  },
}));

enum FormFields {
  city = 'city',
  state = 'state',
  postalCode = 'postalCode',
  addressLine1 = 'addressLine1',
  addressLine2 = 'addressLine2',
  addressId = 'addressId',
}

export const CustomerAddress = () => {
  const classes = useClasses();

  const {
    customerDetails: { addresses, customerId },
  } = useCustomerDetails();

  const [
    openCustomerAddressValidationModal,
    setOpenCustomerAddressValidationModal,
  ] = useState<boolean>(false);

  const [
    openCustomerAddressNotValidatedModal,
    setOpenCustomerAddressNotValidatedModal,
  ] = useState<boolean>(false);

  const [suggestedAddress, setSuggestedAddress] = useState<any>({});
  const [enteredAddress, setEnteredAddress] = useState<any>({});

  const [pending, setPending] = useState<boolean>(false);
  const [hasApiErrorUpdateCustomer, setHasApiErrorUpdateCustomer] =
    useState<boolean>(false);

  const primaryAddress = addresses?.filter(
    (address) => address.addressType === AddressType.PRIMARY
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customerAddress =
    primaryAddress && primaryAddress.length > 0
      ? primaryAddress[0]
      : {
          city: '',
          state: '',
          postalCode: '',
          addressLine1: '',
          addressLine2: '',
          addressId: '',
        };

  const [customerAddressLine1, setCustomerAddressLine1] = useState('');
  const [customerAddressLine2, setCustomerAddressLine2] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [customerPostalCode, setCustomerPostalCode] = useState('');
  const [customerCity, setCustomerCity] = useState('');

  useEffect(() => {
    const { addressLine1, addressLine2, city, state, postalCode } =
      customerAddress;

    setCustomerAddressLine1(addressLine1);
    setCustomerAddressLine2(addressLine2);
    setCustomerCity(city);
    setStateProvince(state);
    setCustomerPostalCode(postalCode);
  }, [customerAddress]);

  const { store, isAddressDoctorEnabled } = useStoreDetails();

  const countryAbbreviation = store?.countryAbb;

  const storeNumber = getSelectedStore();

  const [usStatesList, setUSStatesList] = useState([]);

  const [addressText, setAddressText] = useState('');

  const [postalCodeErrorMessage, setPostalCodeErrorMessage] = useState('');
  const [hasPostalCodeError, setHasPostalCodeError] = useState(false);
  const [hasStatesApiError, setHasStatesApiError] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    setFetchingData(true);
    api
      .getCustomerStatesList()
      .then((response) => {
        const statesList = response.map((state: any) => {
          return { label: state.abbreviation, value: state.abbreviation };
        });
        const sortedStatesList: any = orderBy(statesList, ['label'], ['asc']);

        setUSStatesList(sortedStatesList);
        setHasStatesApiError(false);
      })
      .catch(() => {
        setHasStatesApiError(true);
      })
      .finally(() => {
        setFetchingData(false);
      });
  }, []);

  const handleSubmit = () => {
    const { addressId } = customerAddress;
    const currentTimeZoneOffset = format(new Date(), 'XXX');
    const currentTimeStamp = format(new Date(), 'yyyy-MM-dd-HH:mm:ss:SSSSSS');

    const getRegionID = () => {
      if (countryAbbreviation === 'US') {
        return '1';
      } else if (countryAbbreviation === 'MX') {
        return '2';
      }
      return '';
    };

    const enteredAddress = {
      addressLine1: customerAddressLine1,
      addressLine2: customerAddressLine2,
      state: stateProvince,
      postalCode: customerPostalCode,
      city: customerCity,
    };

    setEnteredAddress(enteredAddress);

    if (!isAddressDoctorEnabled) {
      handleSave('isEnteredAddress', enteredAddress);
      return;
    }

    setPending(true);

    const payload = {
      MessageID: `CMS006-${randomNumericStringGenerator()}`,
      MessageType: 'CMS006',
      MessageDTS: currentTimeStamp,
      MessageDTSTZOffset: currentTimeZoneOffset,
      RegionID: getRegionID(),
      ClientID: '8',
      ClientLocationNumber: storeNumber,
      ClientSource: '1',
      ClientOriginator: '1',
      LocationNumber: storeNumber,
      EncryptionMethod: '0',
      Addresses: [
        {
          AddressID: addressId,
          StreetAddress:
            customerAddressLine2?.trim().length > 0
              ? `${customerAddressLine1}, ${customerAddressLine2}`
              : customerAddressLine1,
          City: customerCity,
          StateProvince: stateProvince,
          PostalCode: customerPostalCode.replace('-', ''),
        },
      ],
      StoreConfig: {
        storeNumbers: [storeNumber],
        paramKeyNames: ['AddressDoctorEnabled'],
      },
    };

    api
      .addressValidator(payload)
      .then((response) => {
        const addresses = response?.validateAddress?.Addresses;
        if (addresses.MatchCode === '1') {
          setOpenCustomerAddressNotValidatedModal(true);
          setSuggestedAddress({});
          setAddressText(
            `Zip code ${customerPostalCode} doesn't exist in the state ${stateProvince}.`
          );
        } else if (
          addresses.MatchCode === '6' ||
          addresses.MatchCode === '5' ||
          addresses.MatchCode === '8'
        ) {
          setSuggestedAddress(addresses);
          setOpenCustomerAddressValidationModal(true);
        } else if (addresses.MatchCode === '2') {
          setOpenCustomerAddressNotValidatedModal(true);
          setAddressText(
            `Zipcode found: ${customerPostalCode}. Do you want to override?`
          );
        } else if (addresses.MatchCode === '10') {
          handleSave('isEnteredAddress', enteredAddress);
        }
      })
      .catch(() => {
        setAddressText(
          `Automatic Address Validation is Unavailable for store ${storeNumber}`
        );
        setSuggestedAddress({});
        setOpenCustomerAddressNotValidatedModal(true);
      })
      .finally(() => {
        setPending(false);
      });
  };

  const handleSave = (
    isEnteredAddressSelected: string,
    userInputAddress?: Record<string, unknown>
  ) => {
    setPending(true);
    let { addressID, addressLine1, addressLine2, city, state, postalCode } =
      userInputAddress || enteredAddress || {};

    const { AddressID, StreetAddress, City, StateProvince, PostalCode } =
      suggestedAddress || {};
    const isEnteredAddress = isEnteredAddressSelected.length > 0;
    if (!isEnteredAddress) {
      addressID = AddressID;
      addressLine1 = StreetAddress;
      addressLine2 = '';
      city = City;
      state = StateProvince;
      postalCode = PostalCode;
    }
    const payload = {
      customerId: customerId,
      addresses: [
        {
          addressType: 'PRIM',
          addressLine1,
          addressLine2,
          city,
          state,
          postalCode,
          addressId: addressID,
        },
      ],
    };
    api
      .updateCustomer(payload)
      .then(() => {
        setCustomerAddressLine1(addressLine1);
        setCustomerAddressLine2(addressLine2);
        setCustomerCity(city);
        setStateProvince(state);
        setCustomerPostalCode(postalCode);
      })
      .catch(() => {
        setHasApiErrorUpdateCustomer(true);
      })
      .finally(() => {
        setPending(false);
        setOpenCustomerAddressNotValidatedModal(false);
        setOpenCustomerAddressValidationModal(false);
      });
  };

  const handleZipChange = (value: string) => {
    const regExp = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    setCustomerPostalCode(value);
    if (value?.length > 10) {
      setHasPostalCodeError(true);
      setPostalCodeErrorMessage(ErrorMessage.MAX_LENGTH_ERROR_MESSAGE);
    } else if (value.includes('00000') || value.includes('-0000')) {
      setHasPostalCodeError(true);
      setPostalCodeErrorMessage(ErrorMessage.ALL_0_ERROR_MESSAGE);
    } else if (!regExp.test(value)) {
      setHasPostalCodeError(true);
      setPostalCodeErrorMessage(ErrorMessage.INVALID_FORMAT_ERROR_MESSAGE);
    } else {
      setHasPostalCodeError(false);
    }
  };

  const isDirty = () => {
    const { addressLine1, addressLine2, city, state, postalCode } =
      customerAddress;
    if (
      addressLine1 === customerAddressLine1 &&
      addressLine2 === customerAddressLine2 &&
      city === customerCity &&
      state === stateProvince &&
      postalCode === customerPostalCode
    ) {
      return false;
    }
    return true;
  };

  const isFormValid = () => {
    if (
      customerAddressLine1.trim().length > 0 &&
      customerCity.trim().length > 0
    ) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={classes.customerAddress}
      data-testid={customerAddressTestId}
    >
      <Grid container>
        <Grid item sm={12} md={12} lg={12} classes={{ root: classes.row }}>
          <Typography variant="h4">Address</Typography>
        </Grid>
        <Grid item sm={12} md={12} lg={12}>
          <Grid container spacing={2} classes={{ root: classes.row }}>
            <Grid item sm={6} md={6} lg={6}>
              <RACTextField
                name={FormFields.addressLine1}
                label="Address Line 1"
                value={customerAddressLine1}
                type="text"
                required
                onChange={(value) => setCustomerAddressLine1(value)}
              />
            </Grid>
            <Grid item sm={6} md={6} lg={6}>
              <RACTextField
                name={FormFields.addressLine2}
                label="Address Line 2"
                value={customerAddressLine2}
                type="text"
                onChange={(value) => setCustomerAddressLine2(value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} classes={{ root: classes.row }}>
            <Grid item sm={10} md={10} lg={10}>
              <Grid container spacing={2}>
                <Grid item sm={4} md={4} lg={4}>
                  <RACTextField
                    name={FormFields.postalCode}
                    label="Zip"
                    value={customerPostalCode}
                    type="text"
                    required
                    onChange={(value) => handleZipChange(value)}
                    {...(hasPostalCodeError && {
                      errorMessage: postalCodeErrorMessage,
                    })}
                  />
                </Grid>
                <Grid item sm={4} md={4} lg={4}>
                  <RACTextField
                    name={FormFields.city}
                    label="City"
                    value={customerCity}
                    type="text"
                    required
                    onChange={(city) => setCustomerCity(city)}
                  />
                </Grid>
                <Grid item sm={4} md={4} lg={4}>
                  <RACSelect
                    classes={{ paper: classes.selectOptionsPaper }}
                    name={FormFields.state}
                    inputLabel="State"
                    defaultValue={stateProvince}
                    options={usStatesList}
                    required
                    onChange={(e) => {
                      setStateProvince(e.target.value);
                    }}
                    loading={fetchingData}
                    {...(hasStatesApiError && {
                      errorMessage: API_ERROR_MESSAGE,
                    })}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={2} md={2} lg={2} container justifyContent="flex-end">
              <RACButton
                variant="contained"
                disabled={
                  !isFormValid() ||
                  !isDirty() ||
                  hasPostalCodeError ||
                  pending ||
                  hasStatesApiError
                }
                size="large"
                color="primary"
                loading={pending}
                className={classes.saveButton}
                onClick={() => handleSubmit()}
              >
                Save
              </RACButton>
            </Grid>
            {hasApiErrorUpdateCustomer && (
              <ApiErrorModal
                open
                message="Failed to update address!"
                onClose={() => setHasApiErrorUpdateCustomer(false)}
              />
            )}
            {openCustomerAddressValidationModal && (
              <AddressValidationModal
                handleSave={(onsave) => handleSave(onsave)}
                suggestedAddress={suggestedAddress}
                enteredAddress={enteredAddress}
                pending={pending}
                onClose={() => setOpenCustomerAddressValidationModal(false)}
              />
            )}
            {openCustomerAddressNotValidatedModal && (
              <AddressNotValidatedModal
                pending={pending}
                text={addressText}
                onClose={() => setOpenCustomerAddressNotValidatedModal(false)}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

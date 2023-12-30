import { Typography } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';

const googleAPIKey = 'AIzaSyBTxQlXG1Xe6YyW2e0A8O6o-9uzqNnOwUQ';
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface AddressObject {
  formatted_address: string;
  address_components: AddressComponent[];
}

const hasScript = (url: string): boolean => {
  const scripts = document.getElementsByTagName('script');
  for (let i = scripts.length; i--; ) {
    if (scripts[i].src === url) return true;
  }

  return false;
};

const loadScript = (url: string, id: string, callback: () => void) => {
  let script: any;
  script = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = url;
  if (hasScript(url)) {
    callback();
  }
  if (!hasScript(url)) {
    document.querySelector('head')?.appendChild(script);
  }
};

function handleScriptLoad(
  updateQuery: React.Dispatch<React.SetStateAction<string>>,
  autoCompleteRef: React.MutableRefObject<HTMLInputElement | null>,
  updateFormState: (area: string, city: string, state: string, zip: string, country: string) => void,
) {
  let autoComplete: any;
  //@ts-ignore
  autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current!, {});
  autoComplete.setFields(['address_components', 'formatted_address', 'plus_code']);
  autoComplete.addListener('place_changed', () => handlePlaceSelect(autoComplete, updateQuery, updateFormState));
}

async function handlePlaceSelect(
  autoComplete: any,
  updateQuery: React.Dispatch<React.SetStateAction<string>>,
  updateFormState: (area: string, city: string, state: string, zip: string, country: string) => void,
) {
  const addressObject: any = autoComplete.getPlace();
  const query = addressObject.formatted_address;

  const addressArray = addressObject.address_components;

  const city = getCity(addressArray);
  const area = getArea(addressArray);
  const state = getState(addressArray);
  const streetNumber = getStreetNumber(addressArray);

  const zip = getPostalCode(addressArray);
  const country = getCountry(addressArray);
  const zipWithPrefix = streetNumber ? zip + '-' + streetNumber + '00' : zip;

  updateFormState(area, city, state, zip, country);

  updateQuery(query);
}

function getStreetNumber(addressArray: AddressComponent[]): string {
  let streetNo = '';
  addressArray.forEach((item) => {
    if (item.types.length > 0 && item.types[0] === 'street_number') {
      streetNo = item.long_name;
    }
  });

  return streetNo;
}

function getArea(addressArray: AddressComponent[]): string {
  let area = '';
  let streetNo = '';
  addressArray.forEach((item) => {
    if (item.types.length > 0 && item.types[0] === 'route') {
      area = item.long_name;
    }
    if (item.types.length > 0 && item.types[0] === 'street_number') {
      streetNo = item.long_name;
    }
  });

  return streetNo === '' ? area : streetNo + ' ' + area;
}

function getCity(addressArray: AddressComponent[]): string {
  let city = '';
  addressArray.forEach((item) => {
    if (item.types.length > 0) {
      item.types.forEach((item2) => {
        if (item2 === 'locality') {
          city = item.long_name;
        }
      });
    }
  });

  return city;
}

function getCountry(addressArray: AddressComponent[]): string {
  let country = '';
  addressArray.forEach((item) => {
    if (item.types.length > 0) {
      item.types.forEach((item2) => {
        if (item2 === 'country') {
          country = item.short_name;
        }
      });
    }
  });

  return country;
}

function getState(addressArray: AddressComponent[]): string {
  let state = '';
  addressArray.forEach((item) => {
    if (item.types.length > 0 && item.types[0] === 'administrative_area_level_1') {
      state = item.long_name;
    }
  });

  return state;
}

function getPostalCode(addressArray: AddressComponent[]): string {
  let zip = '';
  addressArray.forEach((item) => {
    if (item.types.length > 0 && item.types[0] === 'postal_code') {
      zip = zip + item.long_name;
    }
    if (item.types.length > 0 && item.types[0] === 'postal_code_suffix') {
      zip = zip + '-' + item.long_name;
    }
  });

  return zip;
}

interface SearchGoogleLocationProps {
  handleAddressChange: (area: string, city: string, state: string, zip: string, country: string) => void;
  className?: string;
  label?: string;
  labelClass?: string;
}

export default function SearchGoogleLocation(props: SearchGoogleLocationProps) {
  const [query, setQuery] = useState('');
  const loaded = useRef(false);
  const autoCompleteRef = useRef<HTMLInputElement | null>(null);

  const { handleAddressChange, className, label, labelClass } = props;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadScript(`https://maps.googleapis.com/maps/api/js?key=${googleAPIKey}&libraries=places`, 'google-maps', () =>
        handleScriptLoad(setQuery, autoCompleteRef, handleAddressChange),
      );
    }
  }, []);

  return (
    <>
      {label && (
        <Typography variant="body1" sx={{ mb: '3px' }}>
          {label}
        </Typography>
      )}
      <input
        style={{
          borderRadius: '4px',
          width: '100%',
          textIndent: '12px',
          marginBottom: '32px',
          outline: 'none',
          border: '1px solid rgb(184, 184, 195)',
          padding: '20px 0px',
          fontSize: '14px',
        }}
        id="pac-container"
        ref={autoCompleteRef}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search your address"
        value={query}
      />
    </>
  );
}

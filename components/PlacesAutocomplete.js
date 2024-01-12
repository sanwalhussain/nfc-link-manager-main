import React, { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const PlacesAutocomplete = ({ onPlaceSelected }) => {
  const [address, setAddress] = useState('');

  const handlePlaceSelect = (value) => {
    setAddress(value.description);
    onPlaceSelected(value);
  };

  return (
    <Autocomplete
      onSelect={handlePlaceSelect}
      defaultValue={address}
    >
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Search for an address"
        style={{ width: '100%', padding: '10px' }}
      />
    </Autocomplete>
  );
};

export default PlacesAutocomplete;

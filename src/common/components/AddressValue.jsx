import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCatch } from '../../reactHelper';

const AddressValue = ({ latitude, longitude, originalAddress }) => {

  const addressEnabled = useSelector((state) => state.session.server.geocoderEnabled);

  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress(originalAddress);
  }, [latitude, longitude, originalAddress]);

  const showAddress = useCatch(async () => {
    const query = new URLSearchParams({ latitude, longitude });
    const response = await fetch(`/api/server/geocode?${query.toString()}`);
    if (response.ok) {
      setAddress(await response.text());
    } else {
      throw Error(await response.text());
    }
  });

  if (address) {
    return address;
  }
  if (addressEnabled) {
    return showAddress();
  }
  return address;
};

export default AddressValue;

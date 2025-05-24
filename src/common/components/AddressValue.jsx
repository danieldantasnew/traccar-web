import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCatch } from "../../reactHelper";
import { Tooltip } from "@mui/material";

const AddressValue = ({
  latitude,
  longitude,
  originalAddress,
  setStateAddress,
}) => {
  const addressEnabled = useSelector(
    (state) => state.session.server.geocoderEnabled
  );

  const [address, setAddress] = useState(originalAddress);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setAddress(originalAddress);
    setErrorMessage("");
  }, [latitude, longitude, originalAddress]);

  useEffect(() => {
    if (!address && addressEnabled) {
      fetchAddress();
    }
  }, [address, addressEnabled]);

  const fetchAddress = useCatch(async () => {
    try {
      const query = new URLSearchParams({ latitude, longitude });
      const serverResponse = await fetch(`/api/server/geocode?${query.toString()}`);

      if (serverResponse.ok) {
        const data = await serverResponse.text();
        if (data) {
          setAddress(data);
          if (setStateAddress) setStateAddress(data);
          return;
        } else {
          setErrorMessage("Não foi possível encontrar o endereço");
        }
      } else {
        setErrorMessage("Erro ao buscar endereço");
      }

    } catch (error) {
      setErrorMessage(error.message || "Erro ao buscar endereço");
    }
  });


  return (
    <Tooltip
      title={address || errorMessage || "Carregando endereço..."}
      placement="top"
      arrow
    >
      <span>{address || errorMessage || "Carregando endereço..."}</span>
    </Tooltip>
  );
};

export default AddressValue;

  // const fetchAddress = useCatch(async () => {
  //   const query = new URLSearchParams({ latitude, longitude });

  //   try {
  //     const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=pt`;

  //     const nominatimResponse = await fetch(nominatimUrl, {
  //       headers: {
  //         "User-Agent": "traccar-lgnet/1.0 (daniel@lgnetpb.com.br)",
  //       },
  //     });

  //     if (!nominatimResponse.ok) throw new Error("Erro na API Nominatim");

  //     const data = await nominatimResponse.json();
  //     let addressString = '';

  //     if (data?.address) {


  //       const { road, neighbourhood, city_district, state, postcode, country } = data.address;
  //       addressString = `${road && road + ',' || ''} ${neighbourhood && neighbourhood + ','|| ''} ${city_district && city_district + ' -' || ''} ${state && state + ',' || ''} ${postcode && postcode + ',' || ''} ${country || ''}.`;
  //     }

  //     if (addressString && addressString.length >= 40) {
  //       setAddress(addressString);
  //       if (setStateAddress) setStateAddress(addressString);
  //       return;
  //     }

  //     if (data?.display_name && data.display_name.length >= 40) {
  //       setAddress(data.display_name);
  //       if (setStateAddress) setStateAddress(data.display_name);
  //       return;
  //     }

  //     await fetchFromServerFallback(query);

  //   } catch (error) {
  //     if (DEBUG) console.warn("Nominatim falhou:", error.message);

  //     try {
  //       await fetchFromServerFallback(query);
  //     } catch (serverError) {
  //       if (DEBUG) console.warn("Erro no fallback:", error.message);
  //       setErrorMessage(serverError.message || "Erro ao buscar endereço");
  //     }
  //   }
  // });

  // const fetchFromServerFallback = async (query) => {
  //   const serverResponse = await fetch(`/api/server/geocode?${query.toString()}`);

  //   if (!serverResponse.ok) throw new Error("Erro no servidor interno");

  //   const serverData = await serverResponse.text();

  //   if (serverData) {
  //     setAddress(serverData);
  //     if (setStateAddress) setStateAddress(serverData);
  //   } else {
  //     if (DEBUG) console.warn('Erro ao buscar endereço');
  //   }
  // };

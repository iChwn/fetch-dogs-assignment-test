/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-cycle */
import { routeUrl } from "constant";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { removeCookie } from "utility/helper";
import { getErrorHandlerData } from "utility/requestHelper/requestHelper";


const useCustomMutationReactQuery = (
  onFetch:any,
  options:any = { isStartOnInit: false, onError: () => {} }
) => {
  const { isStartOnInit, onError } = options;
  const navigate = useNavigate()
  const [decryptedData, setDecryptedData] = useState(null);
  const [isShortLoading, setIsShortLoading] = useState(false); // minimal loading time become 0,5s

  const result = useMutation(onFetch);
  const { mutate, data: response, isLoading } = result;

  const startFetch = async (param:any = null, onSuccess:any = () => {}) => {
    setIsShortLoading(true);
    setTimeout(() => {
      setIsShortLoading(false);
    }, 500);

    mutate(param, {
      onError: (err:any) => {
        if(err.status === 401) {
          removeCookie("auth")
          setTimeout(() => {
            navigate(routeUrl.authentication);
          }, 500);
        }

        const erroData = getErrorHandlerData(err);
        onError(erroData);
      },
      onSuccess: (data) => onSuccess(data),
    });
  };

  useEffect(() => {
    if (!isStartOnInit) return;

    startFetch();
  }, []);

  useEffect(() => {
    if (response == null) return;
    setDecryptedData(response);
  }, [response]);

  return {
    ...result,
    isLoading: isLoading || isShortLoading,
    decryptedData,
    startFetch,
  };
};

export default useCustomMutationReactQuery
import { useEffect, useState } from "react"
import { useCustomMutationReactQuery } from "../setupHooks";
import { authProccess, getDogsApi, getDogsBreedApi, getDogsmatchApi, getDogsSearchApi, logoutProccessApi } from "utility/apiProcess/fetchApi";

export const useFetch = () => {
  const [loadingAll, setLoadingAll] = useState(true)
  const {startFetch: loginProccess, isLoading: isAuthLoading, decryptedData:loginCallback} = useCustomMutationReactQuery(
    authProccess,
    {
      onError: e => console.log(e),
    }
  )

  const {startFetch: logoutProccess, isLoading: logoutLoading, decryptedData:logoutCallback} = useCustomMutationReactQuery(
    logoutProccessApi,
    {
      onError: e => console.log(e),
    }
  )

  const {startFetch: getDogsBreed, isLoading: dogsBreedLoading, decryptedData:dogsBreedData} = useCustomMutationReactQuery(
    getDogsBreedApi,
    {
      onError: e => console.log(e),
    }
  )

  const {startFetch: getDogsSreach, isLoading: dogsSreachLoading, decryptedData:dogsSreachData} = useCustomMutationReactQuery(
    getDogsSearchApi,
    {
      onError: e => console.log(e),
    }
  )

  const {startFetch: getDogs, isLoading: dogsLoading, decryptedData:dogsData} = useCustomMutationReactQuery(
    getDogsApi,
    {
      onError: e => console.log(e),
    }
  )

  const {startFetch: getDogsMatch, isLoading: dogsMatchLoading, decryptedData:dogsMatchData} = useCustomMutationReactQuery(
    getDogsmatchApi,
    {
      onError: e => console.log(e),
    }
  )

  useEffect(() => {
    const isAnyLoading = isAuthLoading || logoutLoading || dogsBreedLoading || dogsSreachLoading || dogsLoading || dogsMatchLoading;
    setLoadingAll(isAnyLoading);
  }, [isAuthLoading, logoutLoading, dogsBreedLoading, dogsSreachLoading, dogsLoading, dogsMatchLoading])
  

  return {
    loginProccess,
    isAuthLoading,
    loginCallback,

    logoutProccess,
    logoutLoading,
    logoutCallback,

    getDogsBreed,
    dogsBreedLoading,
    dogsBreedData,

    getDogsSreach,
    dogsSreachLoading,
    dogsSreachData,

    getDogs,
    dogsLoading,
    dogsData,

    getDogsMatch,
    dogsMatchLoading,
    dogsMatchData,

    loadingAll
  }
}
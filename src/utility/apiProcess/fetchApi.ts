import apiList from "constant/apiUrl";
import { startRequest } from "utility/requestHelper/requestHelper";


export const authProccess = async (postData) => {
  const apiData = {
    url: apiList.auth,
    method: "POST",
    data: postData,
  };

  return startRequest(apiData);
}

export const logoutProccessApi = async () => {
  const apiData = {
    url: apiList.logout,
    method: "POST",
  };

  return startRequest(apiData);
}

export const getDogsBreedApi = async () => {
  const apiData = {
    url: apiList.dogsBreed,
    method: "GET",
  };

  return startRequest(apiData);
};

export const getDogsSearchApi = async (paramsData) => {
  const apiData = {
    url: apiList.dogsSearch,
    method: "GET",
    params: paramsData,
  }

  return startRequest(apiData);
}

export const getDogsApi = async (postData) => {
  const apiData = {
    url: apiList.dogs,
    method: "POST",
    data: postData,
  }

  return startRequest(apiData);
}

export const getDogsmatchApi = async (postData) => {
  const apiData = {
    url: apiList.dogsMatch,
    method: "POST",
    data: postData,
  }

  return startRequest(apiData);
}
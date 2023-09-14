import axios from "axios";
import EnvironmentHelper from "@helpers/EnvironmentHelper";
// Adapters
import injectAuthHeadersAdapter from "./injectAuthHeadersAdapter";
// Api Endpoints
import AuthenticationApi from "./Api/AuthenticationApi";
import UserApi from "./Api/UserApi";
import OrderApi from "./Api/OrderApi";
import PackSizeApi from "./Api/PackSizeApi";

// Defining Server Side Http Client
const serverSideHttpClient = axios.create(
  EnvironmentHelper.defaultAxiosRequestConfiguration(
    EnvironmentHelper.SERVER_API_BASE_URL
  )
);
// Defining Client Side Http Client
let browserSideHttpClient = axios.create(
  EnvironmentHelper.defaultAxiosRequestConfiguration(
    EnvironmentHelper.API_BASE_URL
  )
);
browserSideHttpClient.interceptors.request.use(...injectAuthHeadersAdapter);

// Defining Http Client to be used
const generator = () => {
  return {
    BrowserSide: {
      client: browserSideHttpClient,
      UserApi: UserApi(browserSideHttpClient),
      AuthenticationApi: AuthenticationApi(browserSideHttpClient),
      OrderApi: OrderApi(browserSideHttpClient),
      PackSizeApi: PackSizeApi(browserSideHttpClient),
    },
    ServerSide: {
      client: serverSideHttpClient,
      AuthenticationApi: AuthenticationApi(serverSideHttpClient),
      UserApi: UserApi(browserSideHttpClient),
    },
  };
};

export const HttpClient = generator();

import { AuthenticationCookies } from "@/pages/api/login";
import { AxiosRequestConfig } from "axios";
import cookie from "cookie";

export function getAuthCookie(): AuthenticationCookies | undefined {
  try {
    const authCookieString: string =
      process.browser && document.cookie
        ? cookie.parse(document.cookie).auth
        : "{}";

    const authCookie: AuthenticationCookies = JSON.parse(authCookieString);

    if (!authCookie.Authorization) throw "Can't find token in auth cookie";

    return authCookie;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

const injectAuthHeadersAdapter = [
  function (config: AxiosRequestConfig<any>) {
    try {
      const authCookie = getAuthCookie();
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${authCookie?.Authorization}`,
        },
      };
    } catch (error) {
      return config;
    }
  },
  function (error: any) {
    // Do something with request error
    return Promise.reject(error);
  },
];

export default injectAuthHeadersAdapter;

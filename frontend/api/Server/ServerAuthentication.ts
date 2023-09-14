import axios from "axios";
import { IUserData } from "@/interfaces/IUser";
import { LoginInputParams } from "../HttpClient/Api/AuthenticationApi";

export const ServerAuthentication = {
  login: (params: LoginInputParams) =>
    axios.post<IUserData>("/api/login", params),
  logout: () =>
    new Promise((resolve, reject) => {
      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      resolve(true);
    }),
};

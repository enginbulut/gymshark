import { IUser, IUserData } from "@/interfaces/IUser";
import { Axios } from "axios";

export type LoginInputParams = {
  body: {
    email: string;
    password: string;
  };
};

export type SignUpInputParams = {
  body: {
    full_name: string;
    email: string;
    password: string;
  };
};

const AuthenticationApi = (request: Axios) => ({
  login: async (params: LoginInputParams) =>
    await request.post<IUserData>("/users/login", params.body),
  signUp: async (params: SignUpInputParams) =>
    await request.post<IUser>("/users", params.body),
});

export default AuthenticationApi;

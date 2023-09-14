import type { NextApiRequest, NextApiResponse } from "next";
import { AxiosError, AxiosResponse } from "axios";
import cookie from "cookie";
import { HttpClient } from "@/api/HttpClient";
import { LoginInputParams } from "@/api/HttpClient/Api/AuthenticationApi";
import { IUserData } from "@/interfaces/IUser";

export type AuthenticationResponse = AxiosResponse<IUserData>;
export type AuthenticationCookies = {
  Authorization: string;
};

export const handleSuccessfulAuthResponse = (
  authResponse: AuthenticationResponse,
  nextResponse: NextApiResponse
) => {
  const authCookie: AuthenticationCookies = {
    Authorization: authResponse.data.access_token,
  };
  nextResponse
    .setHeader(
      "Set-Cookie",
      cookie.serialize("auth", JSON.stringify(authCookie), {
        httpOnly: false,
        secure: true,
        sameSite: "lax",
        maxAge: Math.pow(2, 31) - 1,
        path: "/",
      })
    )
    .status(200)
    .json({ user: authResponse.data });
};

async function Login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const params: LoginInputParams = req.body;

    // Fetch user object and token
    const response = await HttpClient.ServerSide.AuthenticationApi.login(
      params
    );

    // This helper will set the cookies for the client
    handleSuccessfulAuthResponse(response, res);
  } catch (error) {
    console.log("exception error", error);
    if (
      (error as AxiosError).isAxiosError == true &&
      (error as AxiosError).response !== undefined
    ) {
      res
        .status((error as AxiosError).response!.status)
        .json((error as AxiosError).response?.data);
    } else {
      res.status(500).json({ error: JSON.stringify(error, null, 2) });
    }
  }
}

export default Login;

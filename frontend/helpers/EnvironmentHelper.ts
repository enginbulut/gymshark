import VersionFile from "../version.json";
import { AxiosRequestConfig } from "axios";

/**
 * This helper will contain a set of functions that would help with environment context
 */
export default class EnvironmentHelper {
  public static API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
  public static SERVER_API_BASE_URL = process.env.SERVER_API_BASE_URL!;

  public static defaultAxiosRequestConfiguration = (
    api_url: string
  ): AxiosRequestConfig => ({
    baseURL: `http://${api_url}`,
    headers: {
      platform: VersionFile.version,
    },
  });
}
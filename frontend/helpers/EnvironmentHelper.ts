import VersionFile from "../version.json";
import { AxiosRequestConfig } from "axios";

/**
 * This helper will contain a set of functions that would help with environment context
 */
export default class EnvironmentHelper {
  public static API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  public static defaultAxiosRequestConfiguration = (): AxiosRequestConfig => ({
    baseURL: `http://${EnvironmentHelper.API_URL}`,
    headers: {
      platform: VersionFile.version,
    },
  });
}

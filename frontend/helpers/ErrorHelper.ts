import { AxiosError } from "axios";

/**
 * This helper will contain a set of functions that would help with error parsing
 */
export default class ErrorHelper {
  /**
   * Helps parse Api errors
   * @param error An axios error serialized by Api
   * @returns A string of the error message
   */
  public static parseApiError = (
    error: AxiosError<{ error: string }>
  ): string => {
    try {
      return error?.response?.data.error || "Something went wrong";
    } catch (error) {
      return "Something went wrong";
    }
  };
}

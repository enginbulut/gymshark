import moment from "moment-timezone";

/**
 * This helper will contain a set of functions that would help with Date related operations
 */
export default class DateHelper {
  /**
   * Formats a moment object
   * @param date a string date
   * @param format
   * @returns a string of the formatted date
   */
  public static format = (date: string, format?: string) =>
    this.parseDate(date).format(format || "MMMM DD YYYY");

  static parseDate = (date: string) => moment(date);
}

import { ICurrentUser, IUserRole } from "@/interfaces/IUser";

/**
 * This helper will contain a set of functions that would help with Admin related operations
 */
export default class UserHelper {
  /**
   * Will parse user's fullname and fallback to his email if name doesn't exist
   * @param user User object
   * @returns A string of the user fullname
   */
  public static getDisplayName = (user: ICurrentUser) => {
    let name = user.full_name;
    if (user.role === IUserRole.admin) name += " (Admin)";
    return name;
  };
}

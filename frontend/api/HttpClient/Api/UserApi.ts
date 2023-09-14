import { ICurrentUser } from "@/interfaces/IUser";
import { Axios } from "axios";

const currentUserKey = () => ["currentUser"];

const UserApi = (request: Axios) => ({
  currentUser: {
    fetcher: async () => {
      const response = await request.get<ICurrentUser>("/users/current");
      return response.data;
    },
    key: currentUserKey,
  },
});
export default UserApi;

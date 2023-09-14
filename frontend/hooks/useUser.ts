import { HttpClient } from "@/api/HttpClient";
import { IUserRole } from "@/interfaces/IUser";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  const { data: user, ...userQuery } = useQuery(
    HttpClient.BrowserSide.UserApi.currentUser.key(),
    HttpClient.BrowserSide.UserApi.currentUser.fetcher,
    {
      staleTime: 0,
      retry: false,
    }
  );

  const isAdmin = user?.role === IUserRole.admin;

  return { user, isAdmin, userQuery };
}

import { HttpClient } from "@/api/HttpClient";
import { ServerAuthentication } from "@/api/Server/ServerAuthentication";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useSession() {
  const queryClient = useQueryClient();
  const loginMutation = useMutation(ServerAuthentication.login, {
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries();
      queryClient.clear();
    },
  });
  const signUpMutation = useMutation(
    HttpClient.BrowserSide.AuthenticationApi.signUp,
    {
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries();
        queryClient.clear();
      },
    }
  );
  const logoutMutation = useMutation(ServerAuthentication.logout, {
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries();
      queryClient.clear();
    },
  });

  return {
    loginMutation,
    signUpMutation,
    logoutMutation,
  };
}

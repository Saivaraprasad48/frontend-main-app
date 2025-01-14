import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchUserOrgs = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const accessToken = getAccessToken();
  const { data } = useQuery(
    ['userOrgs'],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/user/${user?.userId}`,
        {
          signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await handleApiErrors(response);
      return json;
    },
    {
      enabled: user !== undefined,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch off user orgs',
        });
      },
    }
  );
  return { data };
};

export default useFetchUserOrgs;

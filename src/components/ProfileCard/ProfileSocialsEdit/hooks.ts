import {
  IUpdateProfileSocial,
  updateProfileSocialAction,
} from 'actions/profile';
import { updateUserDiscord } from 'actions/user';
import config from 'config';
import { IUpdateUser } from 'interfaces/user';
import { Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleUnAuthorization } from 'utils/handleUnAuthorization';

interface FunctionParameters {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const useUpdateProfileSocial = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const updateProfileSocial = ({
    portfolio,
    linkedin,
    twitter,
    instagram,
    github,
    setOpen,
  }: IUpdateProfileSocial & FunctionParameters) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            portfolio,
            linkedin,
            twitter,
            instagram,
            github,
          };

          const response = await fetch(
            `${config.ApiBaseUrl}/profile/${profile?.profileId}`,
            {
              signal,
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(payload),
            }
          );
          await handleApiErrors(response);
          dispatch(
            updateProfileSocialAction(
              portfolio,
              linkedin,
              twitter,
              instagram,
              github
            )
          );
        } catch (err: any) {
          console.log(err);
          handleUnAuthorization(err);
        } finally {
          setOpen(false);
        }
      })();
    }
  };

  return updateProfileSocial;
};

const useUpdateUserDiscordUserName = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const updateUserDiscordUName = ({ discordId }: IUpdateUser) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;
      (async () => {
        try {
          const payload = {
            discordId,
          };
          const response = await fetch(
            `${config.ApiBaseUrl}/user/${Number(user && user.userId)}`,
            {
              signal,
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(payload),
            }
          );
          await handleApiErrors(response);
          dispatch(updateUserDiscord(discordId));
        } catch (err) {
          console.log('err', err);
          handleUnAuthorization(err);
        }
      })();
    }
  };
  return updateUserDiscordUName;
};

export { useUpdateProfileSocial, useUpdateUserDiscordUserName };

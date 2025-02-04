import { FC } from 'react';
import { getAccessToken } from 'utils/authFn';
import { useSearchParams } from 'react-router-dom';
import config from 'config';
import { ReactComponent as NeonSundaeLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import BaseBlob from 'components/BaseBlob';
import { Toaster } from 'react-hot-toast';
import { useAcceptInvitation, useRejectInvitation } from './hook';
import styles from './index.module.scss';

const InvitationAction: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const acceptInvitation = useAcceptInvitation();
  const rejectInvitation = useRejectInvitation();

  console.log(searchParams.get('invitation_token'));
  console.log(searchParams.get('invitation_type'));

  const headerText = () => {
    if (searchParams.get('invitation_type') === 'transfer-owner') {
      return 'take ownership';
    }
    return 'collaborate';
  };

  const descriptionText = () => {
    if (searchParams.get('invitation_type') === 'transfer-owner') {
      return 'Admin';
    }
    return 'Manager';
  };

  const handleAccept = () => {
    const accessToken = getAccessToken();

    if (accessToken === null) {
      const newWindow = window.open(
        `${config.AppDomain}/login`,
        '_blank',
        'noopener,noreferrer'
      );
      if (newWindow) newWindow.opener = null;
      return;
    }

    const token = searchParams.get('invitation_token');
    if (token) {
      acceptInvitation(token);
    }
  };

  const handleReject = () => {
    const accessToken = getAccessToken();

    if (accessToken === null) {
      const newWindow = window.open(
        `${config.AppDomain}/login`,
        '_blank',
        'noopener,noreferrer'
      );
      if (newWindow) newWindow.opener = null;
      return;
    }

    const token = searchParams.get('invitation_token');
    if (token) {
      rejectInvitation(token);
    }
  };

  return (
    <div className={styles.InvitationContainer}>
      <div className={styles.ActionContainer}>
        <NeonSundaeLogo
          width={131}
          height={100}
          style={{ marginTop: '10px' }}
        />
        <BaseBlob
          blobColor="rgba(247, 153, 255, 1)"
          width={270}
          height={270}
          className="login-container-blob-pink"
        />
        <BaseBlob
          blobColor="rgba(167, 153, 255, 1)"
          width={270}
          height={270}
          className="login-container-blob-purple"
        />
        <h2>Invitation to {headerText()}</h2>
        <p>
          You have been invited to be an {descriptionText()}. Please accept or
          decline the invitation
        </p>
        <div>
          <button
            className={styles['accept-invitation']}
            onClick={handleAccept}
          >
            Accept
          </button>
          <button
            className={styles['decline-invitation']}
            onClick={handleReject}
          >
            Decline
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default InvitationAction;

import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import clsx from 'clsx';
import { RootState } from 'reducers';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import styles from './index.module.scss';
import DisconnectModal from './DisconnectModal';

const ProfileButton: FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.user);
  const currentUserProfilePicture = useSelector(
    (state: RootState) => state.profile.currentUserProfilePicture
  );

  const pictureFunc = () => {
    return (
      currentUserProfilePicture ||
      getDefaultAvatarSrc(user?.name?.charAt(0).toUpperCase())
    );
  };

  const handleNavigation = () => {
    navigate(`/profile/${user?.userId}`);
    // * To reload the page because with SPA navigation, the data was not refreshing
    navigate(0);
  };

  const getFormattedWalletId = () => {
    if (user?.walletId) {
      return `${user.walletId.slice(0, 6)}...${user.walletId.slice(
        // eslint-disable-next-line no-unsafe-optional-chaining
        user.walletId.length - 6,
        user.walletId.length
      )}`;
    }

    return '';
  };

  const getFormattedDomainName = () => {
    if (user?.domain) {
      return `${user.domain.slice(0, 6)}...${user.domain.slice(
        user.domain.length - 6,
        user.domain.length
      )}`;
    }

    return '';
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles['image-cont']}
        title="Visit Profile"
        onClick={handleNavigation}
      >
        <div className={styles.image}>
          <img src={pictureFunc()} alt="your profile" />
        </div>
        <p className={styles['profile-text']}>Profile</p>
      </div>
      <div
        id="navbar-wallet-information"
        className={styles.content}
        title="Wallet Information"
        onClick={handleOpen}
      >
        <p className={styles['navbar-username']}>{user?.name}</p>
        <span
          className={styles['navbar-wallet-address']}
          title={user?.domain ? user.domain : user?.walletId}
        >
          {user?.domain ? getFormattedDomainName() : getFormattedWalletId()}
        </span>
        <div className={clsx(styles['text--secondary'], styles['text--align'])}>
          <span>Connected Wallet</span>
          <WalletConnIndicator />
        </div>
      </div>
      {open && (
        <DisconnectModal
          handleClose={handleClose}
          pictureFunc={pictureFunc}
          getFormattedWalletId={getFormattedWalletId}
          getFormattedDomainName={getFormattedDomainName}
        />
      )}
      <Toaster />
    </div>
  );
};

const WalletConnIndicator: FC = () => {
  return (
    <div className={styles['indicator-outer']}>
      <div className={styles['indicator-fill']} />
    </div>
  );
};

export default ProfileButton;

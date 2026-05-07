import React from 'react';
import { User } from 'lucide-react';
import { getProfilePictureUrl } from '../utils/profilePicture';

interface ProfileAvatarProps {
  profilePicture?: string | null;
  className?: string;
  iconClassName?: string;
  fallbackClassName?: string;
  alt?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profilePicture,
  className = 'w-10 h-10',
  iconClassName = 'w-5 h-5 text-white',
  fallbackClassName = 'bg-blue-600',
  alt = 'Foto profil'
}) => {
  const [imageFailed, setImageFailed] = React.useState(false);
  const imageUrl = getProfilePictureUrl(profilePicture);

  React.useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  return (
    <div className={`${className} ${fallbackClassName} rounded-full flex items-center justify-center overflow-hidden`}>
      {!imageFailed ? (
        <img
          src={imageUrl}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <User className={iconClassName} />
      )}
    </div>
  );
};

import { backendUrl } from './api';

const DEFAULT_PROFILE_PICTURE = '/uploads/profiles/default.jpg';

export const getProfilePictureUrl = (profilePicture?: string | null): string => {
  const picture = profilePicture || DEFAULT_PROFILE_PICTURE;

  if (/^(https?:|data:|blob:)/i.test(picture)) {
    return picture;
  }

  const normalizedPicture = picture.startsWith('/') ? picture : `/${picture}`;
  return normalizedPicture.startsWith('/uploads/') ? backendUrl(normalizedPicture) : normalizedPicture;
};

export const hasProfilePicture = (profilePicture?: string | null): boolean => {
  return Boolean(profilePicture && profilePicture.trim());
};

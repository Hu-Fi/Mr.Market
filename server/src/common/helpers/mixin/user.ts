import axios from 'axios';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { getRFC3339Timestamp } from '../utils';

export const getUserMe = async (token: string) => {
  try {
    const response = await axios.get('https://api.mixin.one/me', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const mapApiResponseToMixinUser = (
  user: any,
  jwt_token: string,
): Partial<MixinUser> => {
  return {
    user_id: user.user_id,
    type: user.type || 'user',
    identity_number: user.identity_number || '',
    phone: user.phone || '',
    full_name: user.full_name || '',
    avatar_url: user.avatar_url || '',
    jwt_token: jwt_token,
    created_at: user.created_at || '',
    last_updated: getRFC3339Timestamp(),
  };
};

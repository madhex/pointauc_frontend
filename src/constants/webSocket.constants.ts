import { isProduction } from '../utils/common.utils';

export const MESSAGE_TYPES = {
  MOCK_PURCHASE: 'GET_MOCK_DATA',
  CHANNEL_POINTS_SUBSCRIBE: 'CHANNEL_POINTS_SUBSCRIBE',
  CHANNEL_POINTS_UNSUBSCRIBE: 'CHANNEL_POINTS_UNSUBSCRIBE',
  CP_SUBSCRIBED: 'CP_SUBSCRIBED',
  CP_UNSUBSCRIBED: 'CP_UNSUBSCRIBED',
  IDENTIFY_CLIENT: 'IDENTIFY_CLIENT',
  NEW_REQUEST: 'NEW_REQUEST',
  START_VOTING: 'START_VOTING',
  SKIP_REQUEST: 'SKIP_REQUEST',
  VOTE_SKIP: 'VOTE_SKIP',
  VOTE_ANTI_SKIP: 'VOTE_ANTI_SKIP',

  REFUND_REWARD: 'REFUND_REWARD',

  PURCHASE: 'PURCHASE',
  SET_AUC_REWARD_PREFIX: 'SET_AUC_REWARD_PREFIX',
};

export const WEBSOCKET_URL = isProduction() ? 'wss://woods-service.herokuapp.com' : 'ws://localhost:8000';

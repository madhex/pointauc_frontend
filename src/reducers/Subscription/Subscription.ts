import { ActionCreatorWithPayload, createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { Action } from 'redux';
import { Socket } from 'socket.io-client';
import { RootState } from '../index';
import { addAlert } from '../notifications/notifications';
import { AlertTypeEnum } from '../../models/alert.model';

export interface SubscribeState {
  actual: boolean;
  loading: boolean;
}

interface SubscriptionStoreState {
  twitch: SubscribeState;
  da: SubscribeState;
  donatePay: SubscribeState;
}

const initialSubscribeState = {
  actual: false,
  loading: false,
};

export const initialState: SubscriptionStoreState = {
  twitch: initialSubscribeState,
  da: initialSubscribeState,
  donatePay: initialSubscribeState,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setTwitchSubscribeState(state, action: PayloadAction<Partial<SubscribeState>>): void {
      state.twitch = { ...state.twitch, ...action.payload };
    },
    setDaSubscribeState(state, action: PayloadAction<Partial<SubscribeState>>): void {
      state.da = { ...state.da, ...action.payload };
    },
    setDonatePaySubscribeState(state, action: PayloadAction<Partial<SubscribeState>>): void {
      state.donatePay = { ...state.donatePay, ...action.payload };
    },
  },
});

const { setDaSubscribeState, setTwitchSubscribeState, setDonatePaySubscribeState } = subscriptionSlice.actions;

const sendSubscribeState = (
  socket: Socket,
  isSubscribed: boolean,
  dispatch: ThunkDispatch<{}, {}, Action>,
  getStateAction: ActionCreatorWithPayload<Partial<SubscribeState>>,
): void => {
  const event = isSubscribed ? 'bidsSubscribe' : 'bidsUnsubscribe';

  if (!socket) {
    return;
  }

  socket.once('bidsStateChange', ({ state, error }) => {
    console.log('state changed', state);
    dispatch(getStateAction({ actual: state, loading: false }));

    if (error) {
      dispatch(addAlert({ type: AlertTypeEnum.Error, message: error }));
    }
  });
  socket.emit(event);

  dispatch(getStateAction({ loading: true }));
};

export const sendCpSubscribedState =
  (isSubscribed: boolean) =>
  (dispatch: ThunkDispatch<{}, {}, Action>, getState: () => RootState): void => {
    const { twitchSocket } = getState().socketIo;

    if (twitchSocket) {
      sendSubscribeState(twitchSocket, isSubscribed, dispatch, setTwitchSubscribeState);
    }
  };

export const sendDaSubscribedState =
  (isSubscribed: boolean) =>
  (dispatch: ThunkDispatch<{}, {}, Action>, getState: () => RootState): void => {
    const { daSocket } = getState().socketIo;

    if (daSocket) {
      sendSubscribeState(daSocket, isSubscribed, dispatch, setDaSubscribeState);
    }
  };

export const sendDonatePaySubscribedState =
  (isSubscribed: boolean) =>
  (dispatch: ThunkDispatch<{}, {}, Action>, getState: () => RootState): void => {
    const { donatePaySocket } = getState().socketIo;

    if (donatePaySocket) {
      sendSubscribeState(donatePaySocket, isSubscribed, dispatch, setDonatePaySubscribeState);
    }
  };

export default subscriptionSlice.reducer;

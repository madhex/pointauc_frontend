import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertProps, AlertType, AlertTypeEnum } from '../../models/alert.model';
import { MAX_ALERTS } from '../../constants/common.constants';

interface NotificationsState {
  message: string | null;
  alerts: AlertType[];
}
// { type: AlertTypeEnum.Success, id: 1, message: `kozjar добавил 10000 к "Хранители"!` }
const initialState: NotificationsState = {
  message: null,
  alerts: [{ type: AlertTypeEnum.Success, id: 1, message: `kozjar добавил 10000 к "Хранители"!` }],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotification(state, action: PayloadAction<string | null>): void {
      state.message = action.payload;
    },
    addAlert(state, action: PayloadAction<AlertProps>): void {
      const updatedAlerts = [...state.alerts, { ...action.payload, id: Math.random() }];

      if (updatedAlerts.length > MAX_ALERTS) {
        updatedAlerts.splice(0, 1);
      }

      state.alerts = updatedAlerts;
    },
    deleteAlert(state, action: PayloadAction<number>): void {
      state.alerts = state.alerts.filter(({ id }) => id !== action.payload);
    },
  },
});

export const { setNotification, addAlert, deleteAlert } = notificationsSlice.actions;

export default notificationsSlice.reducer;

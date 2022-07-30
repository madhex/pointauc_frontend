import React, { DragEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './SlotsColumn.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, IconButton, Input, Typography } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import classNames from 'classnames';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { RootState } from '../../../reducers';
import { addSlot, createSlotFromPurchase } from '../../../reducers/Slots/Slots';
import { getCookie, handleDragOver } from '../../../utils/common.utils';
import SlotsList from './SlotsList';
import { Purchase, removePurchase, setDraggedRedemption, updateExistBids } from '../../../reducers/Purchases/Purchases';
import { useCostConvert } from '../../../hooks/useCostConvert';
import { setAucSettings } from '../../../reducers/AucSettings/AucSettings';

const SlotsColumn: React.FC = () => {
  const dispatch = useDispatch();
  const buyoutInput = useRef<HTMLInputElement>(null);
  const { slots } = useSelector((rootReducer: RootState) => rootReducer.slots);
  const {
    settings: { isBuyoutVisible, background, isTotalVisible },
  } = useSelector((rootReducer: RootState) => rootReducer.aucSettings);
  const { draggedRedemption } = useSelector((root: RootState) => root.purchases);
  const [, setBuyout] = useState<number | null>(null);
  const [enterCounter, setEnterCounter] = useState<number>(0);
  const isOver = useMemo(() => !!enterCounter, [enterCounter]);

  const handleAddSlot = (): void => {
    dispatch(addSlot({}));
  };

  const addButtonClasses = useMemo(
    () => classNames('add-button', { 'drag-over': isOver }, { 'custom-background': background }),
    [background, isOver],
  );

  const handleBuyoutChange = (): void => {
    if (buyoutInput.current) {
      setBuyout(Number(buyoutInput.current.value));
    }
  };

  const buyoutStyles = classNames('slots-column-buyout', { hidden: !isBuyoutVisible });

  useEffect(() => {
    if (!isBuyoutVisible && buyoutInput.current) {
      setBuyout(null);
      buyoutInput.current.value = '';
    }
  }, [isBuyoutVisible]);

  useEffect(() => {
    if (buyoutInput.current) {
      buyoutInput.current.addEventListener('change', handleBuyoutChange);
    }
  }, [buyoutInput]);

  useEffect(() => {
    const newVisible = getCookie('showTotal');

    dispatch(setAucSettings({ isTotalVisible: newVisible === 'true' }));
  }, [dispatch]);

  const convertCost = useCostConvert();

  const handleDrop = useCallback(
    (e: DragEvent<HTMLButtonElement>) => {
      const redemption: Purchase = JSON.parse(e.dataTransfer.getData('redemption'));
      dispatch(createSlotFromPurchase({ ...redemption, cost: convertCost(redemption.cost, true) }));
      dispatch(removePurchase(redemption.id));
      dispatch(setDraggedRedemption(null));
      dispatch(updateExistBids);
      setEnterCounter(0);
    },
    [convertCost, dispatch],
  );

  const handleDragEnter = useCallback(() => {
    setEnterCounter((prevState) => prevState + 1);
  }, []);

  const handleDragLeave = useCallback(() => {
    setEnterCounter((prevState) => prevState - 1);
  }, []);

  const slotsColumnClasses = useMemo(
    () => classNames('slots-column', { dragging: !!draggedRedemption }),
    [draggedRedemption],
  );

  const totalSum = useMemo(() => slots.reduce((sum, slot) => (slot.amount ? sum + slot.amount : sum), 0), [slots]);

  const toggleTotalSumVisability = useCallback(() => {
    document.cookie = `showTotal=${!isTotalVisible}; expires=Fri, 31 Dec 9999 23:59:59 GMT\``;
    dispatch(setAucSettings({ isTotalVisible: !isTotalVisible }));
  }, [dispatch, isTotalVisible]);

  return (
    <Grid container direction="column" wrap="nowrap" className="slots">
      <div className={buyoutStyles}>
        <Typography className="slots-column-buyout-title" variant="h4">
          Выкуп...
        </Typography>
        <Input className="slots-column-buyout-input" placeholder="₽" inputRef={buyoutInput} type="number" />
      </div>
      <Grid container wrap="nowrap" className="slots-wrapper">
        <Grid container className={slotsColumnClasses} direction="column" wrap="nowrap">
          <SlotsList slots={slots} />
          <div className="slots-footer">
            <IconButton
              onClick={handleAddSlot}
              className={addButtonClasses}
              title="Добавить слот"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <AddBoxIcon fontSize="large" />
            </IconButton>
            <div className="total-sum-container">
              {isTotalVisible && <Typography className="total-sum">{`Всего: ${totalSum} ₽`}</Typography>}
              <IconButton onClick={toggleTotalSumVisability} className="hide-sum">
                {isTotalVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </div>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SlotsColumn;

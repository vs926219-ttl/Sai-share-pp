/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { React, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SET_DATALIST,
  SET_FILTER_INPUT,
  SET_OPEN_CHILDMENU,
} from '../../redux/features/filter/actionTypes';
import styles from './ChildList.module.css';

const ChildList = () => {
  const anchorRef = useRef(null);
  const dispatch = useDispatch();
  const { dataList, openChildMenu, menu, list } = useSelector(
    (state) => state.filters
  );

  const getDataList = (newFilter) => {
    const isDuplicate = dataList.find((obj) => obj.value === newFilter.value);
    if (!isDuplicate) {
      return [...dataList, newFilter];
    }
    isDuplicate.value = newFilter.value;
    return [...dataList];
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    dispatch({
      type: SET_OPEN_CHILDMENU,
      payload: false,
    });
  };
  return (
    <div>
      <Popper
        open={openChildMenu}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        <Paper className={styles.childPosition}>
          <ClickAwayListener onClickAway={(e) => handleClose(e)}>
            <MenuList autoFocusItem={openChildMenu} id='menu-list-grow'>
              {list?.map((item) => (
                <div
                  onClick={() => {
                    const newFilter = { name: menu, value: item.name };
                    dispatch({
                      type: SET_FILTER_INPUT,
                      payload: newFilter,
                    });
                    const data = getDataList(newFilter);
                    dispatch({
                      type: SET_DATALIST,
                      payload: data,
                    });

                    dispatch({
                      type: SET_OPEN_CHILDMENU,
                      payload: false,
                    });
                  }}
                >
                  <MenuItem className={styles.childItem}>
                    {item.name.replace('_', ' ')}
                  </MenuItem>
                </div>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  );
};

export default ChildList;

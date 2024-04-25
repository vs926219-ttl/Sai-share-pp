/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { React, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SET_MENU,
  SET_OPEN_CHILDMENU,
  SET_OPEN_MENU,
} from '../../redux/features/filter/actionTypes';
import styles from './Menu.module.css';

const Menu = () => {
  const [hover, setHover] = useState();
  const dispatch = useDispatch();
  const { openMenu } = useSelector((state) => state.filters);
  const anchorRef = useRef(null);
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    dispatch({
      type: SET_OPEN_MENU,
      payload: false,
    });
  };
  const listItem = [
    { id: 0, name: 'Stage' },
    { id: 1, name: 'Process' },
    // { id: 2, name: 'Sort' }, // This will be added when sorting from backend is working
  ];
  return (
    <div>
      <Popper
        open={openMenu}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        <Paper className={styles.menuPosition}>
          <ClickAwayListener onClickAway={(e) => handleClose(e)}>
            <MenuList autoFocusItem={openMenu} id='menu-list-grow'>
              {listItem.map((item) => (
                <div
                  onMouseEnter={() => setHover(item.name)}
                  onMouseLeave={() => setHover('')}
                  onClick={() => {
                    dispatch({
                      type: SET_OPEN_CHILDMENU,
                      payload: true,
                    });
                    if (hover === item.name) {
                      dispatch({
                        type: SET_MENU,
                        payload: hover,
                      });
                    }
                  }}
                  style={hover === item.name ? { color: '#146DA2' } : {}}
                >
                  <MenuItem className={styles.menuItem}>
                    <div>{item.name}</div>
                    <div className={styles.arrowItem}>&#8250;</div>
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

export default Menu;

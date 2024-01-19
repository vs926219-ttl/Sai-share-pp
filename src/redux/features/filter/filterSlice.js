import {
  SET_DATALIST,
  SET_FILTER_INPUT,
  SET_LIST,
  SET_MENU,
  SET_OPEN_CHILDMENU,
  SET_OPEN_MENU,
  SET_STAGES,
  SET_STATUS,
} from './actionTypes';

export const initialState = {
  filter: null,
  dataList: [],
  menu: '',
  openMenu: false,
  openChildMenu: null,
  stages: null,
  status: null,
  list: [],
};

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTER_INPUT:
      return { ...state, filter: action.payload };
    case SET_DATALIST:
      return { ...state, dataList: action.payload };
    case SET_MENU:
      return { ...state, menu: action.payload };
    case SET_OPEN_MENU:
      return { ...state, openMenu: action.payload };
    case SET_OPEN_CHILDMENU:
      return { ...state, openChildMenu: action.payload };
    case SET_STAGES:
      return { ...state, stages: action.payload };
    case SET_STATUS:
      return { ...state, status: action.payload };
    case SET_LIST:
      return { ...state, list: action.payload };
    default:
      return state;
  }
}

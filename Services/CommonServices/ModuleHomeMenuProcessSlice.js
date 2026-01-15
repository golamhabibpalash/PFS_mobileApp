import {createSlice} from '@reduxjs/toolkit';

//Initial state for Menu
const menuInitialState = {
  isLoading: false,
  isError: false,
  error: null,
  menuTitle: 'Default Module Name',
  pfs: '',
  menus: [],
};

//Initial state for Sub Menu
const initialState = {
  isLoading: false,
  isError: false,
  error: null,
  subMenus: [],
};

//If need then apply Asynch Thunk

// Function to filter submenus based on URL/appURL
const getSubmenusByAppUrl = (dynamicMenu, url) => {
  const filteredMenu = dynamicMenu.filter(item => item.RootUrl === url);
  const childNodes = filteredMenu.flatMap(item => item.ChildNodes);
  return childNodes;
};

//Reducers or Slices
const moduleSubMenuDataSlice = createSlice({
  name: 'subMenus',
  initialState: initialState,
  reducers: {
    loadSubMenus: (state, action) => {
      const {dynamicMenu, url} = action.payload;
      state.subMenus = getSubmenusByAppUrl(dynamicMenu, url);
    },
    resetSubMenus: state => {
      state.subMenus = [];
    },
  },
});

const moduleMenuDataSlice = createSlice({
  name: 'menus',
  initialState: menuInitialState,
  reducers: {
    loadModuleMenu: (state, action) => {
      const {menuTitle, moduleItems, pfs} = action.payload;
      (state.menuTitle = menuTitle),
        (state.menus = moduleItems),
        (state.pfs = pfs);
    },
  },
});

//Exports Reducers
export const moduleSubMenuReducer = moduleSubMenuDataSlice.reducer;
export const modulebMenuReducer = moduleMenuDataSlice.reducer;

//Exports Actions
export const {loadSubMenus} = moduleSubMenuDataSlice.actions;
export const {resetSubMenus} = moduleSubMenuDataSlice.actions;
export const {loadModuleMenu} = moduleMenuDataSlice.actions;

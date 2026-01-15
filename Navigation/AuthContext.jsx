// AuthContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, IsAuthenticated: true, ...action.payload };
    case 'LOGOUT':
      return { ...state, IsAuthenticated: false, DynamicMenu: [], Roles: [], Permissions: [], UserId:0 };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    IsAuthenticated: false,
    DynamicMenu: [],
    Roles: [],
    Permissions: [],
    UserId:0,
  });
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};

const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within an AuthProvider');
  }
  return context;
};

const useAuth = () => {
  return [useAuthState(), useAuthDispatch()];
};

export { AuthProvider, useAuth, useAuthState, useAuthDispatch };

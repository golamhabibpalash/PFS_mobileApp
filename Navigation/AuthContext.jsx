// AuthContext.jsx
import React, {createContext, useContext, useReducer} from 'react';

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {...state, IsAuthenticated: true, ...action.payload};
    case 'LOGOUT':
      return {
        ...state,
        IsAuthenticated: false,
        DynamicMenu: [],
        Roles: [],
        Permissions: [],
        UserId: 0,
      };
    default:
      return state;
  }
};

// The login payload returns Roles as objects ({RoleName, RoleId}), but the OTP
// and SSO paths are not guaranteed to match, so plain strings are accepted too.
//
// Membership of the Administrators role is the ONLY thing that grants admin
// access. An earlier version also accepted a role literally named "Admin" and
// the AccessAdminPanel permission, both of which regular PFS accounts turn out
// to carry — that is why App Settings was showing up for everyone.
const ADMIN_ROLE_NAMES = ['administrators'];

const normalizeName = (entry, key) => {
  const raw = typeof entry === 'string' ? entry : entry?.[key];
  return String(raw ?? '')
    .trim()
    .toLowerCase();
};

export const hasAdminAccess = authState => {
  const roles = authState?.Roles;
  if (!Array.isArray(roles)) {
    return false;
  }
  return roles.some(role =>
    ADMIN_ROLE_NAMES.includes(normalizeName(role, 'RoleName')),
  );
};

const AuthProvider = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, {
    IsAuthenticated: false,
    DynamicMenu: [],
    Roles: [],
    Permissions: [],
    UserId: 0,
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

export {AuthProvider, useAuth, useAuthState, useAuthDispatch};

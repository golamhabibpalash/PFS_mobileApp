import {hasAdminAccess} from '../Navigation/AuthContext';

// Shape observed in the real `user/ApiLogin` response.
const roleObj = (RoleName, RoleId) => ({RoleName, RoleId: String(RoleId)});
const permObj = (PermissionName, PermissionId) => ({
  PermissionName,
  PermissionId: String(PermissionId),
});

describe('hasAdminAccess', () => {
  it('accepts the Administrators role object from the login payload', () => {
    expect(
      hasAdminAccess({
        Roles: [roleObj('Administrators', 1), roleObj('ParkingUsers', 25)],
        Permissions: [],
      }),
    ).toBe(true);
  });

  it('rejects the AccessAdminPanel permission without the Administrators role', () => {
    // Regular accounts carry this permission, so it must not be a grant on its
    // own — this is what put App Settings in front of every user.
    expect(
      hasAdminAccess({
        Roles: [roleObj('Registered', 18)],
        Permissions: [permObj('AccessAdminPanel', 1)],
      }),
    ).toBe(false);
  });

  it('rejects a non-admin user', () => {
    expect(
      hasAdminAccess({
        Roles: [roleObj('CafeteriaUser', 45), roleObj('Registered', 18)],
        Permissions: [permObj('ManageProducts', 3)],
      }),
    ).toBe(false);
  });

  it('is not fooled by admin-ish role names', () => {
    expect(
      hasAdminAccess({
        Roles: [roleObj('DayCareAdmin', 54), roleObj('GatePassAdmin', 64)],
        Permissions: [],
      }),
    ).toBe(false);
  });

  it('accepts plain string roles for auth paths that return them', () => {
    expect(hasAdminAccess({Roles: ['administrators']})).toBe(true);
    expect(hasAdminAccess({Roles: ['Administrators']})).toBe(true);
  });

  it('rejects a role named merely "Admin"', () => {
    expect(hasAdminAccess({Roles: ['Admin']})).toBe(false);
    expect(hasAdminAccess({Roles: [roleObj('Admin', 2)]})).toBe(false);
  });

  it('tolerates casing and surrounding whitespace', () => {
    expect(hasAdminAccess({Roles: [roleObj('  ADMINISTRATORS  ', 1)]})).toBe(
      true,
    );
  });

  it.each([
    undefined,
    null,
    {},
    {Roles: []},
    {Roles: null},
    {Roles: 'Administrators'},
  ])('returns false for %p instead of throwing', state => {
    expect(hasAdminAccess(state)).toBe(false);
  });

  it('ignores malformed entries', () => {
    expect(
      hasAdminAccess({Roles: [null, undefined, 42, {}, {RoleId: '1'}]}),
    ).toBe(false);
  });
});

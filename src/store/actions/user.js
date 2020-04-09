export function signIn(accountInfo) {
  return {
    ...accountInfo,
    type: 'SIGN_IN',
  };
}

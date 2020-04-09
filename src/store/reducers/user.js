const INITIAL_STATE = {
  token: '',
  uniqid: '',
  first_name: '',
  last_name: '',
  name: '',
  friendship: [],
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        token: action.token,
        uniqid: action.uniqid,
        first_name: action.first_name,
        last_name: action.last_name,
        name: action.name,
        friendship: action.friendship,
      };

    case 'LOGOUT':
      localStorage.removeItem('persist:hephestus-network');
      return {};

    default:
      return state;
  }
}

export const contractReducer = (state = {}, action) => {
  switch (action.type) {
    case "CURRENT_ACCOUNT":
      return {
        ...state,
        eth_account: action.payload,
      };

    case "ADMIN_CONTRACT":
      return {
        ...state,
        admin: action.payload,
      };

    default:
      return state;
  }
};

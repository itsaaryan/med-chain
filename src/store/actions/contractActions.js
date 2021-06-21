export const dispatchAdminContract = (admin) => (dispatch) => {
  dispatch({ type: "ADMIN_CONTRACT", payload: admin });
};

export const dispatchCurrentEthAccount = (account) => (dispatch) => {
  dispatch({ type: "CURRENT_ACCOUNT", payload: account });
};

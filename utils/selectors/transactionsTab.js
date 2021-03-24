export const transactionsTab = {
  tx_status: (status = '') => `p[data-testid='tx-status-${status}']`,
  confirmed_tx_check: "img[data-testid='confirmed-tx-check']",
  not_confirmed_tx_check: "img[data-testid='not-confirmed-tx-check']",
  confirmed_counter: (owners) => `div[data-testid='confirmed-${owners}-out-of-2']`,
  rejected_counter: (owners) => `div[data-testid='rejected-${owners}-out-of-2']`,
  confirm_tx_btn: "button[data-testid='confirm-btn']",
  reject_tx_btn: "button[data-testid='reject-btn']:enabled",
  tx_description_send: "div[data-testid='tx-description-send']",
  transaction_row: (index = 0) => `[data-testid='transaction-row-${index}']`,
  no_tx_in_queue: '[alt=\'No Transactions yet\']',
  tx_nonce: 'div.tx-nonce',
  tx_type: { selector: 'div.tx-type', type: 'css' },
  tx_info: 'div.tx-info',
  tx_votes: 'div.tx-votes',
  tx2_status: 'div.tx-status'
}

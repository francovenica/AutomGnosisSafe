export const homePage = {
  home_btn: '//div/a/img', // done
  metamask_option: { selector: "//span[contains(text(),'MetaMask')]/parent::button", type: 'Xpath' }, // cant be done
  accept_cookies: { selector: "//span[contains(text(),'Accept selection')]", type: 'Xpath' }, // done, cannot be used in local
  loggedin_status: "//p[contains(text(),'metamask [RINKEBY]')]", // done
  safes_counter: "//div[contains(text(),'Safes')]/p", // done
}

export const welcomePage = {
  connect_btn: { selector: "button[data-testid='connect-btn']", type: 'css' },
  create_safe_btn: { selector: "a[data-testid='create-new-safe-btn']", type: 'css' },
  load_safe_btn: { selector: "//p[contains(text(),'Load existing Safe')]", type: 'Xpath' },
  accept_preferences: { selector: "span[data-testid='accept-preferences']", type: 'css' },
}

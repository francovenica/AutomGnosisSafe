export const homePage = {
  home_btn: '//div/a/img', // done
  connect_btn: "//span[contains(text(),'Connect')]/parent::button", // done, separated in connected and not-connected
  metamask_option: { selector: "//span[contains(text(),'MetaMask')]/parent::button", type: 'Xpath' }, // cant be done
  accept_cookies: { selector: "//span[contains(text(),'Accept selection')]", type: 'Xpath' }, // done, cannot be used in local
  loggedin_status: "//p[contains(text(),'metamask [RINKEBY]')]", // done
  safes_counter: "//div[contains(text(),'Safes')]/p", // done
  close_rinkeby_notif: '/html/body/div[1]/div/div[2]/div/div/div/div/div/div[2]/button' // do i need it?
}

export const welcomePage = {
  connect_btn: { selector: "button[data-testid='connect-btn']", type: 'css' },
  create_safe_btn: { selector: "a[data-testid='create-new-safe-btn']", type: 'css' },
  load_safe_btn: { selector: "//p[contains(text(),'Load existing Safe')]", type: 'Xpath' },
  accept_preferences: { selector: "span[data-testid='accept-preferences']", type: 'css' },
}

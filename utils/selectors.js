//$x('//p[contains(text(),"metamask [RINKEBY]")]')[0].textContent
//$x('//p[contains(text(),"metamask [RINKEBY]")]')[0].click()
export const sels = {
    XpSelectors: {
        connect_button: "//span[contains(text(),'Connect')]",
        metamask_option: "//div[contains(text(),'MetaMask')]",
        accept_cookies : "//span[contains(text(),'Accept All')]",
        loggedin_status: "//p[contains(text(),'metamask [RINKEBY]')]",
        safes_counter: "//div[contains(text(),'Safes')]/p",
        load_safe_button : "//div[contains(text(),'Load existing Safe')]",
        load_safe_form_title: "//h2[contains(text(),'Load existing Safe')]",
        load_safe_name_input: "//input[@name='name']",
        load_safe_address_input: "//input[@name='address']",
        valid_safe_name: "//p[contains(text(),'Safe name')]",
        next_button: "//span[contains(text(),'Next')]",
        second_step_description: "//p[contains(text(),'This Safe has')]",
        first_owner_name_input: "//input[@name='owner0Name']",
        required_error_input: "//p[contains(text(),'Required')]",
        load_safe_review_button: "//button/span[contains(text(),'Review')]",
        load_safe_review_details_title: "//p[contains(text(),'Review details')]",
        load_safe_review_safe_name: "//p[contains(text(),'Name of the Safe')]/following-sibling::p",
        load_safe_review_owner_name: "//p[contains(text(),'Safe owners')]/ancestor::div[1]/following-sibling::div[2]//p",
        load_safe_load_button: "//button/span[contains(text(),'Load')]",
    },
    CssSelectors: {
        mm_home: "div.app-header",
        mm_already_imported: "span.error",
        mm_confirm_button : "button.btn-confirm",
        mm_private_key_input : "#private-key-box",
        intercom_close_button: ".intercom-anchor",
        valid_safe_address: "div.MuiInputAdornment-positionEnd",
        safe_name_heading: "h2[data-testid='safe-name-heading']" //title of the safe in the main hub 
    },
    wallet: {
        seed: "range smoke crisp install cross shine hold grief ripple cabin sudden special",
        password: "password"
    },
    privateKeys : {
        "test2": "E0334B3F5CA1C4FBB26B3845F295DF12FE65EA052F31A5F800194958DCBDCB04",
        "test3": "3F23488883EE1A6346641D77ABF6ECDC78B03A0A9233EC6FAD1AB02FFC093CC5",
        "guest1": "471F28E1C41C5FCF89A7BC76072F1A17644AE166F4FEBC31DAE2BAAF0AD8AA06",
    },
    testAccounts: {
        "Safe1" : "0x9913B9180C20C6b0F21B6480c84422F6ebc4B808",
    },
    assertions : {
        wallet_connection : "RINKEBY",
        load_safe_title: "Load existing Safe",
        valid_safe_name_field: 'Safe name', 
        second_step_load_safe: 'This Safe has'
    }, 
    accountNames : {
        safe_name: "Autom Safe",
        owner_name: "Autom Owner"
    }
}
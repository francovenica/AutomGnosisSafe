export const sels = {
    xpSelectors: {
        homepage:{
            home_btn: "//div/a/img", //done
            connect_btn: "//span[contains(text(),'Connect')]/parent::button", //done, separated in connected and not-connected
            metamask_option: "//span[contains(text(),'MetaMask')]/parent::button", //cant be done
            accept_cookies : "//span[contains(text(),'Accept preferences')]", //done, cannot be used in local
            loggedin_status: "//p[contains(text(),'metamask [RINKEBY]')]", //done
            safes_counter: "//div[contains(text(),'Safes')]/p", //done
            load_safe_btn : "//div[contains(text(),'Load existing Safe')]", //done
            create_safe_btn: "//div[contains(text(),'Create new Safe')]", //done
            close_rinkeby_notif: "/html/body/div[1]/div/div[2]/div/div/div/div/div/div[2]/button" //do i need it?
        },  
        load_safe:{
            form_title: "//h2[contains(text(),'Load existing Safe')]", //done, load-safe-form
            name_input: "//input[@name='name']", //done
            address_input: "//input[@name='address']", //done
            valid_safe_name: "//p[contains(text(),'Safe name')]", //can't name errors
            next_btn: "//span[contains(text(),'Next')]", //cant find it
            second_step_description: "//p[contains(text(),'This Safe has')]", //done
            first_owner_name_input: (index = 0) => `//input[@name='owner${index}Name']`, //done, can't do "first name" but all of them
            required_error_input: "//p[contains(text(),'Required')]", //cant name errors
            review_btn: "//button/span[contains(text(),'Review')]/parent::button", //cant find it
            review_details_title: "//p[contains(text(),'Review details')]", //done
            review_safe_name: "//p[contains(text(),'Name of the Safe')]/following-sibling::p", //done
            review_owner_name: "//p[contains(text(),'Safe owners')]/ancestor::div[1]/following-sibling::div[2]//p", //done
            load_btn: "//button/span[contains(text(),'Load')]", //cant find it
        },
        create_safe:{
            start_btn: "//button/span[contains(text(),'Start')]", //done
            required_error_input: "//p[contains(text(),'Required')]", //cant name errors
            first_owner_name_input: "//input[@name='owner0Name']", //done
            first_owner_address_input: "//input[@name='owner0Address']", //done
            second_owner_name_input: "//input[@name='owner1Name']",
            second_owner_address_input: "//input[@name='owner1Address']",
            add_owner: "//p[contains(text(),'Add another owner')]", //done
            current_rows : "//div/div[1]/div[5]/div", //used to get how many owners were input
            req_conf_info_text : "//p[contains(text(),'out of')]",
            review_btn: "//button/span[contains(text(),'Review')]/ancestor::button",
            submit_btn: "//button/span[contains(text(),'Submit')]/ancestor::button",
            continue_btn: "//button/span[contains(text(),'Continue')]/ancestor::button",
        },
        safe_hub:{
            send_btn: "//span[contains(text(),'Send')]/ancestor::button", //this is the first of many buttons. I'm expecting to be clicked first
            send_funds_btn: "//span[contains(text(),'Send funds')]/ancestor::button",
            safe_address: "//div[1]/div[2]/div[2]/p",
            confirm_btn: "//span[contains(text(),'Confirm')]/parent::button",
            latest_tx : "//tbody/tr[1]",
            awaiting_your_confirmation: "//p[contains(text(),'Awaiting your confirmation')]/parent::div",
            awaiting_confirmations: "//p[contains(text(),'Awaiting confirmations')]/parent::div",
            approve_tx_btn : "//span[contains(text(),'Approve Transaction')]/parent::button",
            execute_btn : "//span[contains(text(),'Execute')]/ancestor::button", //button in the Tx expanded
            execute_tx_btn : "//span[contains(text(),'Execute Transaction')]/ancestor::button", //button in the modal for execution
            confirmed_counter : (owners) => `//div[contains(text(),'Confirmed [${owners}/3]')]`,
            rejected_counter : (owners) => `//div[contains(text(),'Rejected [${owners}/3]')]`,
            executor_tag : "//div[contains(text(),'Executor')]",
            executor_hash : "//div[contains(text(),'Executor')]/parent::div//span",
            connected_account_hash: "//div[2]/p[2]",
            balance_ETH : "//p[contains(text(),'Ether')]/ancestor::tr[@data-testid='balance-row']//td[2]/div", 
            reject_btn: "//span[contains(text(),'Reject')]/parent::button",
            reject_tx_btn : "//span[contains(text(),'Reject Transaction')]/parent::button",
            execute_reject_tx_btn : "//span[contains(text(),'Execute Transaction Rejection')]/parent::button",
            assets_tab: "//span[contains(text(),'Assets')]/ancestor::button",
            top_tx_cancelled_label: "//tr[1]//p[contains(text(),'Cancelled')]/parent::div"
        },
        send_funds_modal:{
            modal_title: "//p[contains(text(),'Send Funds')]",
            step_number: (step) => `//p[contains(text(),'${step} of 2')]`,
            safe_name: (name) => `//p[contains(text(), '${name}')]`,
            balance: "//p[contains(text(),'Balance')]",
            balance_number : "//form/div[1]/div[1]/div[2]/div[2]/p/b",
            //token_selec: "//div/div/div/div/li",
            token_selec:"#mui-component-select-token",
            ether_selection: "//div/span[contains(text(),'Ether')]/parent::div", 
            required_error_input: "//div/p[contains(text(), 'Required')]",
            amount_input: "//div[6]/div/div/div/input",
            valid_amount_msg : "//div/p[contains(text(), 'Amount*')]",
            send_max : "//button[contains(text(),'Send max')]",
            //2nd step
            recipient_hash: "//div[4]/div[2]/div/p",
            token_icon: "//div[6]/img",
            token_amount: "//div[6]/p",
            fee_msg : "//div[7]/p",
            submit_btn : "//span[contains(text(),'Submit')]/parent::button",
        },
        modify_policies: {
            settings_tab: "//span[contains(text(),'Settings')]/ancestor::button",
            owner_amount: "//div[5]//div[3]/p", //the number of owners in "settings > owners tab"
            policies_tab: "//div[contains(text(),'Policies')]",
            req_conf: "//div/p[2]/b[1]", // the first number in "X out of Y owners" phrase
            max_req_conf: "//div/p[2]/b[2]", // the second number in "X out of Y owners" phrase
            modify_btn: "//span[contains(text(),'Modify')]/parent::button", //modify button in the policies tab
            modify_form_title: "//div[5]/div[3]/div[1]/p", //"Change required information" title of the modify policies form
            change_btn: "//span[contains(text(),'CHANGE')]/parent::button", //change button in the modifiy policies form
            current_req_conf : "//form//div[2]/div[1]/div/div/div", //the div with the current selection of owners required
            owners_selector: "//div[3]/ul/li", //The full selector, its length should be the same as the amount of owners
            owners_req: (value = 0) => `//ul/li[${value}]`, //individual values of the selector
            owner_limit: "//form//div[2]/p", //this is the full message, getNumberInString has to be used to get the number
        },
        setting_owners: {
            settings_tab: "//span[contains(text(),'Settings')]/ancestor::button",
            owners_tab: "//div[contains(text(),'Owners')]",
            owner_amount: "//div[5]//div[3]/p",
            owner_table: "//table/tbody/tr", //to apply .lengnth and know the amount of owners
            owner_name : (name) => `//td[contains(text(),'${name}')]`,
            owner_table_row: (index = 1) => `//table/tbody/tr[${index}]`, //getting a specific row
            owner_row_options: (address, option = 1) => `//p[contains(text(),'${address}')]/ancestor::td/following-sibling::td//img[${option}]`, //1 = edit, 2 = replace, 3 = delete
            owner_table_row_address: (address) => `//td//p[contains(text(),'${address}')]`, //find owner row by address
            owner_table_row_name: (name) => `//tr[5]/td[contains(text(),'${name}')]`, //find owner row by name
            add_new_owner_btn: "//span[contains(text(),'Add new owner')]/parent::button", 
            //1st step
            add_new_owner_title: "//p[contains(text(),'Add new owner')]", //to assert the form opened
            owner_name_input: "//input[@data-testid='add-owner-name-input']",
            owner_address_input: "//input[@data-testid='add-owner-address-testid']",
            next_btn: "//span[contains(text(),'Next')]/parent::button", //submit button to add new owners
            //2nd step
            req_conf: "//form/div[1]/div[3]/div[1]/div",
            owner_selector: "//div[3]/div[3]/ul/li", //.length should be the amount of owners there will be after the Tx approval
            owner_selector_option : (index = 1) => `//ul/li[contains(text(),'${index}')]`, //specific options
            owner_limit: "//div[3]/div[2]/p", //this is the full message, getNumberInString has to be used to get the number
            review_btn : "//span[contains(text(),'Review')]/parent::button",
            //3rd step
            req_conf_verif: "//div[3]/p[2]", //verifying the new req conf set
            new_owner_section: "//p[contains(text(),'ADDING NEW OWNER')]", //for assertion 
            new_owner_name : (name) => `//p[contains(text(),'${name}')]`, //for assertion of the name
            new_owner_address : (address) => `//p[contains(text(),'${address}')]`, //for assertion of the name
            submit_btn : "//span[contains(text(),'Submit')]/parent::button",
            executor_tag : "//div[contains(text(),'Executor')]", //wait for the executor tag before keep going
            //edit owner name form
            edit_name_input : "//form/div[1]/div[1]/div/div/input",
            save_btn: "//span[contains(text(),'Save')]/parent::button",
            //Delete owner modal
            to_be_deleted_address : (address) => `//div[2]/div[2]/div/div/p[contains(text(),'${address}')]`,
            removing_owner_title : "//p[contains(text(),'REMOVING OWNER')]",
            //review deletion
            pending_status: "//p[contains(text(),'Pending')]/ancestor::tr",
            remove_owner_title: "//b[contains(text(),'Remove owner:')]",
            removed_owner_name: (name) => `//div[contains(text(),'${name}')]`,
            removed_owner_address: (address) => `//span[contains(text(),'${address}')]`,
            changed_req_conf_title: "//b[contains(text(),'Change required confirmations:')]",
            new_changed_req_conf : "//b[contains(text(),'Change required confirmations:')]/following-sibling::p[contains(text(),'3')]",
        },
        replace_owner:{
            replace_owner_title: "//p[contains(text(),'Replace owner')]", //for assertion
            //1st step of Replace owner
            onwer_replaced_address: (address) => `//form//p[contains(text(),'${address}')]`, //address of current owner
            owner_name_input: "//input[@data-testid='replace-owner-name-input']",
            owner_address_input: "//input[@data-testid='replace-owner-address-testid']",
            //2nd step of replace owner
            removing_owner_title : "//p[contains(text(),'REMOVING OWNER')]",
            new_owner_section: "//p[contains(text(),'ADDING NEW OWNER')]", //for assertion
            replaced_owner_address : (address) => `//p[contains(text(),'REMOVING OWNER')]/parent::div/following-sibling::div//p[contains(text(),'${address}')] `,
            owner_for_replacement_name: (name) => `//p[contains(text(),'ADDING NEW OWNER')]/parent::div/following-sibling::div//p[contains(text(),'${name}')]`,
            owner_for_replacement_address: (address) => `//p[contains(text(),'ADDING NEW OWNER')]/parent::div/following-sibling::div//p[contains(text(),'${address}')]`,
            //Tx  validation
            tx_remove_owner_title : "//b[contains(text(),'Remove owner:')]",
            tx_removed_owner_address: (address) => `//b[contains(text(),'Remove owner:')]/parent::div//span[contains(text(),'${address}')]`,
            tx_add_owner_title : "//b[contains(text(),'Add owner:')]",
            tx_add_owner_name : (name) => `//b[contains(text(),'Add owner:')]/parent::div//div[contains(text(),'${name}')]`,
            tx_add_owner_address :(address) => `//b[contains(text(),'Add owner:')]/parent::div//span[contains(text(),'${address}')]`,
        },
    },
    cssSelectors: {
        intercom_close_btn: ".intercom-anchor", //closes the intercom chat
        valid_safe_address: "div.MuiInputAdornment-positionEnd", //the checkmark when you load a safe and put a valid address hash
        safe_name_heading: "h2[data-testid='safe-name-heading']", //The name of the safe in the main hud
        create_safe_name_input : "input[placeholder='Name of the new Safe']", //the input for the safe's name in the safe creation form
        req_conf_dropdown: "div[data-testid='threshold-select-input']", //req confirmation dropdown for the safe creation form
        req_conf_value_2 : "li[data-value='2']", //the 2nd value of the previous dropdown
        review_send_fund_btn_diss: "button[data-testid='review-tx-btn'][disabled]", //send funds review button initially disabled
        review_send_fund_btn: "button[data-testid='review-tx-btn']", //same button as above but enabled
        send_funds_recep: "input[id='free-solo-demo']", //send funds recipient field
        token_field: "div[id=mui-component-select-token] > li" //selector of tokens in send funds
    },
    testIdSelectors: {
        general: { //id's that are on items that are spread through the site
            qr_icon: "img[data-testid='qr-icon']"
        },
        main_hub: {
            safe_name_heading : "h2[data-testid='safe-name-heading']",
            safe_address_heading : "p[data-testid='safe-address-heading']",
            main_send_btn : "button[data-testid='main-send-btn']",
            assets_tab : "button[data-testid='balances-tab-btn']",
            transactions_tab : "button[data-testid='transactions-tab-btn']",
            apps_tab : "button[data-testid='apps-tab-btn']",
            addressbook_tab : "button[data-testid='address-book-tab-btn']",
            settings_tab : "button[data-testid='settings-tab-btn']",
        },
        top_bar: {
            heading_gnosis_logo : "img[data-testid='heading-gnosis-logo']",
            safes_counter: "p[data-testid='safe-counter-heading']",
            connected_network: "p[data-testid='connected-wallet']",
            not_connected_network: "p[data-testid='not-connected-wallet']",
            disconnect_btn: "button[data-testid='disconnect-btn']"
        },
        welcome_page: {
            connect_btn: "button[data-testid='connect-btn']",
            create_safe_btn: "a[data-testid='create-new-safe-btn']", 
            load_safe_btn: "a[data-testid='load-existing-safe-btn']",
            accept_preferences: "span[data-testid='accept-preferences']"
        },
        load_safe_page: {
            form: "form[data-testid='load-safe-form']",
            safe_name_field: "input[data-testid='load-safe-name-field']",
            safe_address_field: "input[data-testid='load-safe-address-field']",
            valid_address: "svg[data-testid='valid-address']",
            step_two: "p[data-testid='load-safe-step-two']",
            owner_row: "div[data-testid='owner-row']", //all the rows, to count
            owner_name: (index = 0) => `input[data-testid='load-safe-owner-name-${index}']`,
            step_trhee: "p[data-testid='load-safe-step-three']",
            review_safe_name: "p[data-testid='load-form-review-safe-name']",
            review_owner_name: "p[data-testid='load-safe-review-owner-name']",
            submit_btn: "button[type='submit']",
        },
        create_safe_page: {
            form: "form[data-testid='create-safe-form']",
            safe_name_field: "input[data-testid='create-safe-name-field']",
            step_two: "p[data-testid='create-safe-step-two']",
            owner_row: "div[data-testid='create-safe-owner-row']",
            owner_name_field: (index = 0) => `input[data-testid='create-safe-owner-name-field-${index}']`,
            address_field: (index = 0) => `input[data-testid='create-safe-address-field-${index}']`,
            valid_address: (index = 0) => `svg[data-testid='valid-address-${index}']`,
            add_owner_btn: "button[data-testid='add-owner-btn']",
            threshold_select_input: "div[data-testid='threshold-select-input']",
            select_input : (index = 1) => `li[data-testid='input-${index}']`,
            req_conf_limit: (validOwners = 1) => `p[data-testid='create-safe-req-conf-${validOwners}']`,
            step_three: "p[data-testid='create-safe-step-three']",
            review_safe_name: "p[data-testid='create-safe-review-name']",
            review_req_conf: (owner_amount = 1) => `p[data-testid='create-safe-review-req-owners-${owner_amount}']`,
            review_owner_name: (index = 0) => `p[data-testid='create-safe-owner-name-${index}']`,
            review_owner_address: (index = 0) => `p[data-testid='create-safe-owner-address-${index}']`,
            safe_creation_proccess_title: "h2['safe-creation-process-title']",
            back_btn: "button[data-testid='safe-creation-back-btn']",
            continue_btn: "button[data-testid='continue-btn']",
            submit_btn: "button[type='submit']",
            etherscan_link: "a[data-testid='safe-create-etherscan-link']",
        }
    },
    wallet: {
        seed: "range smoke crisp install cross shine hold grief ripple cabin sudden special", //it imports the wallet with "acc1" as owner
        password: "password"
    },
    privateKeys : {
        acc2: "E0334B3F5CA1C4FBB26B3845F295DF12FE65EA052F31A5F800194958DCBDCB04",
        acc3: "3F23488883EE1A6346641D77ABF6ECDC78B03A0A9233EC6FAD1AB02FFC093CC5",
        acc4: "471F28E1C41C5FCF89A7BC76072F1A17644AE166F4FEBC31DAE2BAAF0AD8AA06",
    },
    testAccountsHash: {
        safe1 : "0x5BC79B27731589B43c51f745315ca899b4056f33", //safe own by acc1 to acc4.
        safe2 : "0x9913B9180C20C6b0F21B6480c84422F6ebc4B808", //safe own by acc1 to acc4.
        acc1 : "0x61a0c717d18232711bC788F19C9Cd56a43cc8872",
        acc2 : "0x7724b234c9099C205F03b458944942bcEBA13408",
        acc3 : "0x6E45d69a383CECa3d54688e833Bd0e1388747e6B",
        acc4 : "0x730F87dA2A3C6721e2196DFB990759e9bdfc5083",
        acc5 : "0x66bE167c36B3b75D1130BBbDec69f9f04E7DA4fC",
        non_owner_acc : "0xc8b99Dc2414fAA46E195a8f3EC69DD222EF1744F",
    },
    assertions : {
        wallet_connection : "RINKEBY",
        load_safe_title: "Load existing Safe",
        valid_safe_name_field: 'Safe name', 
        second_step_load_safe: 'This Safe has'
    }, 
    safeNames: {
        load_safe_name: "Autom Load Safe",
        create_safe_name : "Autom Create Safe", 
    },
    accountNames : {
        owner_name: "John Carmack",
        owner2_name: "Gabe Newell",
        owner3_name: "Hugo Martin",
        owner4_name: "Hideo Kojima",
    },
    otherAccountNames : { //Other names beyond the purpose of loading or creating safes
        owner5_name: "Shigeru Miyamoto",
        owner6_name: "Koji Igarashi"
    },
    errorMsg: {
        error: (msg) => `//p[contains(text(),"${msg}")]`,
        required: 'Required',
        greater_than_0 : 'Should be greater than 0',
        valid_ENS_name: 'Address should be a valid Ethereum address or ENS name',
        duplicated_address: 'Address already introduced',
        not_a_number: 'Must be a number',
        max_amount_tokens: (value = 0) => `Maximum value is ${value}`,
        modify_policy: (value = 0) => `Value should be different than ${value}`,
    },
}
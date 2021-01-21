import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { load_wallet } from "../utils/testSetup"

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await load_wallet(true)
}, 60000)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Adding and removing owners", () =>{
    const setting_owners = sels.xpSelectors.setting_owners
    const replace_owner = sels.xpSelectors.replace_owner
    const errorMsg = sels.errorMsg
    const safe_hub = sels.xpSelectors.safe_hub
    
    let owner_replaced_address
    let owner_for_replacement_address
    let owner_for_replacement_name    

    test("Enter in settings. Checking which owner replace", async (done) => {
        console.log("Enter in settings. Checking which owner replace")
        let flag = true
        try {
            await gFunc.clickSomething(setting_owners.settings_tab, gnosisPage)
            await gFunc.clickSomething(setting_owners.owners_tab, gnosisPage)
            try {
                //I check which user replace, I check if owner 3 is present
                await gnosisPage.waitForXPath('//p[contains(text(),"0x6E45d69a383CECa3d54688e833Bd0e1388747e6B")]', {timeout:2000})
            } catch (e) {
                flag = false
            }
            if (flag){
                //if acc3 is pressent, that will be replaced, if not then acc5 will be replaced
                owner_replaced_address = sels.testAccountsHash.acc3
                owner_for_replacement_address = sels.testAccountsHash.acc5
            } 
            else{
                owner_replaced_address = sels.testAccountsHash.acc5
                owner_for_replacement_address = sels.testAccountsHash.acc3
            }    
            owner_for_replacement_name = "Cory Barlog"
            console.log("Owner_replaced_address = ", owner_replaced_address, "\nOwner_for_replacement_address = ", owner_for_replacement_address)
            done()
        } catch (error) {
            done(error)
        }
    }, 60000)
    test("Open Replace Owner form", async (done)=>{
        const existing_owner_address = owner_replaced_address
        console.log("Open Replace Owner form")
        try {
            await gnosisPage.waitFor(2000)
            await gFunc.assertElementPresent(setting_owners.owner_row_options(owner_replaced_address, 2), gnosisPage)
            await gFunc.clickSomething(setting_owners.owner_row_options(owner_replaced_address, 2), gnosisPage)
            await gFunc.assertElementPresent(replace_owner.onwer_replaced_address(owner_replaced_address),gnosisPage)
            await gFunc.clickSomething(setting_owners.next_btn, gnosisPage)
            await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) //asserts error "required" in name
            await gFunc.clickAndType(replace_owner.owner_name_input, gnosisPage , owner_for_replacement_name)
            await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) //asserts error "required" in address
            await gFunc.clickAndType(replace_owner.owner_address_input, gnosisPage, "0xInvalidHash")
            await gFunc.assertElementPresent(errorMsg.error(errorMsg.valid_ENS_name), gnosisPage) //assert invalid address error
            await gFunc.clearInput(replace_owner.owner_address_input, gnosisPage)
            await gFunc.clickAndType(replace_owner.owner_address_input, gnosisPage, existing_owner_address) 
            await gFunc.assertElementPresent(errorMsg.error(errorMsg.duplicated_address), gnosisPage) //assert duplicated address error
            await gFunc.clearInput(replace_owner.owner_address_input, gnosisPage)
            await gFunc.clickAndType(replace_owner.owner_address_input, gnosisPage, owner_for_replacement_address)
            await gFunc.clickSomething(setting_owners.next_btn, gnosisPage)
            done()
        } catch (error) {
            done(error)
        }
    }, 60000)
    test("Step 2 - Verify owner replacementen and submit", async (done)=>{
        console.log("Step 2 - Verify owner replacementen and submit")
        try {
            await gFunc.assertAllElementPresent([
                replace_owner.removing_owner_title,
                replace_owner.new_owner_section,
                replace_owner.replaced_owner_address(owner_replaced_address),
                replace_owner.owner_for_replacement_name(owner_for_replacement_name),
                replace_owner.owner_for_replacement_address(owner_for_replacement_address),
            ], gnosisPage)
            await gFunc.clickSomething(setting_owners.submit_btn, gnosisPage)
            await gnosisPage.waitFor(2000)
            await metamask.sign()
            done()
        } catch (error) {
            done(error)
        }
    }, 60000)
    test("Sign with owner 2", async (done)=>{
        console.log("Sign with owner 2")
        try {
            await MMpage.waitFor(5000)
            await gnosisPage.bringToFront()
            await gFunc.clickSomething(safe_hub.awaiting_confirmations, gnosisPage)
            await gFunc.assertElementPresent(safe_hub.confirmed_counter(1), gnosisPage)
            await metamask.switchAccount(1) //currently in account4, changing to account 1
            await gnosisPage.waitFor(2000)
            await gnosisPage.bringToFront()
            await gFunc.clickSomething(safe_hub.confirm_btn, gnosisPage)
            await gFunc.clickSomething(safe_hub.approve_tx_btn, gnosisPage)
            await gnosisPage.waitFor(2000)
            await metamask.sign()
            done()
        } catch (error) {
            done(error)
        }
    }, 60000)
    test("Signing and executing with owner 3", async (done)=>{
        console.log("Signing and executing with owner 3")
        try {
            await MMpage.waitFor(5000)
            await gnosisPage.bringToFront()
            await gFunc.assertElementPresent(safe_hub.confirmed_counter(2), gnosisPage)
            await metamask.switchAccount(2)
            await gnosisPage.bringToFront()
            await gnosisPage.waitFor(5000)
            await gFunc.clickSomething(safe_hub.confirm_btn, gnosisPage)
            await gFunc.clickSomething(safe_hub.approve_tx_btn, gnosisPage)
            await gnosisPage.waitFor(2000)
            await metamask.confirmTransaction()
            done()
        } catch (error) {
            done(error)
        }
    }, 60000)
    test("Verify the Owner Replacement", async (done)=>{
        console.log("Verify the Owner Replacement")
        try {
            await MMpage.waitFor(2000)
            await gnosisPage.bringToFront()
            await gnosisPage.waitForXPath("//div[contains(text(),'Executor')]")
            await gFunc.assertAllElementPresent([
                replace_owner.tx_remove_owner_title,
                replace_owner.tx_removed_owner_address(owner_replaced_address),
                replace_owner.tx_add_owner_title,
                //replace_owner.tx_add_owner_name(owner_for_replacement_name), // This is broken in the application. Issue #649
                replace_owner.tx_add_owner_address(owner_for_replacement_address),
            ],gnosisPage)
            await gFunc.clickSomething(setting_owners.settings_tab, gnosisPage)
            await gFunc.clickSomething(setting_owners.owners_tab, gnosisPage)
            await gFunc.assertElementPresent(setting_owners.owner_table_row_address(owner_for_replacement_address), gnosisPage)
            done()
        } catch (error) {
            done(error)
        }
    }, 150000)
})

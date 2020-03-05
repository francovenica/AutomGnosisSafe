const { TIME } = require('../utils/config').default
import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { load_wallet } from "../utils/testSetup"

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await load_wallet(true)
}, TIME.T60)

// afterAll(async () => {
//     await gnosisPage.waitFor(2000)
//     await browser.close();
// })

describe("Adding and removing owners", () =>{
    const modify_policies = sels.xpSelectors.modify_policies
    const safe_hub = sels.xpSelectors.safe_hub
    const setting_owners = sels.xpSelectors.setting_owners
    const errorMsg = sels.errorMsg
    let owners_current_amount
    let current_req_conf
    let max_req_conf
    test("Checking owner amount and current policies", async (done) =>{
        console.log("Checking owner amount current policies")
        try {
            await gFunc.clickSomething(setting_owners.settings_tab, gnosisPage)
            await gFunc.clickSomething(modify_policies.policies_tab, gnosisPage)
            current_req_conf = await gFunc.getNumberInString(modify_policies.req_conf, gnosisPage)
            await gFunc.clickSomething(setting_owners.owners_tab, gnosisPage)
            owners_current_amount = await gFunc.getNumberInString(setting_owners.owner_amount, gnosisPage)
            const owner_rows_amount = await gFunc.amountOfElements(setting_owners.owner_table, gnosisPage)
            expect(owners_current_amount).toBe(owner_rows_amount)
            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
    test("First step of the form: name and address", async (done) =>{
        console.log("First step of the form: name and address")
        const existing_owner_hash = sels.testAccountsHash.acc1
        try {
            await gFunc.clickSomething(setting_owners.add_new_owner_btn, gnosisPage)
            await gFunc.assertElementPresent(setting_owners.add_new_owner_title, gnosisPage)
            await gFunc.clickSomething(setting_owners.next_btn, gnosisPage)
            await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) //asserts error "required" in name
            await gFunc.clickAndType(setting_owners.owner_name_input, gnosisPage, sels.otherAccountNames.owner5_name)
            await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) //asserts error "required" in address
            await gFunc.clickAndType(setting_owners.owner_address_input, gnosisPage, "0xInvalidHash")
            await gFunc.assertElementPresent(errorMsg.error(errorMsg.valid_ENS_name), gnosisPage)
            await gFunc.clearInput(setting_owners.owner_address_input, gnosisPage)
            await gFunc.clickAndType(setting_owners.owner_address_input, gnosisPage, existing_owner_hash)
            await gFunc.assertElementPresent(errorMsg.error(errorMsg.duplicated_address), gnosisPage)
            await gFunc.clearInput(setting_owners.owner_address_input, gnosisPage)
            await gFunc.clickAndType(setting_owners.owner_address_input, gnosisPage, sels.testAccountsHash.acc5)
            await gFunc.clickSomething(setting_owners.next_btn, gnosisPage)
            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
    test("Second step of the form: Req Confirmations", async (done) =>{
        console.log("Second step of the form: Req Confirmations")
        try {
            let req_conf = await gFunc.getNumberInString(setting_owners.req_conf,gnosisPage)
            await expect(req_conf).toBe(current_req_conf) //the number in the form is the same as the one in the policies tab

            await gFunc.clickSomething(setting_owners.req_conf, gnosisPage)
            let max_req_conf = await gFunc.getNumberInString(setting_owners.owner_limit,gnosisPage)
            let owner_selector = await gFunc.amountOfElements(setting_owners.owners_selector, gnosisPage)//to calculate the length, no [0] for this
            await expect(owner_selector).toBe(max_req_conf) //the amount of options should be X in "out of X owners"

            await gFunc.clickSomething(setting_owners.owner_selector_option(1), gnosisPage)
            await gnosisPage.waitFor(TIME.T2) // always after clicking in one of these selector you have to wait before clicking submit
            await gFunc.clickSomething(setting_owners.review_btn, gnosisPage)
            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
    test("Third step: Verification", async (done) =>{
        console.log("Third step: Verification")
        try {

            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
    test("Submiting and signing tx with owner 1", async (done) =>{
        console.log("Submiting and signing tx with owner 1")
        try {

            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
    test("Signing with owner 2", async (done) =>{
        console.log("Signing with owner 2")
        try {

            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
    test("Signing and executing with owner 3", async (done) =>{
        console.log("Signing and executing with owner 3")
        try {

            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
    test("Verifying new owner", async (done) =>{
        console.log("Verifying new owner")
        try {

            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
    test("Deleting recently added owner", async (done) =>{
        console.log("Deleting recently added owner")
        try {

            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
    test("Verifying owner deletion", async (done) =>{
        console.log("Verifying owner deletion")
        try {

            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
})
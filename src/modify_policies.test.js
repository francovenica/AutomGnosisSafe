const { TIME } = require('../utils/config').default
import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { load_wallet } from "../utils/testSetup"
import { connect } from "puppeteer";

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await load_wallet(true)
}, TIME.T60)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Change Policies", ()=>{
    const modify_policies = sels.xpSelectors.modify_policies
    const safe_hub = sels.xpSelectors.safe_hub
    let owner_amount = false //amount of owners, will be taken from the owners tab in the settings
    let req_conf = false //current required confirmations. taken from the message in the policies tab
    let max_req_conf = false //max required confirmations. taken from the message in the policies tab
    test("Open Modify form", async (done) => {
        console.log("Open Modify form")
    try {
        await gFunc.clickSomething(modify_policies.settings_tab, gnosisPage)
        await gFunc.clickSomething(modify_policies.policies_tab, gnosisPage)
        owner_amount = await gFunc.getNumberInString(modify_policies.owner_amount, gnosisPage) //get the amount of owners the safe has
        req_conf = await gFunc.getNumberInString(modify_policies.req_conf, gnosisPage)//current required confirmation
        max_req_conf = await gFunc.getNumberInString(modify_policies.max_req_conf, gnosisPage) //max amount of required confirmations posible, it should be the same as owners amount
        await expect(owner_amount).toBe(max_req_conf)
        done()
    } catch (error) {
        done(error)
    }
    }, TIME.T60)
    test("Verifying modification options", async (done) => {
        console.log("Verifying modification options")
        const errorMsg = sels.errorMsg
        try {
            await gFunc.clickSomething(modify_policies.modify_btn, gnosisPage)

            console.log("Checking error")
            await gFunc.clickSomething(modify_policies.change_btn, gnosisPage) //click on Change button and verify the error message
            await gFunc.assertElementPresent(errorMsg.error(errorMsg.modify_policy(req_conf)), gnosisPage)

            console.log("number in the form is the same as req conf")
            let current_req_conf = await gFunc.getNumberInString(modify_policies.current_req_conf,gnosisPage)
            await expect(current_req_conf).toBe(req_conf) //the number in the form is the same as the one in the policies tab

            console.log("checking amout of options with the max value possible")
            await gFunc.clickSomething(modify_policies.current_req_conf, gnosisPage)
            let owner_limit = await gFunc.getNumberInString(modify_policies.owner_limit, gnosisPage)
            let owner_selector = await gnosisPage.$x(modify_policies.owners_selector)//to calculate the length, no [0] for this
            await gnosisPage.waitFor(3000)
            await expect(owner_limit).toBe(owner_selector.length) //the amount of options should be equal to the limit of owners

            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
    test("Creating and approving Tx with owner 1", async (done) => {
        console.log("Creating and approving Tx with owner 1")
        try {
            await gFunc.clickSomething(modify_policies.current_req_conf, gnosisPage)
            await gFunc.clickSomething(modify_policies.owners_req(1), gnosisPage)
            await gnosisPage.waitFor(2000)
            await gFunc.clickSomething(modify_policies.change_btn, gnosisPage)
            await gnosisPage.waitFor(3000)
            await metamask.confirmTransaction()
            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T90)
    test("Signing with owner 2", async (done) => {
        console.log("Signing with owner 2")
        try {
            await MMpage.waitFor(TIME.T5)
            await gnosisPage.bringToFront()
            await gFunc.clickSomething(safe_hub.awaiting_confirmations, gnosisPage)
            await gFunc.assertElementPresent(safe_hub.confirmed_counter(1), gnosisPage)
            await metamask.switchAccount(1) //currently in account4, changing to account 1
            await gnosisPage.waitFor(TIME.T2)
            await gnosisPage.bringToFront()
            await gFunc.clickSomething(safe_hub.confirm_btn, gnosisPage)
            await gFunc.clickSomething(safe_hub.approve_tx_btn, gnosisPage)
            await gnosisPage.waitFor(TIME.T2)
            await metamask.confirmTransaction()
            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T90)
    test("Signing and executing with owner 3", async (done) => {
        console.log("Signing and executing with owner 3")
        try {
            await MMpage.waitFor(TIME.T5)
            await gnosisPage.bringToFront()
            await gFunc.assertElementPresent(safe_hub.confirmed_counter(2), gnosisPage)
            await metamask.switchAccount(2)
            await gnosisPage.bringToFront()
            await gnosisPage.waitFor(TIME.T5)
            await gFunc.clickSomething(safe_hub.confirm_btn, gnosisPage)
            await gFunc.clickSomething(safe_hub.approve_tx_btn, gnosisPage)
            await gnosisPage.waitFor(TIME.T2)
            await metamask.confirmTransaction()
            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T90)
    test("Verifying the change in the settings", async (done) => {
        console.log("Verifying the change in the settings")
        try {
            await MMpage.waitFor(TIME.T5)
            await gnosisPage.bringToFront()
            await gFunc.assertElementPresent(safe_hub.confirmed_counter(3), gnosisPage)
            await gFunc.clickSomething(modify_policies.settings_tab, gnosisPage)
            await gFunc.clickSomething(modify_policies.policies_tab, gnosisPage)
            req_conf = await gFunc.getNumberInString(modify_policies.req_conf, gnosisPage)//current required confirmation
            expect(req_conf).toBe(1) //the new value for required conf shoudl be 1
            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T90)
    test("Create Tx to revert it back to initial state", async (done) => {
        console.log("Create Tx to revert it back to initial state")
        try {
            await gFunc.clickSomething(modify_policies.modify_btn, gnosisPage)
            await gFunc.clickSomething(modify_policies.current_req_conf, gnosisPage)
            await gFunc.clickSomething(modify_policies.owners_req(3), gnosisPage)
            await gnosisPage.waitFor(2000)
            await gFunc.clickSomething(modify_policies.change_btn, gnosisPage)
            await gnosisPage.waitFor(3000)
            await metamask.confirmTransaction()
            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T60)
    test("Verifying the rollback", async (done) => {
        console.log("Verifying the rollback")
        try {
            await MMpage.waitFor(TIME.T5)
            await gnosisPage.bringToFront()
            await gFunc.clickSomething(modify_policies.settings_tab, gnosisPage)
            await gFunc.clickSomething(modify_policies.policies_tab, gnosisPage)
            await gnosisPage.waitForXPath("//div/p[2]/b[1][contains(text(),'3')]", {timeout: TIME.T90})
            await gFunc.assertTextPresent(modify_policies.req_conf, gnosisPage, "3")
            done()
        } catch (error) {
            done(error)
        }
    }, TIME.T90)
})
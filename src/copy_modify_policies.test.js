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

describe.skip("Change Policies", ()=>{
    
    const modify_policies = sels.testIdSelectors.settings_tabs
    const errorMsg = sels.errorMsg
    const mainHub = sels.testIdSelectors.main_hub
    const sendFunds = sels.testIdSelectors.send_funds_form
    const txTab = sels.testIdSelectors.transaction_tab
    const assetTab = sels.testIdSelectors.asset_tab
    const send_funds_modal = sels.xpSelectors.send_funds_modal
    // const modify_policies = sels.xpSelectors.modify_policies
    // const safe_hub = sels.xpSelectors.safe_hub
    // let owner_amount = false //amount of owners, will be taken from the owners tab in the settings
    // let req_conf = false //current required confirmations. taken from the message in the policies tab
    // let max_req_conf = false //max required confirmations. taken from the message in the policies tab
    test("Open Modify form", async (done) => {
        console.log("Open Modify form")
    try {
        await gnosisPage.waitFor(2000)
        await gnosisPage.waitForFunction(
            'document.querySelector("body").innerText.includes("SETTINGS")'
        );
        await gFunc.clickByText("span", "SETTINGS", gnosisPage)
        await gnosisPage.waitForFunction(
            'document.querySelector("body").innerText.includes("Safe Version")'
        );
        await gFunc.clickByText("p", "Policies", gnosisPage)
        await gnosisPage.waitForFunction(
            'document.querySelector("body").innerText.includes("Required confirmations")'
        );
        await gnosisPage.waitForFunction(
            'document.querySelector("body").innerText.includes("2 out of 4 owners")'
        );
        await gFunc.clickByText("span", "Modify", gnosisPage)
        await gnosisPage.waitForFunction(
            'document.querySelector("body").innerText.includes("Change required confirmations")'
        );
        // await gFunc.clickSomething(modify_policies.settings_tab, gnosisPage)
        // await gFunc.clickSomething(modify_policies.policies_tab, gnosisPage)
        // owner_amount = await gFunc.getNumberInString(modify_policies.owner_amount, gnosisPage) //get the amount of owners the safe has
        // req_conf = await gFunc.getNumberInString(modify_policies.req_conf, gnosisPage)//current required confirmation
        // max_req_conf = await gFunc.getNumberInString(modify_policies.max_req_conf, gnosisPage) //max amount of required confirmations posible, it should be the same as owners amount
        // await expect(owner_amount).toBe(max_req_conf)
        done()
    } catch (error) {
        done(error)
    }
    }, 60000)
    test("Verifying modification options", async (done) => {
        console.log("Verifying modification options")
        const errorMsg = sels.errorMsg
        try {
            await gFunc.openDropdown(modify_policies.req_conf_dropdown, gnosisPage, "css")
            await gFunc.clickElement('[data-value="1"]', gnosisPage)
            await gFunc.clickByText("span", "Change", gnosisPage)
            await gnosisPage.waitFor(2000)
            await metamask.sign()
            done()
        } catch (error) {
            done(error)
        }
    }, 60000)
    test("Creating and approving Tx with owner 1", async (done) => {
        console.log("Creating and approving Tx with owner 1")
        try {
            await MMpage.waitFor(2000)
            await gnosisPage.bringToFront()
            //checking amount of "Success and awaiting conf status for final review"
            await gFunc.assertElementPresent(txTab.tx_status("Awaiting confirmations"), gnosisPage, "css")     
            const amount_await_conf_status = await gFunc.amountOfElements(txTab.tx_status("Awaiting confirmations"), gnosisPage, "css")
            expect(amount_await_conf_status).toBe(1) //it should be only 1 awaiting confirmations tx at this point
            //Notifications are blocking the click ot the tx, I had to click it in another way now
            await gnosisPage.evaluate(() => {
                const firstTx = document.querySelectorAll('[data-testid="transaction-row"]')[0]
                firstTx && firstTx.click()
              })
            await gFunc.assertElementPresent(txTab.confirmed_counter(1), gnosisPage, "css")
            await gFunc.assertElementPresent(txTab.not_confirmed_tx_check, gnosisPage, "css")
            await metamask.switchAccount(1) //currently in account2, changing to account 1
            await gnosisPage.bringToFront()
            await gFunc.assertElementPresent(txTab.tx_status("Awaiting your confirmation"), gnosisPage, "css")
            await gFunc.clickElement(txTab.confirm_tx_btn, gnosisPage)
            await gFunc.assertElementPresent(mainHub.execute_checkbox, gnosisPage, "css")
            await gFunc.clickElement(mainHub.approve_tx_btn, gnosisPage)
            await gnosisPage.waitFor(2000)
            await metamask.confirmTransaction()
            done()
        } catch (error) {
            done(error)
        }
    }, 90000)
    // test("Signing with owner 2", async (done) => {
    //     console.log("Signing with owner 2")
    //     try {
    //         await MMpage.waitFor(5000)
    //         await gnosisPage.bringToFront()
    //         await gFunc.clickSomething(safe_hub.awaiting_confirmations, gnosisPage)
    //         await gFunc.assertElementPresent(safe_hub.confirmed_counter(1), gnosisPage)
    //         await metamask.switchAccount(1) //currently in account4, changing to account 1
    //         await gnosisPage.waitFor(2000)
    //         await gnosisPage.bringToFront()
    //         await gFunc.clickSomething(safe_hub.confirm_btn, gnosisPage)
    //         await gFunc.clickSomething(safe_hub.approve_tx_btn, gnosisPage)
    //         await gnosisPage.waitFor(2000)
    //         await metamask.sign()
    //         done()
    //     } catch (error) {
    //         done(error)
    //     }
    // }, 90000)
    // test("Signing and executing with owner 3", async (done) => {
    //     console.log("Signing and executing with owner 3")
    //     try {
    //         await MMpage.waitFor(5000)
    //         await gnosisPage.bringToFront()
    //         await gFunc.assertElementPresent(safe_hub.confirmed_counter(2), gnosisPage)
    //         await metamask.switchAccount(2)
    //         await gnosisPage.bringToFront()
    //         await gnosisPage.waitFor(5000)
    //         await gFunc.clickSomething(safe_hub.confirm_btn, gnosisPage)
    //         await gFunc.clickSomething(safe_hub.approve_tx_btn, gnosisPage)
    //         await gnosisPage.waitFor(2000)
    //         await metamask.confirmTransaction()
    //         done()
    //     } catch (error) {
    //         done(error)
    //     }
    // }, 90000)
    // test("Verifying the change in the settings", async (done) => {
    //     console.log("Verifying the change in the settings")
    //     try {
    //         await MMpage.waitFor(5000)
    //         await gnosisPage.bringToFront()
    //         await gFunc.assertElementPresent(safe_hub.confirmed_counter(3), gnosisPage)
    //         await gFunc.clickSomething(modify_policies.settings_tab, gnosisPage)
    //         await gFunc.clickSomething(modify_policies.policies_tab, gnosisPage)
    //         req_conf = await gFunc.getNumberInString(modify_policies.req_conf, gnosisPage)//current required confirmation
    //         expect(req_conf).toBe(1) //the new value for required conf shoudl be 1
    //         done()
    //     } catch (error) {
    //         done(error)
    //     }
    // }, 90000)
    // test("Create Tx to revert it back to initial state", async (done) => {
    //     console.log("Create Tx to revert it back to initial state")
    //     try {
    //         await gFunc.clickSomething(modify_policies.modify_btn, gnosisPage)
    //         await gFunc.clickSomething(modify_policies.current_req_conf, gnosisPage)
    //         await gFunc.clickSomething(modify_policies.owners_req(3), gnosisPage)
    //         await gnosisPage.waitFor(2000)
    //         await gFunc.clickSomething(modify_policies.change_btn, gnosisPage)
    //         await gnosisPage.waitFor(3000)
    //         await metamask.confirmTransaction()
    //         done()
    //     } catch (error) {
    //         done(error)
    //     }
    // }, 60000)
    // test("Verifying the rollback", async (done) => {
    //     console.log("Verifying the rollback")
    //     try {
    //         await MMpage.waitFor(5000)
    //         await gnosisPage.bringToFront()
    //         await gFunc.clickSomething(modify_policies.settings_tab, gnosisPage)
    //         await gFunc.clickSomething(modify_policies.policies_tab, gnosisPage)
    //         await gnosisPage.waitForXPath("//div/p[2]/b[1][contains(text(),'3')]", {timeout: 90000})
    //         await gFunc.assertTextPresent(modify_policies.req_conf, gnosisPage, "3")
    //         done()
    //     } catch (error) {
    //         done(error)
    //     }
    // }, 90000)
})
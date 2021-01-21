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

describe.skip("Reject Tx flow", ()=>{
    let currentBalance = 0.0
    
    const errorMsg = sels.errorMsg
    const mainHub = sels.testIdSelectors.main_hub
    const sendFunds = sels.testIdSelectors.send_funds_form
    const txTab = sels.testIdSelectors.transaction_tab
    const assetTab = sels.testIdSelectors.asset_tab
    const send_funds_modal = sels.xpSelectors.send_funds_modal
    const homepage = sels.xpSelectors.homepage
    const labels = sels.statusToLabel
    test("Open the Send Funds Form", async (done) => {
        try {
            console.log("Open the Send Funds Form")
            await gFunc.assertElementPresent(assetTab.balance_value("eth"), gnosisPage, "css")
            currentBalance = await gFunc.getNumberInString(assetTab.balance_value("eth"), gnosisPage, "css")
            await gFunc.clickByText("button", "New Transaction", gnosisPage)
            await gFunc.clickElement(mainHub.modal_send_funds_btn, gnosisPage)
            await gFunc.assertElementPresent(sendFunds.review_btn_disabled, gnosisPage, "css")
            done()
        } catch (error) {
            console.log(error)
            done(error)
        }
    }, 60000)
    test("Filling the Form", async (done) => {
        try {
            console.log("Filling the Form")
            await gFunc.clickAndType(sendFunds.recipient_input, gnosisPage, sels.testAccountsHash.non_owner_acc, "css")
            await gFunc.openDropdown(sendFunds.select_token, gnosisPage, "css")
            await gFunc.clickElement(sendFunds.select_token_ether, gnosisPage)
            await gFunc.clickAndType(sendFunds.amount_input, gnosisPage, "0.5", "css")
            await gFunc.assertElementPresent(send_funds_modal.valid_amount_msg, gnosisPage)  
            await gnosisPage.waitFor(2000)
            await gFunc.clickElement(sendFunds.review_btn, gnosisPage)
            done()
        } catch (error) {
            console.log(error)
            done(error)
        }
    }, 15000)
    test("Approving the Tx with the owner 1", async (done) => {
        try {
            console.log("Approving the Tx with the owner 1")
            await gFunc.assertElementPresent(sendFunds.submit_btn, gnosisPage, "css")
            await gFunc.clickElement(sendFunds.submit_btn, gnosisPage)
            await gnosisPage.waitFor(3000)
            await metamask.sign()
            done()
        } catch (error) {
            console.log(error)
            done(error)
        }
    }, 90000)
    test("Rejecting with the 1st  owner", async (done) => {
        try {
            console.log("Rejecting with the 1st  owner")
            //await MMpage.waitFor(5000)
            await gnosisPage.bringToFront()
            await gFunc.assertElementPresent(txTab.tx_status(labels.awaiting_confirmations), gnosisPage, "css")
            await gnosisPage.evaluate(() => {
                const firstTx = document.querySelectorAll('[data-testid="transaction-row"]')[0]
                firstTx && firstTx.click()
              })
            //Can't click an element by the label because notifications block the click
            //await gFunc.clickElement(txTab.tx_status(labels.awaiting_confirmations), gnosisPage)
            await gFunc.assertElementPresent(txTab.confirmed_counter(1), gnosisPage, "css")
            await gFunc.assertElementPresent(txTab.reject_tx_btn, gnosisPage, "css")
            await gFunc.clickElement(txTab.reject_tx_btn, gnosisPage)
            await gnosisPage.waitForFunction(
                'document.querySelector("body").innerText.includes("Reject Transaction")'
                //making sure that a "Reject transaction" text exist in the page first
            );
            await gnosisPage.$$eval('button', allElements => {
                allElements.forEach( element => { if(element.innerText === "Reject Transaction") element.click()})
                //finding and clicking on the first button with the Reject Transaction text
            })
            await gnosisPage.waitFor(2000)
            await metamask.sign()
            done()
        } catch (error) {
            console.log(error)
            done(error)
        }
    }, 90000)
    test("Rejecting the Tx with the owner 2", async (done) => {
        console.log("Rejecting the Tx with the owner 2")
        try {
            await gnosisPage.bringToFront()
            await gFunc.assertElementPresent(txTab.rejected_counter(1), gnosisPage, "css")
            await metamask.switchAccount(1) //changing to account 1
            await gnosisPage.waitFor(2000)
            await gnosisPage.bringToFront()
            await gFunc.assertElementPresent(txTab.reject_tx_btn, gnosisPage, "css")
            await gnosisPage.waitFor(2000)
            await gFunc.clickElement(txTab.reject_tx_btn, gnosisPage)
            await gnosisPage.waitForFunction(
                'document.querySelector("body").innerText.includes("Execute Transaction Rejection")'
            );
            await gnosisPage.$$eval('button', allElements => {
                allElements.forEach( element => { if(element.innerText === "Execute Transaction Rejection") element.click()})
            })
            await gnosisPage.waitFor(2000)
            await metamask.confirmTransaction()
            done()
        } catch (error) {
            console.log(error)
            done(error)
        }
    }, 90000)
    test("Verifying Execution of the Tx", async (done) => {
        console.log("Verifying Execution of the Tx")
        try {
            await gnosisPage.bringToFront()
            await gFunc.assertElementPresent(txTab.rejected_counter(2), gnosisPage, "css")
            await gnosisPage.waitForFunction(
                'document.querySelector("table[class^=MuiTable-root]").innerText.includes("Executor")'
            );
            await gFunc.clickByText("span", "ASSETS", gnosisPage)
            await gnosisPage.waitFor(3000) //Numbers flicker for a bit when you enter in this tab
            const post_test_balance = await gFunc.getNumberInString(assetTab.balance_value("eth"), gnosisPage, "css")
            expect(post_test_balance).toBe(currentBalance) //balance should not have changed
            done()
        } catch (error) {
            console.log(error)
            done(error)
        }
    }, 90000)
});
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

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Reject Tx flow", ()=>{
    const safe_hub = sels.xpSelectors.safe_hub
    const send_funds_modal = sels.xpSelectors.send_funds_modal
    let currentBalance = 0.0
    
    test("Open the Send Funds Form", async () => {
        console.log("Open the Send Funds Form\n")
        currentBalance = await gFunc.getNumberInString(safe_hub.balance_ETH, gnosisPage)
        console.log("currentBalance = ", currentBalance)
        // await gFunc.clickSomething(safe_hub.send_btn, gnosisPage)
        // await gFunc.clickSomething(safe_hub.send_funds_btn, gnosisPage)
    }, TIME.T30)
//     test("Filling the Form", async () => {
//         console.log("Filling the Form\n")
       

//         await gFunc.clickAndType(sels.cssSelectors.send_funds_recep, gnosisPage, sels.testAccountsHash.non_owner_acc, "css")
//         await gFunc.clickSomething(send_funds_modal.token_selec, gnosisPage)
//         await gFunc.clickSomething(send_funds_modal.ether_selection, gnosisPage)
//         await gFunc.clearInput(send_funds_modal.amount_input, gnosisPage)
//         await gFunc.clickAndType(send_funds_modal.amount_input, gnosisPage, "0.5")
//         await gFunc.assertElementPresent(send_funds_modal.valid_amount_msg, gnosisPage)
//         await gFunc.clickSomething(sels.cssSelectors.review_send_fund_btn, gnosisPage, "css")
//     }, TIME.T15)
//     test("Review Info", async () => {
//         console.log("Review Info")
//         await gFunc.assertAllElementPresent([
//             send_funds_modal.step_number(2),
//             send_funds_modal.safe_name(sels.safeNames.load_safe_name),
//             send_funds_modal.balance,
//             send_funds_modal.recipient_hash,
//             send_funds_modal.token_icon,
//             send_funds_modal.token_amount,
//             send_funds_modal.fee_msg
//         ], gnosisPage)
//         const recipientHash = await gFunc.getInnerText(send_funds_modal.recipient_hash, gnosisPage)
//         expect(recipientHash).toMatch(sels.testAccountsHash.non_owner_acc)
//         const tokenAmount = await gFunc.getInnerText(send_funds_modal.token_amount, gnosisPage)
//         expect(tokenAmount).toMatch("0.01")
//     }, TIME.T15)
//     test("Approving the Tx with the owner 1", async () => {
//         console.log("Approving the Tx with the owner 1")
//         await gFunc.clickSomething(send_funds_modal.submit_btn, gnosisPage)
//         await gnosisPage.waitFor(TIME.T2)
//         await metamask.confirmTransaction()
//         console.log("Finish Approving the Tx with the owner 1")
//     }, TIME.T90)
//     test("Approving the Tx with the owner 2", async (done) => {
//         console.log("Approving the Tx with the owner 2")
//         try {
//             await MMpage.waitFor(TIME.T5)
//             await gnosisPage.bringToFront()
//             await gFunc.clickSomething(safe_hub.awaiting_confirmations, gnosisPage)
//             await gFunc.assertElementPresent(safe_hub.confirmed_counter(1), gnosisPage)
//             await metamask.switchAccount(1) //currently in account4, changing to account 1
//             await gnosisPage.waitFor(TIME.T2)
//             await gnosisPage.bringToFront()
//             await gFunc.clickSomething(safe_hub.confirm_btn, gnosisPage)
//             await gFunc.clickSomething(safe_hub.approve_tx_btn, gnosisPage)
//             await gnosisPage.waitFor(TIME.T2)
//             await metamask.confirmTransaction()
//             done()
//         } catch (error) {
//             done(error)
//         }
//         console.log("Finish Approving the Tx with the owner 2")
//     }, TIME.T90)
//     test("Approving the Tx with the owner 3", async (done) => {
//         console.log("Approving the Tx with the owner 3")
//         try {
//             await MMpage.waitFor(TIME.T5)
//             await gnosisPage.bringToFront()
//             await gFunc.assertElementPresent(safe_hub.confirmed_counter(2), gnosisPage)
//             await metamask.switchAccount(2)
//             await gnosisPage.bringToFront()
//             await gnosisPage.waitFor(TIME.T5)
//             await gFunc.clickSomething(safe_hub.confirm_btn, gnosisPage)
//             await gFunc.clickSomething(safe_hub.approve_tx_btn, gnosisPage)
//             await gnosisPage.waitFor(TIME.T2)
//             await metamask.confirmTransaction()
//             done()
//         } catch (error) {
//             done(error)
//         }
//         console.log("Finish Approving the Tx with the owner 3")
//     }, TIME.T90)
//     test("Verifying Execution of the Tx", async (done) => {
//         console.log("Verifying Execution of the Tx")
//         try {
//             await gnosisPage.bringToFront()
//             await gFunc.assertAllElementPresent([
//                 safe_hub.executor_tag,
//                 safe_hub.executor_hash,
//                 safe_hub.confirmed_counter(3)
//             ], gnosisPage)          
//             const executor_hash = await gFunc.getInnerText(safe_hub.executor_hash, gnosisPage)
//             const connected_account_hash = await gFunc.getInnerText(safe_hub.connected_account_hash, gnosisPage)
//             expect(executor_hash).toMatch(connected_account_hash)
//             console.log("Finish Verifying Execution of the Tx")
//             done()
//         } catch (error) {
//             done(error)
//         }
//     }, TIME.T600)
});
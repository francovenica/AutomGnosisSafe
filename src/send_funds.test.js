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

describe("Send Funds", ()=>{
    const safe_hub = sels.xpSelectors.safe_hub
    const send_funds_modal = sels.xpSelectors.send_funds_modal
    test("Open the Send Funds Form", async () => {
        console.log("Open the Send Funds Form\n")
        await gFunc.clickSomething(safe_hub.send_btn, gnosisPage)
        await gFunc.clickSomething(safe_hub.send_funds_btn, gnosisPage)
        await gFunc.assertElementPresent(send_funds_modal.modal_title, gnosisPage)
        await gFunc.assertElementPresent(send_funds_modal.step_number(1), gnosisPage)
        await gFunc.assertElementPresent(send_funds_modal.safe_name(sels.safeNames.load_safe_name), gnosisPage)
        await gFunc.assertElementPresent(send_funds_modal.balance, gnosisPage)
        await gFunc.assertElementPresent(send_funds_modal.balance_number, gnosisPage)
        await gFunc.assertElementPresent(sels.cssSelectors.review_send_fund_btn_diss, gnosisPage, "css")
    }, TIME.T30)
    test("Filling the Form", async () => {
        console.log("Filling the Form\n")
        const currentBalance = await gFunc.getNumberInString(send_funds_modal.balance_number,gnosisPage)

        await gFunc.clickAndType(sels.cssSelectors.send_funds_recep, gnosisPage, sels.testAccountsHash.non_owner_acc, "css")
        await gFunc.clickSomething(send_funds_modal.token_selec, gnosisPage)
        await gFunc.clickSomething(send_funds_modal.ether_selection, gnosisPage)
        
        await gFunc.assertElementPresent(sels.errorMsg.error(sels.errorMsg.required), gnosisPage)
        await gFunc.clickAndType(send_funds_modal.amount_input, gnosisPage, "0")
        await gFunc.assertElementPresent(sels.errorMsg.error(sels.errorMsg.greater_than_0), gnosisPage)
        await gFunc.clearInput(send_funds_modal.amount_input, gnosisPage)     
        
        await gFunc.clickAndType(send_funds_modal.amount_input, gnosisPage, "abc")
        await gFunc.assertElementPresent(sels.errorMsg.error(sels.errorMsg.not_a_number), gnosisPage)
        await gFunc.clearInput(send_funds_modal.amount_input, gnosisPage)
        
        await gFunc.clickAndType(send_funds_modal.amount_input, gnosisPage, "99999")
        await gFunc.assertElementPresent(sels.errorMsg.error(sels.errorMsg.max_amount_tokens(currentBalance)), gnosisPage)
        await gFunc.clearInput(send_funds_modal.amount_input, gnosisPage)

        await gFunc.clickSomething(send_funds_modal.send_max, gnosisPage)
        const input = await gFunc.assertElementPresent(send_funds_modal.amount_input, gnosisPage)
        const value = await gnosisPage.evaluate(x=>x.value, input)
        expect(parseFloat(value)).toBe(currentBalance)
        await gFunc.clearInput(send_funds_modal.amount_input, gnosisPage)

        await gFunc.clickAndType(send_funds_modal.amount_input, gnosisPage, "0.01")
        await gFunc.assertElementPresent(send_funds_modal.valid_amount_msg, gnosisPage)
        await gFunc.clickSomething(sels.cssSelectors.review_send_fund_btn, gnosisPage, "css")
    }, TIME.T15)
    test("Review Info", async () => {
        console.log("Review Info")
        await gFunc.assertAllElementPresent([
            send_funds_modal.step_number(2),
            send_funds_modal.safe_name(sels.safeNames.load_safe_name),
            send_funds_modal.balance,
            send_funds_modal.recipient_hash,
            send_funds_modal.token_icon,
            send_funds_modal.token_amount,
            send_funds_modal.fee_msg
        ], gnosisPage)
        const recipientHash = await gFunc.getInnerText(send_funds_modal.recipient_hash, gnosisPage)
        expect(recipientHash).toMatch(sels.testAccountsHash.non_owner_acc)
        const tokenAmount = await gFunc.getInnerText(send_funds_modal.token_amount, gnosisPage)
        expect(tokenAmount).toMatch("0.01")
    }, TIME.T15)
    test("Approving/executing the Tx", async () => {
        console.log("Signinig the Tx")
        await gFunc.clickSomething(send_funds_modal.submit_btn, gnosisPage)
        await gnosisPage.waitFor(TIME.T2)
        await metamask.confirmTransaction()

        for(let i = 2 ; i <= 3 ; i++ ){
            await metamask.switchAccount(i)
            await MMpage.waitFor(TIME.T2)
            await gnosisPage.bringToFront()
            //await gnosisPage.waitFor(safe_hub.latest_tx)
            await gFunc.clickSomething(safe_hub.latest_tx, gnosisPage)
            //await gnosisPage.waitFor(safe_hub.latest_tx)
            await gFunc.clickSomething(safe_hub.confirm_btn, gnosisPage)
            //await gnosisPage.waitFor(safe_hub.approve_tx_btn)
            await gFunc.clickSomething(safe_hub.approve_tx_btn, gnosisPage)
            await gnosisPage.waitFor(TIME.T2)
            await metamask.confirmTransaction()
        }
        await gnosisPag.waitFor(safe_hub.execute_btn, {timeout = TIME.T60})
        await gFunc.clickSomething(safe_hub.execute_btn, gnosisPage)
        await gFunc.clickSomething(safe_hub.execute_tx_btn, gnosisPage)
        await gnosisPage.waitFor(TIME.T2)
        await metamask.confirmTransaction()
        await MMpage.waitFor(TIME.T2)
        await gnosisPage.bringToFront()
        await gnosisPag.waitFor(safe_hub.executor_tag, {timeout = TIME.T60})
    }, TIME.T60)
});

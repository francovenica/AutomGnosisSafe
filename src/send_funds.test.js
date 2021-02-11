import * as gFunc from '../utils/selectorsHelpers'
import { sels } from '../utils/selectors'
import { sendFundsForm } from '../utils/selectors/sendFundsForm'
import { initWithDefaultSafe } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

const TOKEN_AMOUNT = 0.01

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await initWithDefaultSafe(true)
}, 60000)

afterAll(async () => {
  await gnosisPage.waitForTimeout(2000)
  await browser.close()
})

describe('Send funds and sign with two owners', () => {
  const errorMsg = sels.errorMsg
  const mainHub = sels.testIdSelectors.main_hub
  const txTab = sels.testIdSelectors.transaction_tab
  const assetTab = sels.testIdSelectors.asset_tab

  let amount_await_conf_status = ''
  let amount_success_status = ''
  let current_eth_funds = ''
  let current_eth_funds_on_text = ''

  test('Open the send funds form', async (done) => {
    console.log('Open the Send Funds Form\n')
    try {
      current_eth_funds_on_text = await gFunc.getInnerText(assetTab.balance_value('eth'), gnosisPage, 'css')
      current_eth_funds = parseFloat((await gFunc.getNumberInString(assetTab.balance_value('eth'), gnosisPage, 'css')).toFixed(3))
      // await gFunc.assertElementPresent(mainHub.new_transaction_btn, gnosisPage, "css")
      // await gFunc.clickElement({ selector: mainHub.new_transaction_btn }, gnosisPage)
      await gFunc.clickByText('button', 'New Transaction', gnosisPage)
      await gFunc.clickElement({ selector: mainHub.modal_send_funds_btn }, gnosisPage)
      await gFunc.assertElementPresent(sendFundsForm.review_btn_disabled.selector, gnosisPage, 'css')
      await gnosisPage.waitForTimeout(5000)
      done()
    } catch (error) {
      console.log(error)
      done()
    }
  }, 50000)

  test('Fill the form and check error messages when inpus are wrong', async (done) => {
    console.log('Filling the Form\n')
    try {
      await gFunc.clickAndType(sendFundsForm.recipient_input.selector, gnosisPage, sels.testAccountsHash.non_owner_acc, 'css')

      await gFunc.openDropdown(sendFundsForm.select_token.selector, gnosisPage, 'css')
      await gFunc.clickElement(sendFundsForm.select_token_ether, gnosisPage)

      await gnosisPage.waitForTimeout(1000)

      // Checking that 0 amount triggers an error
      await gFunc.clickAndType(sendFundsForm.amount_input.selector, gnosisPage, '0', 'ccs')
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.greater_than_0), gnosisPage)
      await gFunc.clearInput(sendFundsForm.amount_input.selector, gnosisPage, 'css')

      // Checking that any string returns an error
      await gFunc.clickAndType(sendFundsForm.amount_input.selector, gnosisPage, 'abc', 'css')
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.not_a_number), gnosisPage)
      await gFunc.clearInput(sendFundsForm.amount_input.selector, gnosisPage, 'css')

      // Checking that an amount over balance triggers an error
      await gFunc.clickAndType(sendFundsForm.amount_input.selector, gnosisPage, '99999', 'css')
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.max_amount_tokens(current_eth_funds)), gnosisPage)
      await gFunc.clearInput(sendFundsForm.amount_input.selector, gnosisPage, 'css')

      // Checking that the value set by the "Send max" button is the same as the current balance
      await gFunc.clickElement(sendFundsForm.send_max_btn, gnosisPage)
      const maxInputValue = await gFunc.getNumberInString(sendFundsForm.amount_input.selector, gnosisPage, 'css')
      expect(parseFloat(maxInputValue)).toBe(current_eth_funds)
      await gFunc.clearInput(sendFundsForm.amount_input.selector, gnosisPage, 'css')

      await gFunc.clickAndType(sendFundsForm.amount_input.selector, gnosisPage, TOKEN_AMOUNT.toString(), 'css')
      await gFunc.assertElementPresent(sendFundsForm.valid_amount_msg.selector, gnosisPage)
      await gFunc.clickElement(sendFundsForm.review_btn, gnosisPage)
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 15000)

  test('Review information is correct and submit transaction with signature', async (done) => {
    console.log('Review Info and submit')
    try {
      await gFunc.assertAllElementPresent([
        sendFundsForm.send_funds_review.selector,
        sendFundsForm.recipient_address_review.selector,
        // sendFundsForm.amount_eth_review.selector,
        // sendFundsForm.fee_msg_review.selector
      ], gnosisPage, 'css')
      const recipientHash = await gFunc.getInnerText(sendFundsForm.recipient_address_review.selector, gnosisPage, 'css')
      expect(recipientHash).toMatch(sels.testAccountsHash.non_owner_acc)
      const tokenAmount = await gFunc.getInnerText(sendFundsForm.amount_eth_review.selector, gnosisPage, 'css')
      expect(tokenAmount).toMatch(TOKEN_AMOUNT.toString())

      await gFunc.assertElementPresent(sendFundsForm.advanced_options.selector, gnosisPage, 'Xpath')
      await gFunc.assertElementPresent(sendFundsForm.submit_btn.selector, gnosisPage, 'css')
      await gFunc.clickElement(sendFundsForm.submit_btn, gnosisPage)

      await gnosisPage.waitForTimeout(4000)
      await metamask.sign()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 15000)

  test('Approving and executing the transaction with owner 2', async (done) => {
    console.log('Approving the Tx with the owner 2')
    try {
      await gnosisPage.bringToFront()
      // checking amount of "Success and awaiting conf status for final review"
      await gFunc.assertElementPresent(txTab.tx_status('Awaiting confirmations'), gnosisPage, 'css')
      amount_await_conf_status = await gFunc.amountOfElements(txTab.tx_status('Awaiting confirmations'), gnosisPage, 'css')
      expect(amount_await_conf_status).toBe(1) // it should be only 1 awaiting confirmations tx at this point
      await gFunc.assertElementPresent(txTab.tx_status('Success'), gnosisPage, 'css')
      amount_success_status = await gFunc.amountOfElements(txTab.tx_status('Success'), gnosisPage, 'css')
      amount_await_conf_status = '' // reset

      // Notifications are blocking the click ot the tx, I had to click it in another way now
      // await gFunc.clickElement({ selector: txTab.tx_status("Awaiting confirmations") }, gnosisPage)
      await gnosisPage.evaluate(() => {
        const firstTx = document.querySelectorAll('[data-testid="transaction-row"]')[0]
        firstTx && firstTx.click()
      })
      await gFunc.assertElementPresent(txTab.confirmed_counter(1), gnosisPage, 'css')
      await gFunc.assertElementPresent(txTab.not_confirmed_tx_check, gnosisPage, 'css')
      await metamask.switchAccount(1) // currently in account2, changing to account 1
      await gnosisPage.bringToFront()
      await gFunc.assertElementPresent(txTab.tx_status('Awaiting your confirmation'), gnosisPage, 'css')
      await gFunc.clickElement({ selector: txTab.confirm_tx_btn }, gnosisPage)

      await gFunc.assertElementPresent(mainHub.execute_checkbox, gnosisPage, 'css')
      await gFunc.assertElementPresent(sendFundsForm.advanced_options.selector, gnosisPage, 'Xpath')

      await gFunc.clickElement({ selector: mainHub.approve_tx_btn }, gnosisPage)
      await gnosisPage.waitForTimeout(2000)
      await metamask.confirmTransaction()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 90000)

  test('Check that transaction was successfully executed', async (done) => {
    console.log('Verifying Execution of the Tx')
    try {
      await gnosisPage.bringToFront()
      await gFunc.assertAllElementPresent([
        txTab.tx_status('Pending'),
        txTab.confirmed_counter(2),
        txTab.confirmed_tx_check,
        txTab.tx_status('Success')
      ], gnosisPage, 'css')
      amount_await_conf_status = await gFunc.amountOfElements(txTab.tx_status('Awaiting your confirmation'), gnosisPage, 'css')
      expect(amount_await_conf_status).toBe(0) // There should not be awaiting confirmations status
      const current_success_status_amount = await gFunc.amountOfElements(txTab.tx_status('Success'), gnosisPage, 'css')
      if (amount_success_status != 25)
        expect(current_success_status_amount).toBe(amount_success_status + 1) // should be 1 more success status in the list than before
      const sentAmount = await gFunc.selectorChildren(txTab.tx_description_send, gnosisPage, 'number', 0)
      expect(sentAmount).toBe(TOKEN_AMOUNT)
      const recipientAddress = await gFunc.selectorChildren(txTab.tx_description_send, gnosisPage, 'text', 1)
      // regex to match an address hash
      expect(recipientAddress.match(/(0x[a-fA-F0-9]+)/)[0]).toMatch(sels.testAccountsHash.non_owner_acc)
      // await gFunc.clickElement({ selector: mainHub.assets_tab }, gnosisPage)
      await gFunc.clickByText('span', 'ASSETS', gnosisPage)
      await gFunc.assertElementPresent(assetTab.balance_value('eth'), gnosisPage, 'css')
      const array = ['[data-testid="balance-ETH"]', current_eth_funds_on_text]
      // check every 100ms an update in the ETH funds in the assets tab
      await gnosisPage.waitForFunction((array) => {
        return document.querySelector(array[0]).innerText !== array[1]
      }, { polling: 100 }, array)
      const new_eth_funds = await gFunc.getNumberInString(assetTab.balance_value('eth'), gnosisPage, 'css')
      expect(parseFloat(new_eth_funds.toFixed(3))).toBe(parseFloat((current_eth_funds - TOKEN_AMOUNT).toFixed(3)))

      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 90000)
})

import * as gFunc from '../utils/global_func'
import { sels } from '../utils/selectors'
import { initWithDefaultSafe } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await initWithDefaultSafe()
}, 60000)

afterAll(async () => {
  await gnosisPage.waitFor(2000)
  await browser.close()
})

describe('Send Funds', () => {
  const errorMsg = sels.errorMsg
  const mainHub = sels.testIdSelectors.main_hub
  const sendFunds = sels.testIdSelectors.send_funds_form
  const txTab = sels.testIdSelectors.transaction_tab
  const assetTab = sels.testIdSelectors.asset_tab
  const send_funds_modal = sels.xpSelectors.send_funds_modal
  // const homepage = sels.xpSelectors.homepage

  let amount_await_conf_status = ''
  let amount_success_status = ''
  let current_eth_funds = ''
  let current_eth_funds_on_text = ''

  test('Open the Send Funds Form', async (done) => {
    console.log('Open the Send Funds Form\n')
    try {
      // await gFunc.clickSomething(homepage.close_rinkeby_notif, gnosisPage)
      current_eth_funds_on_text = await gFunc.getInnerText(assetTab.balance_value('eth'), gnosisPage, 'css')
      current_eth_funds = parseFloat((await gFunc.getNumberInString(assetTab.balance_value('eth'), gnosisPage, 'css')).toFixed(3))
      // await gFunc.assertElementPresent(mainHub.new_transaction_btn, gnosisPage, "css")
      // await gFunc.clickElement(mainHub.new_transaction_btn, gnosisPage)
      await gFunc.clickByText('button', 'New Transaction', gnosisPage)
      await gFunc.clickElement(mainHub.modal_send_funds_btn, gnosisPage)
      await gFunc.assertElementPresent(sendFunds.review_btn_disabled, gnosisPage, 'css')
      await gnosisPage.waitFor(10000)
      done()
    } catch (error) {
      console.log(error)
      done()
    }
  }, 50000)

  test('Filling the Form', async (done) => {
    console.log('Filling the Form\n')
    try {
      await gFunc.clickAndType(sendFunds.recipient_input, gnosisPage, sels.testAccountsHash.non_owner_acc, 'css')

      await gFunc.openDropdown(sendFunds.select_token, gnosisPage, 'css')
      await gFunc.clickElement(sendFunds.select_token_ether, gnosisPage)

      await gnosisPage.waitFor(1000)

      await gFunc.clickAndType(sendFunds.amount_input, gnosisPage, '0', 'ccs')
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.greater_than_0), gnosisPage)
      await gFunc.clearInput(sendFunds.amount_input, gnosisPage, 'css')

      await gFunc.clickAndType(sendFunds.amount_input, gnosisPage, 'abc', 'css')
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.not_a_number), gnosisPage)
      await gFunc.clearInput(sendFunds.amount_input, gnosisPage, 'css')

      await gFunc.clickAndType(sendFunds.amount_input, gnosisPage, '99999', 'css')
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.max_amount_tokens(current_eth_funds)), gnosisPage)
      await gFunc.clearInput(sendFunds.amount_input, gnosisPage, 'css')

      await gFunc.clickElement(sendFunds.send_max_btn, gnosisPage)
      const input_value = await gFunc.getNumberInString(sendFunds.amount_input, gnosisPage, 'css')
      // Checking that the value set by the "Send max" button is the same as the current balance
      expect(parseFloat(input_value)).toBe(current_eth_funds)
      await gFunc.clearInput(sendFunds.amount_input, gnosisPage, 'css')

      await gFunc.clickAndType(sendFunds.amount_input, gnosisPage, '0.01', 'css')
      await gFunc.assertElementPresent(send_funds_modal.valid_amount_msg, gnosisPage)
      await gFunc.clickElement(sendFunds.review_btn, gnosisPage)
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 15000)

  test('Review Info and submit', async (done) => {
    console.log('Review Info and submit')
    try {
      await gFunc.assertAllElementPresent([
        sendFunds.send_funds_review,
        sendFunds.recipient_address_review,
        sendFunds.amount_eth_review,
        sendFunds.fee_msg_review
      ], gnosisPage, 'css')
      const recipientHash = await gFunc.getInnerText(sendFunds.recipient_address_review, gnosisPage, 'css')
      expect(recipientHash).toMatch(sels.testAccountsHash.non_owner_acc)
      const tokenAmount = await gFunc.getInnerText(sendFunds.amount_eth_review, gnosisPage, 'css')
      expect(tokenAmount).toMatch('0.01')
      await gnosisPage.waitFor(3000)
      await gFunc.clickElement(sendFunds.submit_btn, gnosisPage)
      await gnosisPage.waitFor(3000)
      await metamask.sign()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 15000)

  test('Approving the Tx with the owner 2', async (done) => {
    console.log('Approving the Tx with the owner 2')
    try {
      await MMpage.waitFor(2000)
      await gnosisPage.bringToFront()
      // checking amount of "Success and awaiting conf status for final review"
      await gFunc.assertElementPresent(txTab.tx_status('Awaiting confirmations'), gnosisPage, 'css')
      amount_await_conf_status = await gFunc.amountOfElements(txTab.tx_status('Awaiting confirmations'), gnosisPage, 'css')
      expect(amount_await_conf_status).toBe(1) // it should be only 1 awaiting confirmations tx at this point
      await gFunc.assertElementPresent(txTab.tx_status('Success'), gnosisPage, 'css')
      amount_success_status = await gFunc.amountOfElements(txTab.tx_status('Success'), gnosisPage, 'css')
      amount_await_conf_status = '' // reset

      // Notifications are blocking the click ot the tx, I had to click it in another way now
      // await gFunc.clickElement(txTab.tx_status("Awaiting confirmations"), gnosisPage)
      await gnosisPage.evaluate(() => {
        const firstTx = document.querySelectorAll('[data-testid="transaction-row"]')[0]
        firstTx && firstTx.click()
      })
      await gFunc.assertElementPresent(txTab.confirmed_counter(1), gnosisPage, 'css')
      await gFunc.assertElementPresent(txTab.not_confirmed_tx_check, gnosisPage, 'css')
      await metamask.switchAccount(1) // currently in account2, changing to account 1
      await gnosisPage.bringToFront()
      await gFunc.assertElementPresent(txTab.tx_status('Awaiting your confirmation'), gnosisPage, 'css')
      await gFunc.clickElement(txTab.confirm_tx_btn, gnosisPage)
      await gFunc.assertElementPresent(mainHub.execute_checkbox, gnosisPage, 'css')
      await gFunc.clickElement(mainHub.approve_tx_btn, gnosisPage)
      await gnosisPage.waitFor(2000)
      await metamask.confirmTransaction()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 90000)

  test('Verifying Execution of the Tx', async (done) => {
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
      const amount_sent = await gFunc.selectorChildren(txTab.tx_description_send, gnosisPage, 'number', 0)
      expect(amount_sent).toBe(0.01)
      const recipient_address = await gFunc.selectorChildren(txTab.tx_description_send, gnosisPage, 'text', 1)
      // regex to match an address hash
      expect(recipient_address.match(/(0x[a-fA-F0-9]+)/)[0]).toMatch(sels.testAccountsHash.non_owner_acc)
      // await gFunc.clickElement(mainHub.assets_tab, gnosisPage)
      await gFunc.clickByText('span', 'ASSETS', gnosisPage)
      await gFunc.assertElementPresent(assetTab.balance_value('eth'), gnosisPage, 'css')
      const array = ['[data-testid="balance-ETH"]', current_eth_funds_on_text]
      // check every 100ms an update in the ETH funds in the assets tab
      await gnosisPage.waitForFunction((array) => {
        return document.querySelector(array[0]).innerText !== array[1]
      }, { polling: 100 }, array)
      const new_eth_funds = await gFunc.getNumberInString(assetTab.balance_value('eth'), gnosisPage, 'css')
      expect(parseFloat(new_eth_funds.toFixed(3))).toBe(parseFloat((current_eth_funds - 0.01).toFixed(3)))

      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 90000)
})

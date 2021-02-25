import * as gFunc from '../utils/selectorsHelpers'
import { sels } from '../utils/selectors'
import { initWithDefaultSafe } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

const TOKEN_AMOUNT = 0.01

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await initWithDefaultSafe(true)
}, 120000)

afterAll(async () => {
  await gnosisPage.waitForTimeout(2000)
  await browser.close()
})

describe('Send funds and sign with two owners', () => {
  const errorMsg = sels.errorMsg
  const mainHub = sels.testIdSelectors.main_hub
  const sendFunds = sels.testIdSelectors.send_funds_form
  const txTab = sels.testIdSelectors.transaction_tab
  const tx2_tab = sels.testIdSelectors.tx2_tab
  const assetTab = sels.testIdSelectors.asset_tab
  const send_funds_modal = sels.xpSelectors.send_funds_modal

  let amount_await_conf_status = ''
  let amount_success_status = ''
  let current_eth_funds = ''
  let current_eth_funds_on_text = ''
  let current_nonce = ''

  test('Open the send funds form', async (done) => {
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
      await gnosisPage.waitForTimeout(3000)
      done()
    } catch (error) {
      console.log(error)
      done()
    }
  }, 50000)

  test('Fill the form and check error messages when inpus are wrong', async (done) => {
    console.log('Filling the Form\n')
    try {
      await gFunc.clickAndType(sendFunds.recipient_input, gnosisPage, sels.testAccountsHash.non_owner_acc, 'css')

      await gFunc.openDropdown(sendFunds.select_token, gnosisPage, 'css')
      await gFunc.clickElement(sendFunds.select_token_ether, gnosisPage)

      await gnosisPage.waitForTimeout(1000)

      // Checking that 0 amount triggers an error
      await gFunc.clickAndType(sendFunds.amount_input, gnosisPage, '0', 'ccs')
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.greater_than_0), gnosisPage)
      await gFunc.clearInput(sendFunds.amount_input, gnosisPage, 'css')

      // Checking that any string returns an error
      await gFunc.clickAndType(sendFunds.amount_input, gnosisPage, 'abc', 'css')
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.not_a_number), gnosisPage)
      await gFunc.clearInput(sendFunds.amount_input, gnosisPage, 'css')

      // Checking that an amount over balance triggers an error
      await gFunc.clickAndType(sendFunds.amount_input, gnosisPage, '99999', 'css')
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.max_amount_tokens(current_eth_funds)), gnosisPage)
      await gFunc.clearInput(sendFunds.amount_input, gnosisPage, 'css')

      // Checking that the value set by the "Send max" button is the same as the current balance
      await gFunc.clickElement(sendFunds.send_max_btn, gnosisPage)
      const maxInputValue = await gFunc.getNumberInString(sendFunds.amount_input, gnosisPage, 'css')
      expect(parseFloat(maxInputValue)).toBe(current_eth_funds)
      await gFunc.clearInput(sendFunds.amount_input, gnosisPage, 'css')

      await gFunc.clickAndType(sendFunds.amount_input, gnosisPage, TOKEN_AMOUNT.toString(), 'css')
      await gFunc.assertElementPresent(send_funds_modal.valid_amount_msg, gnosisPage)
      await gFunc.clickElement(sendFunds.review_btn, gnosisPage)
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
        sendFunds.send_funds_review,
        sendFunds.recipient_address_review,
      ], gnosisPage, 'css')
      const recipientHash = await gFunc.getInnerText(sendFunds.recipient_address_review, gnosisPage, 'css')
      expect(recipientHash).toMatch(sels.testAccountsHash.non_owner_acc)
      const tokenAmount = await gFunc.getInnerText(sendFunds.amount_eth_review, gnosisPage, 'css')
      expect(tokenAmount).toMatch(TOKEN_AMOUNT.toString())

      await gFunc.assertElementPresent(sendFunds.advanced_options, gnosisPage, 'Xpath')
      await gFunc.assertElementPresent(sendFunds.submit_btn, gnosisPage, 'css')
      await gFunc.clickElement(sendFunds.submit_btn, gnosisPage)

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
      await gFunc.assertTextPresent(tx2_tab.tx_status, "Awaiting confirmations", gnosisPage, "css")
      current_nonce = await gFunc.getNumberInString("div.tx-nonce > p", gnosisPage, "css")
      console.log('CurrentNonce = ', current_nonce)
      await metamask.switchAccount(1) // currently in account2, changing to account 1
      await gnosisPage.bringToFront()
      await gnosisPage.waitForTimeout(3000)
      await gFunc.assertTextPresent(tx2_tab.tx_status, "Awaiting your confirmation", gnosisPage, "css")
      await gFunc.assertTextPresent("div.tx-votes > div > p", "1 out of 2", gnosisPage, "css")
      await gFunc.clickElement(tx2_tab.tx_type, gnosisPage)
      await gnosisPage.waitForTimeout(3000)
      await gFunc.clickByText("button > span", "Confirm", gnosisPage)
      await gFunc.assertElementPresent(mainHub.execute_checkbox, gnosisPage, 'css')
      await gFunc.assertElementPresent(sendFunds.advanced_options, gnosisPage, 'Xpath')
      await gFunc.clickElement(mainHub.approve_tx_btn, gnosisPage)
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
      await gnosisPage.waitForTimeout(3000)
      await gFunc.assertTextPresent(tx2_tab.tx_status, "Pending", gnosisPage, "css")
      //waiting for the queue list to be empty and the executed tx to be on the history tab
      await gFunc.assertElementPresent("[alt='No Transactions yet']", gnosisPage, "css")
      await gFunc.clickByText("button > span > p", "History", gnosisPage)
      //Wating for the new tx to show in the history, looking for the nonce
      //await gFunc.isTextPresent(tx2_tab.tx_nonce, current_nonce, gnosisPage, "css")
      const nonce = await gFunc.getNumberInString(tx2_tab.tx_nonce, gnosisPage, "css") 
      expect(nonce).toBe(current_nonce)
      const sentAmount = await gFunc.selectorChildren(tx2_tab.tx_info, gnosisPage, 'number', 0)
      expect(sentAmount).toBe(TOKEN_AMOUNT)
      await gFunc.clickElement(tx2_tab.tx_type, gnosisPage)
      const recipientAddress = await gFunc.getInnerText("div.tx-details > div p", gnosisPage, "css")
      // regex to match an address hash
      expect(recipientAddress.match(/(0x[a-fA-F0-9]+)/)[0]).toMatch(sels.testAccountsHash.non_owner_acc)
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

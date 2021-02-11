import * as gFunc from '../utils/selectorsHelpers'
import { sels } from '../utils/selectors'
import { initWithDefaultSafe } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await initWithDefaultSafe(true)
}, 60000)

afterAll(async () => {
  await gnosisPage.waitFor(2000)
  await browser.close()
})

describe.skip('Change Policies', () => {
  const modify_policies = sels.testIdSelectors.settings_tabs
  const errorMsg = sels.errorMsg
  const mainHub = sels.testIdSelectors.main_hub
  const general = sels.testIdSelectors.general
  const txTab = sels.testIdSelectors.transaction_tab
  const assetTab = sels.testIdSelectors.asset_tab
  // const modify_policies = sels.xpSelectors.modify_policies
  // const safe_hub = sels.xpSelectors.safe_hub
  // let owner_amount = false //amount of owners, will be taken from the owners tab in the settings
  // let req_conf = false //current required confirmations. taken from the message in the policies tab
  // let max_req_conf = false //max required confirmations. taken from the message in the policies tab
  test('Open Modify form', async (done) => {
    console.log('Open Modify form')
    try {
      await gnosisPage.waitFor(2000)
      await gFunc.isTextPresent(general.sidebar, 'SETTINGS', gnosisPage)
      await gFunc.clickByText('span', 'SETTINGS', gnosisPage)
      await gFunc.isTextPresent('body', 'Safe Version', gnosisPage)
      await gFunc.clickByText('p', 'Policies', gnosisPage)
      await gFunc.isTextPresent('body', 'Required confirmations', gnosisPage)
      await gFunc.isTextPresent('body', '2 out of 4 owners', gnosisPage)
      await gFunc.clickByText('span', 'Modify', gnosisPage)
      await gFunc.isTextPresent('body', 'Change required confirmations', gnosisPage)
      done()
    } catch (error) {
      done(error)
    }
  }, 60000)
  test('Creating and approving Tx with owner 1', async (done) => {
    console.log('Verifying modification options')
    const errorMsg = sels.errorMsg
    try {
      await gFunc.openDropdown(modify_policies.req_conf_dropdown, gnosisPage, 'css')
      await gFunc.clickElement({ selector: '[data-value="1"]' }, gnosisPage)
      await gFunc.clickByText('span', 'Change', gnosisPage)
      await gnosisPage.waitFor(2000)
      await metamask.sign()
      done()
    } catch (error) {
      done(error)
    }
  }, 60000)
  test('Approving Tx with owner 2', async (done) => {
    console.log('Creating and approving Tx with owner 1')
    try {
      await MMpage.waitFor(2000)
      await gnosisPage.bringToFront()
      // checking amount of "Success and awaiting conf status for final review"
      await gFunc.assertElementPresent(txTab.tx_status('Awaiting confirmations'), gnosisPage, 'css')
      const amount_await_conf_status = await gFunc.amountOfElements(txTab.tx_status('Awaiting confirmations'), gnosisPage, 'css')
      expect(amount_await_conf_status).toBe(1) // it should be only 1 awaiting confirmations tx at this point
      // Notifications are blocking the click ot the tx, I had to click it in another way now
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
      await gFunc.clickElement({ selector: mainHub.approve_tx_btn }, gnosisPage)
      await gnosisPage.waitFor(2000)
      await metamask.confirmTransaction()
      done()
    } catch (error) {
      done(error)
    }
  }, 90000)
  test('Verifying the change in the settings', async (done) => {
    console.log('Verifying the change in the settings')
    try {
      await MMpage.waitFor(2000)
      await gnosisPage.bringToFront()
      console.log('Checking for the 2 out of 2')
      await gFunc.assertElementPresent(txTab.confirmed_counter(2), gnosisPage)
      console.log('Confirmed  the 2 out of 2')
      await gFunc.isTextPresent(general.sidebar, 'SETTINGS', gnosisPage)
      await gFunc.clickByText('span', 'SETTINGS', gnosisPage)
      await gFunc.isTextPresent('body', 'Safe Version', gnosisPage)
      await gFunc.clickByText('p', 'Policies', gnosisPage)
      await gFunc.isTextPresent('body', 'Required confirmations', gnosisPage)
      await gFunc.isTextPresent('body', '1 out of 4 owners', gnosisPage)
      done()
    } catch (error) {
      done(error)
    }
  }, 90000)
  test('Create Tx to revert it back to initial state', async (done) => {
    console.log('Create Tx to revert it back to initial state')
    try {
      await gFunc.clickByText('span', 'Modify', gnosisPage)
      await gFunc.isTextPresent('body', 'Change required confirmations', gnosisPage)
      await gFunc.openDropdown(modify_policies.req_conf_dropdown, gnosisPage, 'css')
      await gFunc.clickElement({ selector: '[data-value="2"]' }, gnosisPage)
      await gFunc.clickByText('span', 'Change', gnosisPage)
      await gnosisPage.waitFor(2000)
      await metamask.confirmTransaction()
      done()
    } catch (error) {
      done(error)
    }
  }, 60000)
  test('Verifying the rollback', async (done) => {
    console.log('Verifying the rollback')
    try {
      await MMpage.waitFor(2000)
      await gnosisPage.bringToFront()
      await gFunc.assertElementPresent(txTab.confirmed_counter(1), gnosisPage)
      await gFunc.isTextPresent(general.sidebar, 'SETTINGS', gnosisPage)
      await gFunc.clickByText('span', 'SETTINGS', gnosisPage)
      await gFunc.isTextPresent('body', 'Safe Version', gnosisPage)
      await gFunc.clickByText('p', 'Policies', gnosisPage)
      await gFunc.isTextPresent('body', 'Required confirmations', gnosisPage)
      await gFunc.isTextPresent('body', '2 out of 4 owners', gnosisPage)
      done()
    } catch (error) {
      done(error)
    }
  }, 90000)
})

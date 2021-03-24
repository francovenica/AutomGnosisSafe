import * as gFunc from '../utils/selectorsHelpers'
import {
  assertElementPresent,
  clearInput,
  clickAndType,
  clickByText,
  clickElement,
  getInnerText,
  getNumberInString,
  assertTextPresent,
  openDropdown
} from '../utils/selectorsHelpers'
import { sels } from '../utils/selectors'
import { accountsSelectors } from '../utils/selectors/accounts'
import { sendFundsForm } from '../utils/selectors/sendFundsForm'
import { settingsPage } from '../utils/selectors/settings'
import { transactionsTab } from '../utils/selectors/transactionsTab'
import { initWithDefaultSafeDirectNavigation } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await initWithDefaultSafeDirectNavigation(true)
}, 60000)

afterAll(async () => {
  await gnosisPage.waitForTimeout(2000)
  await browser.close()
})

describe('Adding and removing owners', () => {
  const errorMsg = sels.errorMsg
  const mainHub = sels.testIdSelectors.main_hub
  let new_owner_name = accountsSelectors.otherAccountNames.owner6_name
  let new_owner_address = accountsSelectors.testAccountsHash.non_owner_acc
  let current_nonce = ''

  test('Filling Form and submitting tx', async (done) => {
    console.log('Filling Form and submitting tx')
    const existing_owner_hash = accountsSelectors.testAccountsHash.acc1
    try {
      await clickByText('span', 'settings', gnosisPage)
      await clickElement(settingsPage.owners_tab, gnosisPage)
      await clickElement(settingsPage.add_owner_btn, gnosisPage)

      await clickElement(settingsPage.add_owner_next_btn, gnosisPage)
      await assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) // asserts error "required" in name
      await clickAndType(settingsPage.add_owner_name_input, gnosisPage, new_owner_name)

      await clickElement(settingsPage.add_owner_next_btn, gnosisPage)
      await assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) // asserts error "required" in name

      await clickAndType(settingsPage.add_owner_address_input, gnosisPage, '0xInvalidHash')
      await assertElementPresent(errorMsg.error(errorMsg.valid_ENS_name), gnosisPage)
      await clearInput("[data-testid='add-owner-address-testid']", gnosisPage, 'css')

      await clickAndType(settingsPage.add_owner_address_input, gnosisPage, existing_owner_hash)
      await assertElementPresent(errorMsg.error(errorMsg.duplicated_address), gnosisPage)
      await clearInput("[data-testid='add-owner-address-testid']", gnosisPage, 'css')

      await clickAndType(settingsPage.add_owner_address_input, gnosisPage, new_owner_address)
      await clickElement(settingsPage.add_owner_next_btn, gnosisPage)

      await clickElement(settingsPage.add_owner_review_btn, gnosisPage)
      await assertTextPresent('//div[13]/div[2]/div/p', new_owner_name, gnosisPage)
      await assertTextPresent('//div[13]/div[2]/div/div/p', new_owner_address, gnosisPage)
      // Checking the new owner name and address is present in the review step ^^^. Do we need an Id for this?
      await assertElementPresent("[data-testid='add-owner-submit-btn']", gnosisPage, 'css')
      await gnosisPage.waitForFunction(() => !document.querySelector("[data-testid='add-owner-submit-btn'][disabled]"))
      // The submit button starts disabled. I wait for it to become enabled ^^^
      await clickElement(settingsPage.add_owner_submit_btn, gnosisPage)
      await gnosisPage.waitForTimeout(4000)
      await metamask.sign()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 60000)
  test('Approving and executing the transaction with owner 2', async (done) => {
    console.log('Approving the Tx with the owner 2')
    try {
      await gnosisPage.bringToFront()
      await assertTextPresent(transactionsTab.tx2_status, 'Awaiting confirmations', gnosisPage, 'css')
      current_nonce = await getNumberInString('div.tx-nonce > p', gnosisPage, 'css')
      console.log('CurrentNonce = ', current_nonce)
      await metamask.switchAccount(1) // currently in account2, changing to account 1
      await gnosisPage.bringToFront()
      await gnosisPage.waitForTimeout(3000)
      await assertTextPresent(transactionsTab.tx2_status, 'Awaiting your confirmation', gnosisPage, 'css')
      await assertTextPresent('div.tx-votes > div > p', '1 out of 2', gnosisPage, 'css')
      await clickElement(transactionsTab.tx_type, gnosisPage)
      await gnosisPage.waitForTimeout(3000)
      await clickByText('button > span', 'Confirm', gnosisPage)
      await assertElementPresent(mainHub.execute_checkbox, gnosisPage, 'css')
      await assertElementPresent(sendFundsForm.advanced_options.selector, gnosisPage, 'Xpath')
      await assertElementPresent(mainHub.approve_tx_btn, gnosisPage, 'css')
      await gnosisPage.waitForFunction(() => !document.querySelector("[data-testid='approve-tx-modal-submit-btn'][disabled]"))
      await clickElement({ selector: mainHub.approve_tx_btn }, gnosisPage)
      await gnosisPage.waitForTimeout(3000)
      await metamask.confirmTransaction()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 180000)
  test('Deleting owner form filling and tx creation', async (done) => {
    console.log('Deleting owner form filling and tx creation')
    try {
      await gnosisPage.bringToFront()
      await assertTextPresent('//h5', 'Queue transactions will appear here', gnosisPage)
      // we need a better way to know if the Queue tab is empty ^^^
      await clickByText('span', 'settings', gnosisPage)
      await clickElement(settingsPage.owners_tab, gnosisPage)
      await assertElementPresent("[data-testid='remove-owner-btn']", gnosisPage, 'css')

      let count = 0
      let aux = 1
      await gnosisPage.evaluate((count, aux) => {
        console.log('Entre. Count = ', count, '   aux = ', aux)
        document.querySelectorAll("[data-testid='owners-row'] span").forEach(x => {
          if (x.innerText === '0xc8b99Dc2414fAA46E195a8f3EC69DD222EF1744F')
            aux = 0;
          count += aux;
        })
        document.querySelectorAll("[data-testid='remove-owner-btn']")[(count === 0) ? 0 : count - 1].click()
      }, count, aux)
      // The only way I could find the correct "remove owner" icon to click ^^^
      await clickElement(settingsPage.remove_owner_next_btn, gnosisPage)
      await openDropdown({ selector: '[id="mui-component-select-threshold"]', type: 'css' }, gnosisPage)
      await clickElement({ selector: "[data-value='2']", type: 'css' }, gnosisPage)
      await gnosisPage.waitForTimeout(2000)
      await clickElement(settingsPage.remove_owner_review_btn, gnosisPage)
      await assertTextPresent('//div[13]/div[2]/div/p', new_owner_name, gnosisPage)
      await assertTextPresent('//div[13]/div[2]/div/div/p', new_owner_address, gnosisPage)
      await assertElementPresent("[data-testid='remove-owner-review-btn']", gnosisPage, 'css')
      await gnosisPage.waitForFunction(() => !document.querySelector("[data-testid='remove-owner-review-btn'][disabled]"))
      await clickElement(settingsPage.remove_owner_submit_btn, gnosisPage)
      await gnosisPage.waitForTimeout(4000)
      await metamask.sign()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 180000)
  test('Executing the owner deletion with owner 2', async (done) => {
    console.log('Executing the owner deletion with owner 2')
    try {
      await gnosisPage.bringToFront()
      await assertTextPresent(transactionsTab.tx2_status, 'Awaiting confirmations', gnosisPage, 'css')
      current_nonce = await getNumberInString('div.tx-nonce > p', gnosisPage, 'css')
      console.log('CurrentNonce = ', current_nonce)
      await metamask.switchAccount(2) // currently in account1, changing to account 2
      await gnosisPage.bringToFront()
      await gnosisPage.waitForTimeout(3000)
      await assertTextPresent(transactionsTab.tx2_status, 'Awaiting your confirmation', gnosisPage, 'css')
      await assertTextPresent('div.tx-votes > div > p', '1 out of 2', gnosisPage, 'css')
      await clickElement(transactionsTab.tx_type, gnosisPage)
      await gnosisPage.waitForTimeout(3000)
      await clickByText('button > span', 'Confirm', gnosisPage)
      await assertElementPresent(mainHub.execute_checkbox, gnosisPage, 'css')
      await assertElementPresent(sendFundsForm.advanced_options.selector, gnosisPage, 'Xpath')
      await assertElementPresent(mainHub.approve_tx_btn, gnosisPage, 'css')
      await gnosisPage.waitForFunction(() => !document.querySelector("[data-testid='approve-tx-modal-submit-btn'][disabled]"))
      await clickElement({ selector: mainHub.approve_tx_btn }, gnosisPage)
      await gnosisPage.waitForTimeout(3000)
      await metamask.confirmTransaction()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 180000)
  test('Verifying owner deletion', async (done) => {
    console.log('Verifying owner deletion')
    try {
      await assertTextPresent('//h5', 'Queue transactions will appear here', gnosisPage)
      await clickByText('button > span > p', 'History', gnosisPage)
      const nonce = await getNumberInString(transactionsTab.tx_nonce, gnosisPage, 'css')
      expect(nonce).toBe(current_nonce)
      const executedTxStatus = await getInnerText(transactionsTab.tx2_status, gnosisPage, 'css')
      expect(executedTxStatus).toBe('Success')
      done()
    } catch (error) {
      console.log(error)
      done()
    }
  }, 120000)
})

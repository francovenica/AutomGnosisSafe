import * as gFunc from '../utils/global_func'
import { sels } from '../utils/selectors'
import { load_wallet } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await load_wallet(true)
}, 60000)

// afterAll(async () => {
//   await gnosisPage.waitFor(2000)
//   await browser.close()
// })

describe('Adding and removing owners', () => {
  const modify_policies = sels.xpSelectors.modify_policies
  const safe_hub = sels.xpSelectors.safe_hub
  const setting_owners = sels.xpSelectors.setting_owners
  const errorMsg = sels.errorMsg
  let owners_current_amount // Store the number next to "Owners" in the owners tab
  let current_req_conf // Stores the X in "X out of Y" in the policies tab
  let owner_rows_amount // stores the number in the "owners" tab

  let req_conf // Will store the current required confirmations needed
  let max_req_conf // Will store the new max required confirmation after adding the new owner
  let owner_selector // Will store the max required confirmation I can pick form the selector
  let new_req_conf // Once I change the req confirmation, this will save it

  let new_owner_name = sels.otherAccountNames.owner6_name
  let new_owner_address = sels.testAccountsHash.non_owner_acc
  test.skip('Checking owner amount and current policies', async (done) => {
    console.log('Checking owner amount current policies')
    try {
      await gFunc.clickSomething(setting_owners.settings_tab, gnosisPage)
      await gFunc.clickSomething(modify_policies.policies_tab, gnosisPage)
      current_req_conf = await gFunc.getNumberInString(modify_policies.req_conf, gnosisPage)
      await gFunc.clickSomething(setting_owners.owners_tab, gnosisPage)
      owners_current_amount = await gFunc.getNumberInString(setting_owners.owner_amount, gnosisPage)
      owner_rows_amount = await gFunc.amountOfElements(setting_owners.owner_table, gnosisPage)
      expect(owners_current_amount).toBe(owner_rows_amount)
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 60000)
  test.skip('First step of the form: name and address', async (done) => {
    console.log('First step of the form: name and address')
    const existing_owner_hash = sels.testAccountsHash.acc1
    try {
      await gFunc.clickSomething(setting_owners.add_new_owner_btn, gnosisPage)
      await gFunc.assertElementPresent(setting_owners.add_new_owner_title, gnosisPage)
      await gFunc.clickSomething(setting_owners.next_btn, gnosisPage)
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) // asserts error "required" in name
      await gFunc.clickAndType(setting_owners.owner_name_input, gnosisPage, new_owner_name)
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) // asserts error "required" in address
      await gFunc.clickAndType(setting_owners.owner_address_input, gnosisPage, '0xInvalidHash')
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.valid_ENS_name), gnosisPage)
      await gFunc.clearInput(setting_owners.owner_address_input, gnosisPage)
      await gFunc.clickAndType(setting_owners.owner_address_input, gnosisPage, existing_owner_hash)
      await gFunc.assertElementPresent(errorMsg.error(errorMsg.duplicated_address), gnosisPage)
      await gFunc.clearInput(setting_owners.owner_address_input, gnosisPage)
      await gFunc.clickAndType(setting_owners.owner_address_input, gnosisPage, new_owner_address)
      await gFunc.clickSomething(setting_owners.next_btn, gnosisPage)
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 60000)
//   test('Second step of the form: Req Confirmations', async (done) => {
//     console.log('Second step of the form: Req Confirmations')
//     try {
//       req_conf = await gFunc.getNumberInString(setting_owners.req_conf,gnosisPage)
//       await expect(req_conf).toBe(current_req_conf) // the X in "X out of Y" in the form is the same as the one in the policies tab

//       await gFunc.clickSomething(setting_owners.req_conf, gnosisPage)
//       max_req_conf = await gFunc.getNumberInString(setting_owners.owner_limit, gnosisPage)
//       owner_selector = await gFunc.amountOfElements(setting_owners.owner_selector, gnosisPage)// to calculate the length, no [0] for the xpath element for this
//       await expect(owner_selector).toBe(max_req_conf) // the amount of options should be X in "out of X owners"
//       await gFunc.clickSomething(setting_owners.owner_selector_option(1), gnosisPage)
//       await gnosisPage.waitFor(2000) // always after clicking in one of these selector you have to wait before clicking submit
//       new_req_conf = await gFunc.getNumberInString(setting_owners.req_conf,gnosisPage) // saving the new required confirmations
//       await gnosisPage.waitFor(2000) // If I don't wait the Review button shows being clicked, but it wont actually click
//       await gFunc.clickSomething(setting_owners.review_btn, gnosisPage)
//       done()
//     } catch (error) {
//       console.log(error)
//       done(error)
//     }
//   }, 60000)
//   test('Third step: Verification', async (done) => {
//     console.log('Third step: Verification')
//     try {
//       const req_conf_verif = await gFunc.getInnerText(setting_owners.req_conf_verif, gnosisPage)
//       const req_conf_verif_array = req_conf_verif.split(' ')// To get both numbers from "X out of Y owners" i have put them in an array
//       expect(parseInt(req_conf_verif_array[0])).toBe(new_req_conf) // Verifying the value of X in "X out of Y owners"
//       expect(parseInt(req_conf_verif_array[3])).toBe(max_req_conf) // Verifying the value of Y in "X out of Y owners"
//       await gFunc.assertAllElementPresent([
//         setting_owners.new_owner_section,
//         setting_owners.new_owner_name(new_owner_name),
//         setting_owners.new_owner_address(new_owner_address),
//       ], gnosisPage)
//       done()
//     } catch (error) {
//       console.log(error)
//       done(error)
//     }
//   }, 60000)
//   test('Submiting and signing tx with owner 1', async (done) => {
//     console.log('Submiting and signing tx with owner 1')
//     try {
//       await gFunc.clickSomething(setting_owners.submit_btn, gnosisPage)
//       await gnosisPage.waitFor(2000)
//       await metamask.sign()
//       done()
//     } catch (error) {
//       console.log(error)
//       done(error)
//     }
//   }, 90000)
//   test('Signing with owner 2', async (done) => {
//     console.log('Signing with owner 2')
//     try {
//       await MMpage.waitFor(5000)
//       await gnosisPage.bringToFront()
//       await gFunc.clickSomething(safe_hub.awaiting_confirmations, gnosisPage)
//       await gFunc.assertElementPresent(safe_hub.confirmed_counter(1), gnosisPage)
//       await metamask.switchAccount(1) // currently in account4, changing to account 1
//       await gnosisPage.waitFor(2000)
//       await gnosisPage.bringToFront()
//       await gFunc.clickSomething(safe_hub.confirm_btn, gnosisPage)
//       await gFunc.clickSomething(safe_hub.approve_tx_btn, gnosisPage)
//       await gnosisPage.waitFor(2000)
//       await metamask.sign()
//       done()
//     } catch (error) {
//       console.log(error)
//       done(error)
//     }
//   }, 90000)
//   test('Signing and executing with owner 3', async (done) => {
//     console.log('Signing and executing with owner 3')
//     try {
//       await MMpage.waitFor(5000)
//       await gnosisPage.bringToFront()
//       await gFunc.assertElementPresent(safe_hub.confirmed_counter(2), gnosisPage)
//       await metamask.switchAccount(2)
//       await gnosisPage.bringToFront()
//       await gnosisPage.waitFor(5000)
//       await gFunc.clickSomething(safe_hub.confirm_btn, gnosisPage)
//       await gFunc.clickSomething(safe_hub.approve_tx_btn, gnosisPage)
//       await gnosisPage.waitFor(2000)
//       await metamask.confirmTransaction()
//       done()
//     } catch (error) {
//       console.log(error)
//       done(error)
//     }
//   }, 90000)
//   test('Verifying new owner', async (done) => {
//     console.log('Verifying new owner')
//     try {
//       await gnosisPage.bringToFront()
//       await gnosisPage.waitForXPath("//div[contains(text(),'Executor')]")
//       await gFunc.clickSomething(setting_owners.settings_tab, gnosisPage)
//       await gFunc.clickSomething(setting_owners.owners_tab, gnosisPage)
//       await gnosisPage.waitForXPath(`//div[5]//div[3]/p[contains(text(),'${max_req_conf}')]`) // wait for the amount to be max_req_conf
//       await gFunc.assertElementPresent(setting_owners.owner_table_row_address(new_owner_address), gnosisPage) // assert new owner by address
//       done()
//     } catch (error) {
//       console.log(error)
//       done(error)
//     }
//   }, 90000)
//   test("Editing New owner's name", async (done) => {
//     console.log("Editing New owner's name")
//     try {
//       await gFunc.clickSomething(setting_owners.owner_row_options(new_owner_address, 1), gnosisPage) // click "edit name" option for new owner
//       await gFunc.clearInput(setting_owners.edit_name_input, gnosisPage)
//       await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) // asserts error "required" in name
//       const name_edited = new_owner_name + ' edited'
//       await gFunc.clickAndType(setting_owners.edit_name_input, gnosisPage, name_edited)
//       const input_innertext = await gFunc.getInnerText(setting_owners.edit_name_input, gnosisPage)
//       expect(input_innertext).toMatch(name_edited)
//       await gFunc.clickSomething(setting_owners.save_btn, gnosisPage)
//       const edited_name_new_owner = await gFunc.getInnerText(setting_owners.owner_table_row_name(name_edited), gnosisPage)
//       expect(edited_name_new_owner).toMatch(name_edited)
//       new_owner_name = edited_name_new_owner // For deletion I have to review the owner name, so Im updating it
//       done()
//     } catch (error) {
//       console.log(error)
//       done(error)
//     }
//   }, 60000)
//   test('Deleting recently added owner', async (done) => {
//     console.log('Deleting recently added owner')
//     try {
//       await gFunc.clickSomething(setting_owners.owner_row_options(new_owner_address, 3), gnosisPage) // deleting the new owner
//       await gFunc.assertElementPresent(setting_owners.to_be_deleted_address(new_owner_address), gnosisPage)
//       await gFunc.clickSomething(setting_owners.next_btn, gnosisPage)
//       done()
//     } catch (error) {
//       console.log(error)
//       done(error)
//     }
//   }, 60000)
//   test('Setting new required confirmation after deletion', async (done) => {
//     console.log('Setting new required confirmation after deletion')
//     try {
//       await gFunc.clickSomething(setting_owners.req_conf, gnosisPage)
//       max_req_conf = await gFunc.getNumberInString(setting_owners.owner_limit, gnosisPage)
//       owner_selector = await gFunc.amountOfElements(setting_owners.owner_selector, gnosisPage)// to calculate the length, no [0] for the xpath element for this
//       await expect(owner_selector).toBe(max_req_conf) // the amount of options should be X in "out of X owners"
//       await gFunc.clickSomething(setting_owners.owner_selector_option(3), gnosisPage)
//       await gnosisPage.waitFor(2000) // always after clicking in one of these selector you have to wait before clicking submit
//       new_req_conf = await gFunc.getNumberInString(setting_owners.req_conf,gnosisPage) // saving the new required confirmations
//       await gFunc.clickSomething(setting_owners.review_btn, gnosisPage)
//       done()
//     } catch (error) {
//       console.log(error)
//       done(error)
//     }
//   }, 90000)
//   test('Reviewing user deletion, submitting and signing', async (done) => {
//     console.log('Reviewing user deletion, submitting and signing')
//     try {
//       const req_conf_verif = await gFunc.getInnerText(setting_owners.req_conf_verif, gnosisPage)
//       const req_conf_verif_array = req_conf_verif.split(' ')// To get both numbers from "X out of Y owners" i have put them in an array
//       expect(parseInt(req_conf_verif_array[0])).toBe(new_req_conf) // Verifying the value of X in "X out of Y owners"
//       expect(parseInt(req_conf_verif_array[3])).toBe(max_req_conf) // Verifying the value of Y in "X out of Y owners"
//       await gFunc.assertAllElementPresent([
//         setting_owners.removing_owner_title,
//         setting_owners.new_owner_name(new_owner_name),
//         setting_owners.new_owner_address(new_owner_address),
//       ], gnosisPage)

//       await gFunc.clickSomething(setting_owners.submit_btn, gnosisPage)
//       await gnosisPage.waitFor(2000)
//       await metamask.confirmTransaction()
//       done()
//     } catch (error) {
//       console.log(error)
//       done(error)
//     }
//   }, 60000)
//   test('Verifying owner deletion', async (done) => {
//     console.log('Verifying owner deletion')
//     try {
//       await MMpage.waitFor(2000)
//       await gnosisPage.bringToFront()
//       await gnosisPage.waitForXPath(setting_owners.pending_status)
//       await gFunc.clickSomething(setting_owners.pending_status, gnosisPage)
//       await gnosisPage.waitForXPath("//div[contains(text(),'Executor')]")
//       await gFunc.assertAllElementPresent([
//         setting_owners.remove_owner_title,
//         setting_owners.removed_owner_name(new_owner_name),
//         setting_owners.removed_owner_address(new_owner_address),
//         setting_owners.changed_req_conf_title,
//         setting_owners.new_changed_req_conf,
//       ], gnosisPage)
//       await gFunc.clickSomething(setting_owners.settings_tab, gnosisPage)
//       await gFunc.clickSomething(setting_owners.owners_tab, gnosisPage)
//       await gnosisPage.waitForXPath(`//div[5]//div[3]/p[contains(text(),'${owners_current_amount}')]`)
//       owner_rows_amount = await gFunc.amountOfElements(setting_owners.owner_table, gnosisPage)
//       expect(owner_rows_amount).toBe(owners_current_amount)
//       done()
//     } catch (error) {
//       console.log(error)
//       done(error)
//     }
//   }, 90000)
})
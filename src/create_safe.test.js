import * as gFunc from '../utils/selectorsHelpers'
import { sels } from '../utils/selectors'
import { accountsSelectors } from '../utils/selectors/accounts'
import { createSafePage } from '../utils/selectors/createSafePage'
import { generalInterface } from '../utils/selectors/generalInterface'
import { initWithWalletConnected } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await initWithWalletConnected()
}, 60000)

afterAll(async () => {
  await gnosisPage.waitForTimeout(2000)
  await browser.close()
})

describe.skip('Create New Safe', () => {
  const errorMsg = sels.errorMsg

  let rows_amount = ''
  const new_safe_name = accountsSelectors.safeNames.create_safe_name
  const owner_2_name = accountsSelectors.accountNames.owner2_name
  const owner_2_address = accountsSelectors.testAccountsHash.acc2
  test('Open Create Safe Form', async () => {
    console.log('Open Create Safe Form\n')
    // console.log('Waiting')
    // await gFunc.waitFor(2000)
    // console.log('Done Waiting')
    await gFunc.clickByText('p', '+ Create New Safe', gnosisPage)
    await gFunc.assertElementPresent(createSafePage.form, gnosisPage, 'css')
  }, 60000)
  test('Naming The Safe', async () => {
    console.log('Naming The Safe\n')
    await gFunc.clickElement(generalInterface.submit_btn, gnosisPage) // click with empty safe field
    await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) // check error message
    await gFunc.clickAndType({ selector: createSafePage.safe_name_field, type: 'css' }, gnosisPage, new_safe_name)
    await gFunc.clickElement(generalInterface.submit_btn, gnosisPage)
  }, 60000)
  test('Adding Owners', async() => {
    console.log('Adding Owners\n')
    await gFunc.assertElementPresent(createSafePage.step_two, gnosisPage, 'css')
    await gFunc.clickElement({ selector: createSafePage.add_owner_btn }, gnosisPage) // adding new row
    await gnosisPage.waitFor(1000)
    await gFunc.clickElement(generalInterface.submit_btn, gnosisPage) // making "Required error" show up for the new owner fields
    await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) // check first "required" error in name field
    await gFunc.clickAndType({ selector: createSafePage.owner_name_field(1), type: 'css' }, gnosisPage, owner_2_name) // filling name field
    await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) // checking "required" error in address field
    await gFunc.clickAndType(createSafePage.address_field(1), gnosisPage, owner_2_address, 'css')
    await gFunc.assertElementPresent(createSafePage.valid_address(1), gnosisPage, 'css')
    rows_amount = await gnosisPage.$$eval(createSafePage.owner_row, x => x.length) // see how many owner I've created
    await gFunc.assertElementPresent(createSafePage.req_conf_limit(rows_amount), gnosisPage, 'css') // that amount should be in the text "out of X owners"
  }, 60000)
  test('Setting Required Confirmation', async () => {
    console.log('Setting Required Confirmation')
    await gFunc.clickElement({ selector: createSafePage.threshold_select_input }, gnosisPage)
    await gFunc.clickElement({ selector: createSafePage.select_input(rows_amount) }, gnosisPage)
    await gnosisPage.waitFor(2000) // gotta wait before clickin review_btn or doesn't work
    await gFunc.clickElement(generalInterface.submit_btn, gnosisPage)
  }, 60000)
  test('Reviewing Safe Info', async () => {
    console.log('Reviewing Safe Info\n')
    await gFunc.assertElementPresent(createSafePage.step_three, gnosisPage, 'css')
    await gFunc.assertTextPresent(createSafePage.review_safe_name, gnosisPage, new_safe_name, 'css')
    await gFunc.assertElementPresent(createSafePage.review_req_conf(rows_amount), gnosisPage, 'css')
    await gFunc.assertTextPresent(createSafePage.review_owner_name(1), gnosisPage, owner_2_name, 'css')
    await gFunc.assertTextPresent(createSafePage.review_owner_address(1), gnosisPage, owner_2_address, 'css')
    await gFunc.clickElement(generalInterface.submit_btn, gnosisPage)
    await MMpage.bringToFront()
    await MMpage.waitFor(2000)
    await metamask.confirmTransaction()
  }, 60000)
  test('Assert Safe Creation', async () => {
    console.log('Assert Safe Creation\n')
    await gnosisPage.bringToFront()
    await gFunc.assertElementPresent(createSafePage.back_btn, gnosisPage, 'css')
    await gFunc.assertElementPresent(createSafePage.etherscan_link, gnosisPage, 'css')
    await gFunc.assertElementPresent(createSafePage.continue_btn, gnosisPage, 'css')
    await gFunc.clickElement({ selector: createSafePage.continue_btn }, gnosisPage)
    await gFunc.isTextPresent(generalInterface.sidebar, accountsSelectors.safeNames.create_safe_name, gnosisPage)

    // await gFunc.assertElementPresent(generalInterface.show_qr_btn.selector, gnosisPage, "css")
    // await gFunc.clickElement(generalInterface.show_qr_btn, gnosisPage)
    // await gFunc.assertAllElementPresent([
    //     generalInterface.receiver_modal_safe_name,
    //     generalInterface.receiver_modal_safe_address
    // ], gnosisPage, "css")
    // const safeName = await gFunc.getInnerText(generalInterface.receiver_modal_safe_name, gnosisPage, "css")
    // expect(safeName).toMatch(new_safe_name)

    // // save the address in a file for manual use later if needed
    // const safeAddress = await gFunc.getInnerText(generalInterface.receiver_modal_safe_address, gnosisPage, "css")
    // const save_text = "safe : " + safeAddress + "\n"
    // fs.appendFile("./createdSafes/safes.txt", save_text, function(err){
    //     if (err) {
    //         fs.writeFile("./createdSafes/safes.txt", save_text,{flag: 'wx'}, function(err){
    //             if (err) console.log("\nFile already exist\n");
    //         })
    //     };
    // })
  }, 180000)
})

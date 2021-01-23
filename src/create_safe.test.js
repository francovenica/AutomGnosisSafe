import fs from 'fs'
import * as gFunc from '../utils/global_func'
import { sels } from '../utils/selectors'
import { walletConnect } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await walletConnect()
}, 60000)

afterAll(async () => {
  await gnosisPage.waitFor(2000)
  await browser.close()
})

describe('Create New Safe', () => {
  const homepage = sels.xpSelectors.homepage
  const create_safe = sels.xpSelectors.create_safe
  const errorMsg = sels.errorMsg
  test('Open Create Safe Form', async () => {
    console.log('Open Create Safe Form\n')
    await gFunc.assertElementPresent(homepage.home_btn, gnosisPage, 'css')
    await gFunc.clickSomething(homepage.home_btn, gnosisPage)
    await gFunc.clickSomething(homepage.create_safe_btn, gnosisPage)
    await gFunc.assertElementPresent(sels.cssSelectors.create_safe_name_input, gnosisPage, 'css')
  }, 60000)
  test('Naming The Safe', async () => {
    console.log('Naming The Safe\n')
    await gFunc.clickSomething(create_safe.start_btn, gnosisPage)
    await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage)
    await gFunc.clickAndType(sels.cssSelectors.create_safe_name_input, gnosisPage, sels.safeNames.create_safe_name, 'css')
    await gFunc.clickSomething(create_safe.start_btn, gnosisPage)
  }, 60000)
  test('Adding Owners', async () => {
    console.log('Adding Owners\n')
    await gFunc.assertElementPresent(create_safe.add_owner, gnosisPage)
    await gFunc.clickSomething(create_safe.add_owner, gnosisPage)
    await gFunc.clickSomething(create_safe.review_btn, gnosisPage)
    await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage)
    await gFunc.clickAndType(create_safe.second_owner_name_input, gnosisPage, sels.accountNames.owner2_name)
    await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage)
    await gFunc.clickAndType(create_safe.second_owner_address_input, gnosisPage, sels.testAccountsHash.acc2)
    const req_conf_limit = await gFunc.getNumberInString(create_safe.req_conf_info_text, gnosisPage)
    const owner_rows = await gnosisPage.$x(create_safe.current_rows)
    expect(req_conf_limit).toBe(owner_rows.length)
  }, 30000)
  test('Setting Required Confirmation', async () => {
    console.log('Setting Required Confirmation')
    await gFunc.openDropdown(sels.cssSelectors.req_conf_dropdown, gnosisPage, 'css')
    await gFunc.clickSomething(sels.cssSelectors.req_conf_value_2, gnosisPage, 'css')
    await gnosisPage.waitFor(2000)
    await gFunc.clickSomething(create_safe.review_btn, gnosisPage)
  }, 30000)
  test('Reviewing Safe Info', async () => {
    console.log('Reviewing Safe Info\n')
    await gnosisPage.waitFor(2000)
    await gFunc.clickSomething(create_safe.submit_btn, gnosisPage)
    await gnosisPage.waitFor(2000)
    await metamask.confirmTransaction()
    await MMpage.waitFor(1000)
  }, 30000)
  test('Assert Safe Creation', async () => {
    console.log('Assert Safe Creation\n')
    await gnosisPage.bringToFront()
    await gnosisPage.waitForXPath(create_safe.continue_btn)
    await gFunc.clickSomething(create_safe.continue_btn, gnosisPage)
    await gnosisPage.waitForNavigation({ waitUntil: 'domcontentloaded' })
    await gnosisPage.waitForSelector(sels.cssSelectors.safe_name_heading)
    const safeName = await gFunc.getInnerText(sels.cssSelectors.safe_name_heading, gnosisPage, 'css')
    expect(safeName).toMatch(sels.safeNames.create_safe_name)
    expect(sels.xpSelectors.safe_hub.safe_address).toBeTruthy()

    // save the address in a file for manual use later if needed
    const safe_adrs = await gFunc.getInnerText(sels.xpSelectors.safe_hub.safe_address, gnosisPage)
    const save_text = 'safe : ' + safe_adrs + '\n'
    fs.appendFile('./createdSafes/safes.txt', save_text, function (err) {
      if (err) {
        fs.writeFile('./createdSafes/safes.txt', save_text, { flag: 'wx' }, function (err) {
          if (err) console.log('\nAlready exist\n')
        })
      };
    })
  }, 60000)
})

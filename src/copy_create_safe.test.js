const fs = require('fs')
import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { walletConnect } from "../utils/testSetup"

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await walletConnect()
}, 60000)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Create New Safe", () =>{
    const errorMsg = sels.errorMsg
    const welcomePage = sels.testIdSelectors.welcome_page
    const createPage = sels.testIdSelectors.create_safe_page
    const mainHub = sels.testIdSelectors.main_hub

    let rows_amount = ""
    const new_safe_name = sels.safeNames.create_safe_name
    const owner_2_name = sels.accountNames.owner2_name
    const owner_2_address = sels.testAccountsHash.acc2
    test("Open Create Safe Form", async ()=>{
        console.log("Open Create Safe Form\n")
        await gFunc.assertElementPresent(welcomePage.create_safe_btn, gnosisPage, "css")
        await gFunc.clickElement(welcomePage.create_safe_btn, gnosisPage)
        await gFunc.assertElementPresent(createPage.form, gnosisPage, "css")
    },  60000)
    test("Naming The Safe", async () =>{
        console.log("Naming The Safe\n")
        await gFunc.clickElement(createPage.submit_btn, gnosisPage) //click with empty safe field
        await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) //check error message        
        await gFunc.clickAndType(createPage.safe_name_field, gnosisPage, new_safe_name, "css")
        await gFunc.clickElement(createPage.submit_btn, gnosisPage)
    },  60000)
    test("Adding Owners", async() =>{
        console.log("Adding Owners\n")
        await gFunc.assertElementPresent(createPage.step_two, gnosisPage, "css")
        await gFunc.clickElement(createPage.add_owner_btn, gnosisPage) //adding new row
        await gnosisPage.waitFor(1000)
        await gFunc.clickElement(createPage.submit_btn, gnosisPage) //making "Required error" show up for the new owner fields
        await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) //check first "required" error in name field
        await gFunc.clickAndType(createPage.owner_name_field(1), gnosisPage, owner_2_name,  "css") //filling name field
        await gFunc.assertElementPresent(errorMsg.error(errorMsg.required), gnosisPage) //checking "required" error in address field
        await gFunc.clickAndType(createPage.address_field(1), gnosisPage, owner_2_address, "css")
        await gFunc.assertElementPresent(createPage.valid_address(1), gnosisPage, "css")
        rows_amount = await gnosisPage.$$eval(createPage.owner_row, x=>x.length) //see how many owner I've created
        await gFunc.assertElementPresent(createPage.req_conf_limit(rows_amount), gnosisPage, "css") //that amount should be in the text "out of X owners"
    },  60000);
    test("Setting Required Confirmation", async () => {
        console.log("Setting Required Confirmation")
        await gFunc.clickElement(createPage.threshold_select_input, gnosisPage)
        await gFunc.clickElement(createPage.select_input(rows_amount), gnosisPage)
        await gnosisPage.waitFor(2000) //gotta wait before clickin review_btn or doesn't work
        await gFunc.clickElement(createPage.submit_btn, gnosisPage) 
    },  60000);
    test("Reviewing Safe Info", async () => {
        console.log("Reviewing Safe Info\n")
        await gFunc.assertElementPresent(createPage.step_three, gnosisPage, "css")
        await gFunc.assertTextPresent(createPage.review_safe_name, gnosisPage, new_safe_name, "css")
        await gFunc.assertElementPresent(createPage.review_req_conf(rows_amount), gnosisPage, "css")
        await gFunc.assertTextPresent(createPage.review_owner_name(1), gnosisPage, owner_2_name, "css")
        await gFunc.assertTextPresent(createPage.review_owner_address(1), gnosisPage, owner_2_address, "css")
        await gFunc.clickElement(createPage.submit_btn, gnosisPage)
        await MMpage.bringToFront()
        await MMpage.waitFor(2000)
        await metamask.confirmTransaction()
    },  60000)
    test("Assert Safe Creation", async () => {
        console.log("Assert Safe Creation\n")
        await gnosisPage.bringToFront()
        await gFunc.assertElementPresent(createPage.back_btn,gnosisPage, "css")
        await gFunc.assertElementPresent(createPage.etherscan_link,gnosisPage, "css")
        await gFunc.assertElementPresent(createPage.continue_btn,gnosisPage, "css")
        await gFunc.clickElement(createPage.continue_btn, gnosisPage)
        await gFunc.assertElementPresent(mainHub.show_qr_btn, gnosisPage, "css")
        await gFunc.clickElement(mainHub.show_qr_btn, gnosisPage)
        await gFunc.assertAllElementPresent([
            mainHub.receiver_modal_safe_name,
            mainHub.receiver_modal_safe_address
        ], gnosisPage, "css")
        const safeName = await gFunc.getInnerText(mainHub.receiver_modal_safe_name, gnosisPage, "css")
        expect(safeName).toMatch(new_safe_name)
        
        // save the address in a file for manual use later if needed
        const safeAddress = await gFunc.getInnerText(mainHub.receiver_modal_safe_address, gnosisPage, "css")
        const save_text = "safe : " + safeAddress + "\n"
        fs.appendFile("./createdSafes/safes.txt", save_text, function(err){
            if (err) {
                fs.writeFile("./createdSafes/safes.txt", save_text,{flag: 'wx'}, function(err){
                    if (err) console.log("\nFile already exist\n");
                })
            };
        })
    },  180000);
})

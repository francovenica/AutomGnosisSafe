const puppeteer = require('puppeteer');
const { TIME, ENVIRONMENT, SLOWMO } = require('../utils/config').default
const fs = require('fs')
import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"

let browser
let gnosisPage
let authPage

beforeAll(async () => {
        browser = await puppeteer.launch({
            defaultViewport:null,
            slowMo: SLOWMO,
            headless: true,
            args: ['--start-maximized', ENVIRONMENT.rinkeby],
            handleSIGINT: false,
        });
        authPage = await browser.newPage();
        await authPage.goto('https://rinkeby.authereum.com/login');
        [gnosisPage] = await browser.pages()
}, "60000")

  afterAll(async () => {
    await browser.close();
  });

test('Login in Authereum', async () => {
    console.log("Login in Authereum")
    await authPage.waitFor('input[placeholder="Enter username"]')  
    const username = await authPage.$x('//input[@placeholder="Enter username"]')
    await username[0].click()
    await username[0].type("francoaltoros")
    const password = await authPage.$x('//input[@placeholder="Enter password"]')
    await password[0].click()
    await password[0].type("password")
    const singIn = await authPage.$x('//span[contains(text(),"Sign in")]/parent::button')
    await singIn[0].click()
    const sendBtn = await authPage.waitForXPath('//span[contains(text(),"Send")]/ancestor::button');
    expect(sendBtn).toBeDefined()
    authPage.close()
}, "30000")
test('Login in Gnosis', async () =>{
    console.log("Login in gnosis")
    await gnosisPage.waitForXPath("//span[contains(text(),'Accept All')]/parent::a")
    const cookies = (await gnosisPage.$x("//span[contains(text(),'Accept All')]/parent::a"))[0]
    await cookies.click()
    await gnosisPage.waitForXPath("//span[contains(text(),'Connect')]/parent::button")
    const connect = (await gnosisPage.$x("//span[contains(text(),'Connect')]/parent::button"))[0]
    await connect.click()
    await gnosisPage.waitForXPath("//div[contains(text(),'Authereum')]/parent::div")
    const authereum = (await gnosisPage.$x("//div[contains(text(),'Authereum')]/parent::div"))[0]
    await authereum.click()
    await gnosisPage.waitFor(2000)
    const authConnect = (await browser.pages())[1]
    await authConnect.waitForXPath("//span[contains(text(),'Log in')]/parent::button")
    const logInAuth = (await authConnect.$x("//span[contains(text(),'Log in')]/parent::button"))[0]
    await logInAuth.click()
    await authConnect.screenshot({path: "after signing in authereum"})
    await authConnect.waitFor(4000)
    try {
        await authConnect.close()
    } catch (error) {}
    await gnosisPage.waitForXPath("//span[contains(text(),'Connect')]/parent::button")
    await connect.click()
    await gnosisPage.waitForXPath("//div[contains(text(),'Authereum')]/parent::div")
    await authereum.click()
    await gnosisPage.waitForXPath("//div[contains(text(),'Create new Safe')]/ancestor::a")
    const create = (await gnosisPage.$x("//div[contains(text(),'Create new Safe')]/ancestor::a"))[0]
    await create.click()
}, "30000")

const create_safe = sels.xpSelectors.create_safe

test("Naming The Safe", async (done) =>{
    console.log("Naming The Safe\n")
    await gnosisPage.waitForSelector(sels.cssSelectors.create_safe_name_input)
    await gnosisPage.screenshot({path: '1 Naming The Safe.png'});
    const textInp = await gnosisPage.$(sels.cssSelectors.create_safe_name_input);
    //await gnosisPage.evaluate(x=>x.click(), textInp)
    await gnosisPage.type(sels.cssSelectors.create_safe_name_input, sels.safeNames.create_safe_name)
    const text = await gnosisPage.$eval(sels.cssSelectors.create_safe_name_input, x=>x.value)
    await gnosisPage.screenshot({path: '2 Naming The Safe.png'});
    console.log("Texto escrito = ", text)
    try{
        expect(text).toMatch(sels.safeNames.create_safe_name)
    }catch(e){
        done(e)
    }
    await gnosisPage.waitForXPath(create_safe.start_btn);
    const strBtn = (await gnosisPage.$x(create_safe.start_btn))[0]
    await strBtn.click()
    await gnosisPage.waitForXPath("//p[contains(text(),'Your Safe will have')]")
    const infoText = await gnosisPage.evaluate(
            x=>x.innerText, 
            (await gnosisPage.$x("//p[contains(text(),'Your Safe will have')]"))[0]
        )
    try{
        expect(infoText).toMatch("Your Safe will have")
        await gnosisPage.screenshot({path: '3 Naming The Safe.png'});
        done()
    }catch(e){
        await gnosisPage.screenshot({path: '3 Naming The Safe.png'});
        done(e)
    }
    // await gFunc.clickSomething(create_safe.start_btn, gnosisPage)
    // await gFunc.assertTextPresent(create_safe.required_error_input, gnosisPage, 'Required')
    // await gFunc.clickAndType(sels.cssSelectors.create_safe_name_input, gnosisPage, sels.safeNames.create_safe_name, "css")
    // await gFunc.clickSomething(create_safe.start_btn, gnosisPage)
},  TIME.T60)
test("Adding Owners", async (done) =>{
    console.log("Adding Owners\n")
    await gFunc.assertElementPresent(create_safe.add_owner, gnosisPage)
    await gFunc.clickSomething(create_safe.add_owner, gnosisPage)
    try {
        const rows = (await gnosisPage.$x("//div/div[1]/div[5]/div")).length
        expect(rows).toBe(2)
        done()
    } catch (error) {
        done(error)
    }
//     await gFunc.clickSomething(create_safe.review_btn, gnosisPage)
//     await gFunc.assertTextPresent(create_safe.required_error_input, gnosisPage, 'Required')
//     // await gnosisPage.screenshot({path: '4Adding Owners.png'});
//     await gFunc.clickAndType(create_safe.second_owner_name_input, gnosisPage, sels.accountNames.owner2_name)
//     await gFunc.assertTextPresent(create_safe.required_error_input, gnosisPage, 'Required')
//     await gFunc.clickAndType(create_safe.second_owner_address_input, gnosisPage, sels.testAccountsHash.acc2)
//     const req_conf_limit = await gFunc.getNumberInString(create_safe.req_conf_info_text, gnosisPage)
//     const owner_rows = await gnosisPage.$x(create_safe.current_rows)
//     expect(req_conf_limit).toBe(owner_rows.length)
//     // await gnosisPage.screenshot({path: '5Adding Owners.png'});
},  TIME.T60);
// test("Setting Required Confirmation", async () => {
//     await gnosisPage.screenshot({path: '6Setting Required Confirmation.png'});
//     try {
//         console.log("Setting Required Confirmation")
//         await gFunc.clickSomething(sels.cssSelectors.req_conf_dropdown, gnosisPage, "css")
//         await gFunc.clickSomething(sels.cssSelectors.req_conf_value_2, gnosisPage, "css")
//         await gnosisPage.screenshot({path: '7Setting Required Confirmation.png'});
//         await gnosisPage.waitFor(2000);
//         await gFunc.clickSomething(create_safe.review_btn, gnosisPage)    
    
//     } catch (error) {
//         console.log("Error Setting Required Confirmation= " , error)
//     }
//     await gnosisPage.screenshot({path: '8Setting Required Confirmation.png'});
// },  TIME.T30);
// test("Reviewing Safe Info", async () => {
//     await gnosisPage.screenshot({path: '9Reviewing Safe Info.png'});
//     try {
//         console.log("Reviewing Safe Info\n")
//         await gnosisPage.waitFor(2000)
//         await gFunc.clickSomething(create_safe.submit_btn,gnosisPage)
//         await gnosisPage.waitFor(2000)
//     } catch (error) {
//         console.log("Error Reviewing Safe Info = " , error)
//     }
//     await gnosisPage.screenshot({path: '10Reviewing Safe Info.png'});
// },  TIME.T30)
// test("Assert Safe Creation", async () => {
//     await gnosisPage.screenshot({path: '11Assert Safe Creation.png'});
//     try {
//         console.log("Assert Safe Creation\n")
//         await gnosisPage.bringToFront()
//         await gnosisPage.waitForSelector(sels.cssSelectors.safe_name_heading);
//         const safeName = await gFunc.getInnerText(sels.cssSelectors.safe_name_heading, gnosisPage, "css")
//         expect(safeName).toMatch(sels.safeNames.create_safe_name)
//         expect(sels.xpSelectors.safe_hub.safe_address).toBeTruthy()
        
//         save the address in a file for manual use later if needed
//         const safe_adrs = await gFunc.getInnerText(sels.xpSelectors.safe_hub.safe_address, gnosisPage)
//         const save_text = "safe : " + safe_adrs + "\n"
//         fs.writeFile("./createdSafes/safes.txt", save_text,{flag: 'wx'}, function(err){
//             if (err) console.log("\nAlready exist\n");
//         })
//         fs.appendFile("./createdSafes/safes.txt", save_text, function(err){
//             if (err) throw err;
//         })
    
//     } catch (error) {
//         console.log("Error Assert Safe Creation = " , error)
//     }
//     await gnosisPage.screenshot({path: '12Assert Safe Creation.png'});
// },  TIME.T60);

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
        [gnosisPage] = await browser.pages()
}, "60000")

//   afterAll(async () => {
//     await browser.close();
//   });

describe("algo", () =>{
    test("test1", async (done)=>{
        try {
            console.log("Enter in settings and open Replace Owner form")
            let variable
            let value = true
            try {
                await gnosisPage.waitForXPath("//span[contains(text(),'Connect')]", {timeout:8000})
            } catch (error) {
                console.log("no lo encontre")
                value = false
            }
            if (value) console.log("Lo encontre!!!")
            console.log("\n\nvalue = ", value)
            done()
        } catch (error) {
            done(error)
        }
    }, 70000)
})
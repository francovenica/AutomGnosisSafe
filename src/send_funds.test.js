const { TIME } = require('../utils/config').default
import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { load_wallet } from "../utils/testSetup"

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await load_wallet(true)
}, TIME.T60)

// afterAll(async () => {
//     await gnosisPage.waitFor(2000)
//     await browser.close();
// })

describe("Send Funds", ()=>{
    test("Importing Account", async () => {
        console.log("Importing Account\n")
    })
});

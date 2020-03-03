const { TIME } = require('../utils/config').default
import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { load_wallet } from "../utils/testSetup"
import { connect } from "puppeteer";

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await load_wallet(true)
}, TIME.T60)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Change Policies", ()=>{
    test("Create Tx changing the Policies from 3 to 1 signatures", async (done) => {
    try {

        done()
    } catch (error) {
        done(error)
    }
    })
    test("Signing with owner 2", async (done) => {
        try {
    
            done()
        } catch (error) {
            done(error)
        }
    })
    test("Signing and executing with owner 3", async (done) => {
        try {
    
            done()
        } catch (error) {
            done(error)
        }
    })
    test("Verifying the change in the settings", async (done) => {
        try {
    
            done()
        } catch (error) {
            done(error)
        }
    })
    test("Create Tx to revert it back to initial state", async (done) => {
        try {
    
            done()
        } catch (error) {
            done(error)
        }
    })
    test("Verifying the rollback", async (done) => {
        try {
    
            done()
        } catch (error) {
            done(error)
        }
    })
})
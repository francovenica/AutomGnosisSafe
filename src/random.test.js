const puppeteer = require('puppeteer');

test("algo", async =>{
    puppeteer.launch({headless: false,
      args: ['--start-maximized', "http://example.com/"]
    }).then(async browser => {
        const [page] = await browser.pages();
        await page.waitForXPath("/html/body/div/h1", {timeout:60000})
        const selec = await page.$x("/html/body/div/h1")
        //const watchDog = page.waitForFunction('document.querySelector("body > div > h1").innerText != "Example Domain"');
        const watchDog = page.waitForXPath("//div/h1[contains(text(),'Example Doain')]", {timeout:90000})
        await watchDog;
        console.log("llegue")
      });
}, 90000)
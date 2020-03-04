const puppeteer = require('puppeteer');

test("algo", async =>{
    puppeteer.launch({headless: false}).then(async browser => {
        const page = await browser.newPage();
        const watchDog = page.waitForFunction('window.innerWidth < 350');
        await page.setViewport({width: 400, height: 50});
        await watchDog;
        console.log("llegue")
      });
})

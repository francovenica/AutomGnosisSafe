const puppeteer = require('puppeteer');

test("Test name", async(done) => {

    console.log("Test name")
    try{
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('https://example.com', {waitUntil: 'networkidle2'});
        console.log('Done loading')
        await page.waitFor(2000);
        // const handle = await page.evaluate(() => {
        //     [...document.querySelectorAll('a')].find(element => element.textContent === 'More information...').click();
        // });
        await page.$$eval('a', selectorMatched => {
            for(i in selectorMatched)
              if(selectorMatched[i].textContent === 'More information...'){
                  selectorMatched[i].click();
                  break;//Remove this line (break statement) if you want to click on all matched elements otherwise the first element only is clicked  
                }
            });
        await page.waitFor(100000);
    done()
    }
    catch (error){
    console.log(error)
    done()
}
}, 60000)

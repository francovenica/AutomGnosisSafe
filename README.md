# AutomGnosisSafe
### Puppeteer+Dappeteer+Jest to test an application with the Metamask extension

#### Get set:

1.Clone the proyect

2.Run "yarn" to download the dependencies and chromium. Puppeteer, dappeteer, jest will be downloaded.

#### To Run:
Note: This was done in Windows, but I think nothing is exclusive to Windows so it should work in Linux and iOS just fine. Let me know!

Write in the command prompt  `yarn test`  to run every {FILE_NAME}.test.js in the /src folder

Write  `yarn test file_name`  it will look for the {file_name}.test.js in the /src folder and only run that test.


#### More Notes: 
* Tests may fail if the site or MetaMask load too slow for any reason.

* The run is done in "headed" mode, since it has to load the MetaMask exension into chromium. So far it seems that there is no way to run it headless with MetaMask

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");

export const submitCodeforcesSolution = async ({
  problemCode,
  codeFilePath,
  language,
  chromeProfilePath,
  chromeDriverPath,
}) => {
  let part1 = "";
  let part2 = "";
  let i = 0;
  while (i < problemCode.length && !isNaN(problemCode[i])) {
    part1 += problemCode[i];
    i++;
  }
  part2 = problemCode.slice(i);
  const problemUrl = `https://codeforces.com/problemset/problem/${part1}/${part2}`;

  console.log(`Problem URL: ${problemUrl}`);
  const absolutePathToCodeFile = path.resolve(codeFilePath);
  console.log(`Path to code file: ${absolutePathToCodeFile}`);

  // Set up Chrome options
  let options = new chrome.Options();
  options.addArguments(`user-data-dir=${chromeProfilePath}`);

  // Build the WebDriver instance
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Open the problem URL
    await driver.get(problemUrl);

    // Wait for the page to load and locate the elements
    await driver.wait(until.elementLocated(By.name("sourceFile")), 10000);

    // Execute JavaScript to select the desired language
    const selectLanguageScript = `
      var options = document.getElementsByTagName('option');
      for (var i = 0; i < options.length; i++) {
        if (options[i].innerHTML == arguments[0]) {
          options[i].setAttribute('selected', 'selected');
        }
      }
    `;
    await driver.executeScript(selectLanguageScript, language);

    // Upload the code file
    let fileInput = await driver.findElement(By.name("sourceFile"));
    await fileInput.sendKeys(absolutePathToCodeFile);

    // Submit the form
    let submitButton = await driver.findElement(
      By.xpath("//input[@value='Submit']")
    );
    await submitButton.click();

    console.log("Code submitted successfully!");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Close the WebDriver instance
    await driver.quit();
  }
};

export default submitCodeforcesSolution;

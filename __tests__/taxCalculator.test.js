// Import necessary functions and libraries
const puppeteer = require('puppeteer');
const { test, expect } = require('@jest/globals');

// Define test cases
describe('Tax Calculator App', () => {
  let browser;
  let page;

  // Launch browser and navigate to the app before each test
  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('YOUR_APP_URL_HERE');
  });

  // Close the browser after each test
  afterEach(async () => {
    await browser.close();
  });

  // Test 1: Input Validation Test
  test('Input Validation Test', async () => {
    // Enter invalid characters in input fields
    await page.type('#grossIncome', 'abc');
    await page.type('#extraIncome', 'def');
    await page.type('#age', 'xyz');
    await page.type('#deductions', 'ghi');

    // Click the submit button
    await page.click('#submitBtn');

    // Assert that error messages appear for each invalid input
    expect(await page.$eval('.invalid-feedback', el => el.textContent.trim())).toBeTruthy();

    // Assert that error icons appear next to the input fields with invalid entries
    const errorIcons = await page.$$('.error-icon');
    expect(errorIcons.length).toBe(4);
  });

  // Test 2: Form Submission Test
  test('Form Submission Test', async () => {
    // Enter valid numeric values in all input fields
    await page.type('#grossIncome', '50000');
    await page.type('#extraIncome', '10000');
    await page.type('#age', '35');
    await page.type('#deductions', '5000');

    // Click the submit button
    await page.click('#submitBtn');

    // Assert that the modal appears displaying tax details
    const modalContent = await page.$eval('.modal-body', el => el.textContent.trim());
    expect(modalContent).toBeTruthy();

    // Close the modal
    await page.click('.btn-primary');
  });

  // Test 3: Tooltip Test
  test('Tooltip Test', async () => {
    // Hover over "?" icons
    await page.hover('.tooltip-icon');

    // Assert that tooltips appear explaining the meaning of each input field
    const tooltips = await page.$$('.tooltip-inner');
    expect(tooltips.length).toBe(4);

    // Hover over error icons
    await page.hover('.error-icon');

    // Assert that tooltips appear indicating that only numbers are allowed
    const errorTooltips = await page.$$('.tooltip-inner');
    expect(errorTooltips.length).toBe(4);
  });

  // Test 4: Error Icon Test
  test('Error Icon Test', async () => {
    // Enter invalid characters in input fields
    await page.type('#grossIncome', 'abc');
    await page.type('#extraIncome', 'def');
    await page.type('#age', 'xyz');
    await page.type('#deductions', 'ghi');

    // Assert that error icons appear next to each input field with an invalid entry
    const errorIcons = await page.$$('.error-icon');
    expect(errorIcons.length).toBe(4);

    // Correct the entries to valid numeric values
    await page.$eval('#grossIncome', el => el.value = '');
    await page.type('#grossIncome', '50000');

    // Assert that the error icons disappear once valid entries are made
    const errorIconsAfterCorrection = await page.$$('.error-icon');
    expect(errorIconsAfterCorrection.length).toBe(0);
  });

  // Test 5: Modal Close Test
  test('Modal Close Test', async () => {
    // Click the submit button
    await page.click('#submitBtn');

    // Assert that the modal displays the tax details
    const modalContent = await page.$eval('.modal-body', el => el.textContent.trim());
    expect(modalContent).toBeTruthy();

    // Close the modal
    await page.click('.btn-primary');

    // Assert that the modal closes without any errors
    const modalExists = await page.$('.modal');
    expect(modalExists).toBeFalsy();
  });
});

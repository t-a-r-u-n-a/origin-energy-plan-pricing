import { test, expect } from '@playwright/test';
import { PricingPage } from '../pages/pricingPage';
import { PlansPage } from '../pages/plansPage';
import fs from 'fs/promises';
import path from 'path';

const pdfParse = require('pdf-parse');

const ADDRESS = '17 Bolinda Road, Balwyn North, VIC 3104';

test.describe('Origin Energy - Pricing / Plan PDF', () => {
  test('Navigate to Origin Energy Pricing, search address, open plan and download PDF to verify Gas plan', async ({ page }) => {
    const pricing = new PricingPage(page);
    await pricing.goto();

    await test.step('Search for address and select', async () => {
      await pricing.searchAddress(ADDRESS);
      await pricing.selectAddressFromSuggestions();
    });

    const plans = new PlansPage(page);
    await test.step('Verify plans are displayed', async () => {
      await plans.waitForPlansList();
      await plans.plansAreDisplayed();
    });

    await test.step('Uncheck Electricity and verify plans are still displayed', async () => {
      await plans.uncheckElectricity();
      await plans.plansAreDisplayed();
    });

    await test.step('Open plan details in new tab, download plan PDF and assert it is a Gas plan', async () => {
      const link = await plans.firstPlanLinkInBPIDColumn();

      // Download destination
      const downloadsDir = path.join(process.cwd(), 'test-downloads', 'plans');
      await fs.mkdir(downloadsDir, { recursive: true });
      const savePath = path.join(downloadsDir, 'plan.pdf');

      let pdfBuffer: Buffer;

      // Fetch href and download PDF
      const href = await link.getAttribute('href');
      if (href) {
        const pdfUrl = new URL(href, page.url()).toString();
        const response = await page.request.get(pdfUrl);
        expect(response.ok()).toBeTruthy();
        const contentType = (response.headers()['content-type'] || '').toLowerCase();

        if (contentType.includes('pdf')) {
          pdfBuffer = await response.body();
          await fs.writeFile(savePath, pdfBuffer);
        } else {
          // manual try to get PDF from new page
          const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),
            link.click(),
          ]);
          await newPage.waitForLoadState('domcontentloaded');

          // Try Ctrl+S to trigger download
          try {
            const [download] = await Promise.all([
              newPage.waitForEvent('download', { timeout: 10000 }),
              newPage.keyboard.press('Control+S'), 
            ]);
            await download.saveAs(savePath);
            pdfBuffer = await fs.readFile(savePath);
          } catch (err) {
            // Fallback
            const resp2 = await page.request.get(newPage.url());
            expect(resp2.ok()).toBeTruthy();
            pdfBuffer = await resp2.body();
            await fs.writeFile(savePath, pdfBuffer);
          }
        }
      } else {
        // Wait for a download event
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          link.click(),
        ]);
        await download.saveAs(savePath);
        pdfBuffer = await fs.readFile(savePath);
      }

      // Parse PDF and assert it contains "Gas"
      const data = await pdfParse(pdfBuffer);
      expect(data.text).toMatch(/gas/i);
    });
  });
});


import { Page, expect, Locator } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

export class PlansPage {
  readonly page: Page;
  readonly plansTableRows;
  readonly plansTable;
  readonly electricityCheckbox;
  readonly searchResults;
  readonly planBPIDLink;

  constructor(page: Page) {
    this.page = page;
    this.plansTableRows = page.locator('(//div[@data-id = "searchResultsContainer"]//table)[1]/tr');
    this.plansTable = page.locator('table');
    this.electricityCheckbox = page.locator('(//input[@name = "elc-checkbox"])[1]');
    this.searchResults = page.locator('//div[@data-id = "searchResultsContainer"]');
    this.planBPIDLink = page.locator('((//div[@data-id = "searchResultsContainer"]//table)[1]/tr)[1]/td[3]/span/a');
  }

  async waitForPlansList() {
    // Wait for the plan table to be visible
    await Promise.any([
      this.searchResults.waitFor({ state: 'visible', timeout: 20000 }),
      this.plansTable.waitFor({ state: 'visible', timeout: 1000 }),
    ]);
    // Ensure at least one plan row is present
    expect(await this.plansTableRows.count()).toBeGreaterThan(0);
  }

  async uncheckElectricity() {
    if (await this.electricityCheckbox.isChecked()) {
      await this.electricityCheckbox.uncheck();
    }
  }

  async plansAreDisplayed() {
    await expect(this.plansTable.first()).toBeVisible({ timeout: 5000 });
  }

  async firstPlanLinkInBPIDColumn() {
    const link = this.planBPIDLink;
    await expect(link).toBeVisible({ timeout: 5000 });
    return link;
  }

  async downloadPdf(link: Locator, dir: string, filename = 'plan.pdf') {
      await expect(link).toBeVisible({ timeout: 50000 });

      await fs.mkdir(dir, { recursive: true });
      const savePath = path.join(dir, filename);

      const [download] = await Promise.all([
        this.page.waitForEvent('download'),
        link.click(),
      ]);

      await download.saveAs(savePath);
      return savePath;
    }
}

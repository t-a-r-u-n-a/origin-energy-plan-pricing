import { Page, expect } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

export class PlanDetailsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPage() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async downloadPdfTo(dir: string, filename = 'plan.pdf') {
    const pdfLink = this.page.locator('#documentDownload');
    await expect(pdfLink).toBeVisible({ timeout: 50000 });

    await fs.mkdir(dir, { recursive: true });
    const savePath = path.join(dir, filename);

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      pdfLink.click(),
    ]);

    await download.saveAs(savePath);
    return savePath;
  }

}

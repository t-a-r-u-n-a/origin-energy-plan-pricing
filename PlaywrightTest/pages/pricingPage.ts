import { Locator, Page, expect } from '@playwright/test';

export class PricingPage {
  readonly page: Page;
  readonly addressInput: Locator;
  readonly suggestedAddress: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addressInput = page.locator('#address-lookup');
    this.suggestedAddress = page.locator('//ul[@id = "address-lookup-listbox"]/li');
  }

  async goto() {
    await this.page.goto('https://www.originenergy.com.au/pricing.html', { waitUntil: 'domcontentloaded' });
  }

  async searchAddress(address: string) {
    await expect(this.addressInput).toBeVisible({ timeout: 5000 });
    await this.addressInput.click();
    await this.addressInput.fill(address);
    // Wait for suggestions to appear
    await this.page.waitForTimeout(700);
  }

  async selectAddressFromSuggestions() {
    // Try to click the suggestion with id 'address-lookup-helper-text' containing the address text
    const suggestion = this.suggestedAddress;

    if (await suggestion.count() > 0) {
      await suggestion.scrollIntoViewIfNeeded();
      await suggestion.click();
      return;
    }

    // Fallback: press Enter to accept first suggestion
    await this.suggestedAddress.first().press('Enter');
  }
}

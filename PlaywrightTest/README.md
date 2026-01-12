# origin-energy-pricing-plan project
```markdown
# UI Automation with Playwright

This project contains automated UI test case for the Origin Energy - Pricing page (https://www.originenergy.com.au/pricing.html) using Playwright. The test case is named **origin-pricing.spec.ts** and includes test case mentioned below.

--------

## Prerequisites

- Node.js installed (v14 or later recommended)
- Playwright installed

To install Playwright:
```bash
npm install playwright
```

--------

## Test Case Overview

**Steps:**
1. Navigate to https://www.originenergy.com.au/pricing.html
2. Search for an address (e.g. 17 Bolinda Road, Balwyn North, VIC 3104).
3. Select the address from the list.
4. Verify that the plans list is displayed.
5. Uncheck the Electricity checkbox.
6. Verify that plans are still displayed.
7. Click on the plan link in the Plan BPID/EFS column.
8. Verify that the plan details page opens in a new tab.
9. Download the plan PDF to the local file system.
10. Assert that the PDF content confirms it is a Gas plan.

--------

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/t-a-r-u-n-a/origin-energy-plan-pricing.git
   cd ui-automation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run Playwright tests:
   ```bash
   npx playwright test
   ```

--------

## File Structure

```plaintext
.
├── package.json
├── playwright.config.ts
├── Dockerfile
├── docker-compose.yml
├── README.DOCKER.md
├── .dockerignore
├── .gitignore
├── .gitattributes
├── pages/
│   ├── planDetailsPage.ts
│   ├── plansPage.ts
│   ├── pricingPage.ts
├── tests/
│   └── origin-pricing.spec.ts
├── test-downloads/
│   └── plans/
├── test-results/
├── playwright-report/
└── README.md
```


--------
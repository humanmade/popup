/**
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !! process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 2,
	reporter: [
		[ 'html', { open: process.env.CI ? 'never' : 'on-failure' } ],
		[ 'json', { outputFile: 'test-results/results.json' } ],
		[ 'list' ],
	],
	use: {
		baseURL: process.env.WP_BASE_URL || 'http://127.0.0.1:9400',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { browserName: 'chromium' },
		},
	],
	webServer: process.env.CI
		? undefined
		: {
				command: 'npm run playground:start',
				port: 9400,
				reuseExistingServer: true,
				timeout: 120000,
		  },
};

module.exports = config;

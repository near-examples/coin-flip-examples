const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1234',
    specPattern: 'cypress/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
    chromeWebSecurity: false,
    experimentalSessionAndOrigin: true,
    testIsolation: 'on',
    defaultCommandTimeout: 30000,
    env: {
      seed: 'give laugh youth nice fossil common neutral since best biology swift unhappy',
    },
    excludeSpecPattern: [
      '**/__snapshots__/*',
      '**/__image_snapshots__/*'
    ]
  }
})

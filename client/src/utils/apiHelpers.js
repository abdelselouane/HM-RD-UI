const RELATIVE_URL = '';
const MOCK_API_URL = 'http://localhost:8080';
const MOCK_URL = 'http://localhost:3000';
/**
 * apiUrl
 * Used for mocking endpoints during jest testing
 */
export const apiUrl = global.UNIT_TEST ? MOCK_URL : RELATIVE_URL; // eslint-disable-line
/**
 * ssoUrl, partsOrderUrl, partsServiceUrl
 * Used for mocking endpoints during end to end testing
 * E2E_TEST is defined via webpack.EnvironmentPlugin
 */
const isTest = global.UNIT_TEST || E2E_TEST; // eslint-disable-line
export const ssoUrl = isTest ? MOCK_API_URL : RELATIVE_URL; // eslint-disable-line
export const partsOrdersUrl = isTest ? MOCK_API_URL : RELATIVE_URL; // eslint-disable-line
export const partsServiceUrl = isTest ? MOCK_API_URL : RELATIVE_URL; // eslint-disable-line
export const partsInventoryUrl = isTest ? MOCK_API_URL : RELATIVE_URL; // eslint-disable-line

export default apiUrl;

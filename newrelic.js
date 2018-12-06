'use strict'
/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */

 /**
  * Name of the CUP Service
  */
var SERVICE_NAME = 'newrelic_repairdepotui';

var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
var appName = '';
var licenseKey = '';
var proxyHost = '';
var proxyPort = '';

if (vcapServices) {
  var newrelicService = vcapServices["user-provided"].find(function(service) { return service.name === SERVICE_NAME } ).credentials;
  appName = newrelicService.app_name;
  licenseKey = newrelicService.license_key;
  proxyHost = newrelicService.proxy_host;
  proxyPort = newrelicService.proxy_port;
}

exports.config = {
  /**
   * Array of application names.
   */
  app_name: appName,
  /**
   * Your New Relic license key.
   */
  license_key: licenseKey,
  /**
   * THD Proxy Host & Port
   */
  proxy_host: proxyHost,
  proxy_port: proxyPort,
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  },
  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all traces, unless otherwise specified in a destination's
   * attributes include/exclude lists.
   */
  allow_all_headers: true,
  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations. Allows * as wildcard
     * at end.
     *
     * NOTE: If excluding headers, they must be in camelCase form to be filtered.
     *
     * @env NEW_RELIC_ATTRIBUTES_EXCLUDE
     */
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  }
}

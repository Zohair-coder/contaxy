/**
 * Contaxy API
 * Functionality to create and manage projects, services, jobs, and files.
 *
 * The version of the OpenAPI document: 0.0.8
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';
/**
 * Enum class TokenType.
 * @enum {}
 * @readonly
 */
export default class TokenType {
  /**
   * value: "session-token"
   * @const
   */
  'session-token' = 'session-token';

  /**
   * value: "api-token"
   * @const
   */
  'api-token' = 'api-token';

  /**
   * Returns a <code>TokenType</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/TokenType} The enum <code>TokenType</code> value.
   */
  static constructFromObject(object) {
    return object;
  }
}

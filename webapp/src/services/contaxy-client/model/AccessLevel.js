/**
 * Contaxy API
 * Functionality to create and manage projects, services, jobs, and files.
 *
 * The version of the OpenAPI document: 0.0.0.dev1+main
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';
/**
* Enum class AccessLevel.
* @enum {}
* @readonly
*/
export default class AccessLevel {
    
        /**
         * value: "read"
         * @const
         */
        "read" = "read";

    
        /**
         * value: "write"
         * @const
         */
        "write" = "write";

    
        /**
         * value: "admin"
         * @const
         */
        "admin" = "admin";

    
        /**
         * value: "unknown"
         * @const
         */
        "unknown" = "unknown";

    

    /**
    * Returns a <code>AccessLevel</code> enum value from a Javascript object name.
    * @param {Object} data The plain JavaScript object containing the name of the enum value.
    * @return {module:model/AccessLevel} The enum <code>AccessLevel</code> value.
    */
    static constructFromObject(object) {
        return object;
    }
}


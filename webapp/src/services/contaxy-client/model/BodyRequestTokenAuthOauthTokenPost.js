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
import OAuth2TokenGrantTypes from './OAuth2TokenGrantTypes';

/**
 * The BodyRequestTokenAuthOauthTokenPost model module.
 * @module model/BodyRequestTokenAuthOauthTokenPost
 * @version 0.0.0.dev1+main
 */
class BodyRequestTokenAuthOauthTokenPost {
    /**
     * Constructs a new <code>BodyRequestTokenAuthOauthTokenPost</code>.
     * @alias module:model/BodyRequestTokenAuthOauthTokenPost
     * @param grantType {module:model/OAuth2TokenGrantTypes} Grant type. Determines the mechanism used to authorize the creation of the tokens.
     */
    constructor(grantType) { 
        
        BodyRequestTokenAuthOauthTokenPost.initialize(this, grantType);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, grantType) { 
        obj['grant_type'] = grantType;
    }

    /**
     * Constructs a <code>BodyRequestTokenAuthOauthTokenPost</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/BodyRequestTokenAuthOauthTokenPost} obj Optional instance to populate.
     * @return {module:model/BodyRequestTokenAuthOauthTokenPost} The populated <code>BodyRequestTokenAuthOauthTokenPost</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new BodyRequestTokenAuthOauthTokenPost();

            if (data.hasOwnProperty('grant_type')) {
                obj['grant_type'] = ApiClient.convertToType(data['grant_type'], OAuth2TokenGrantTypes);
            }
            if (data.hasOwnProperty('username')) {
                obj['username'] = ApiClient.convertToType(data['username'], 'String');
            }
            if (data.hasOwnProperty('password')) {
                obj['password'] = ApiClient.convertToType(data['password'], 'String');
            }
            if (data.hasOwnProperty('scope')) {
                obj['scope'] = ApiClient.convertToType(data['scope'], 'String');
            }
            if (data.hasOwnProperty('client_id')) {
                obj['client_id'] = ApiClient.convertToType(data['client_id'], 'String');
            }
            if (data.hasOwnProperty('client_secret')) {
                obj['client_secret'] = ApiClient.convertToType(data['client_secret'], 'String');
            }
            if (data.hasOwnProperty('code')) {
                obj['code'] = ApiClient.convertToType(data['code'], 'String');
            }
            if (data.hasOwnProperty('redirect_uri')) {
                obj['redirect_uri'] = ApiClient.convertToType(data['redirect_uri'], 'String');
            }
            if (data.hasOwnProperty('refresh_token')) {
                obj['refresh_token'] = ApiClient.convertToType(data['refresh_token'], 'String');
            }
            if (data.hasOwnProperty('state')) {
                obj['state'] = ApiClient.convertToType(data['state'], 'String');
            }
            if (data.hasOwnProperty('set_as_cookie')) {
                obj['set_as_cookie'] = ApiClient.convertToType(data['set_as_cookie'], 'Boolean');
            }
        }
        return obj;
    }


}

/**
 * Grant type. Determines the mechanism used to authorize the creation of the tokens.
 * @member {module:model/OAuth2TokenGrantTypes} grant_type
 */
BodyRequestTokenAuthOauthTokenPost.prototype['grant_type'] = undefined;

/**
 * Required for `password` grant type. The user’s username.
 * @member {String} username
 */
BodyRequestTokenAuthOauthTokenPost.prototype['username'] = undefined;

/**
 * Required for `password` grant type. The user’s password.
 * @member {String} password
 */
BodyRequestTokenAuthOauthTokenPost.prototype['password'] = undefined;

/**
 * Scopes that the client wants to be included in the access token. List of space-delimited, case-sensitive strings
 * @member {String} scope
 */
BodyRequestTokenAuthOauthTokenPost.prototype['scope'] = undefined;

/**
 * The client identifier issued to the client during the registration process
 * @member {String} client_id
 */
BodyRequestTokenAuthOauthTokenPost.prototype['client_id'] = undefined;

/**
 *  The client secret. The client MAY omit the parameter if the client secret is an empty string.
 * @member {String} client_secret
 */
BodyRequestTokenAuthOauthTokenPost.prototype['client_secret'] = undefined;

/**
 * Required for `authorization_code` grant type. The value is what was returned from the authorization endpoint.
 * @member {String} code
 */
BodyRequestTokenAuthOauthTokenPost.prototype['code'] = undefined;

/**
 * Required for `authorization_code` grant type. Specifies the callback location where the authorization was sent. This value must match the `redirect_uri` used to generate the original authorization_code.
 * @member {String} redirect_uri
 */
BodyRequestTokenAuthOauthTokenPost.prototype['redirect_uri'] = undefined;

/**
 * Required for `refresh_token` grant type. The refresh token previously issued to the client.
 * @member {String} refresh_token
 */
BodyRequestTokenAuthOauthTokenPost.prototype['refresh_token'] = undefined;

/**
 * An opaque value used by the client to maintain state between the request and callback. The parameter SHOULD be used for preventing cross-site request forgery.
 * @member {String} state
 */
BodyRequestTokenAuthOauthTokenPost.prototype['state'] = undefined;

/**
 * If `true`, the access (and refresh) token will be set as cookie instead of the response body.
 * @member {Boolean} set_as_cookie
 * @default false
 */
BodyRequestTokenAuthOauthTokenPost.prototype['set_as_cookie'] = false;






export default BodyRequestTokenAuthOauthTokenPost;

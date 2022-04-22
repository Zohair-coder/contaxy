/**
 * Contaxy API
 * Functionality to create and manage projects, services, jobs, and files.
 *
 * The version of the OpenAPI document: 0.0.16
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';
import AllowedImageInfo from '../model/AllowedImageInfo';
import ProblemDetails from '../model/ProblemDetails';
import SystemInfo from '../model/SystemInfo';
import SystemStatistics from '../model/SystemStatistics';

/**
 * System service.
 * @module api/SystemApi
 * @version 0.0.16
 */
export default class SystemApi {
  /**
   * Constructs a new SystemApi.
   * @alias module:api/SystemApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
  }

  /**
   * Add an image to the list of allowed images or replace one already on the list.
   * @param {module:model/AllowedImageInfo} allowedImageInfo
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/AllowedImageInfo} and HTTP response
   */
  addAllowedImageWithHttpInfo(allowedImageInfo) {
    let postBody = allowedImageInfo;
    // verify the required parameter 'allowedImageInfo' is set
    if (allowedImageInfo === undefined || allowedImageInfo === null) {
      throw new Error(
        "Missing the required parameter 'allowedImageInfo' when calling addAllowedImage"
      );
    }

    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [
      'APIKeyCookie',
      'APIKeyHeader',
      'APIKeyQuery',
      'OAuth2PasswordBearer',
    ];
    let contentTypes = ['application/json'];
    let accepts = ['application/json'];
    let returnType = AllowedImageInfo;
    return this.apiClient.callApi(
      '/system/allowed-images',
      'POST',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }

  /**
   * Add an image to the list of allowed images or replace one already on the list.
   * @param {module:model/AllowedImageInfo} allowedImageInfo
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/AllowedImageInfo}
   */
  addAllowedImage(allowedImageInfo) {
    return this.addAllowedImageWithHttpInfo(allowedImageInfo).then(function (
      response_and_data
    ) {
      return response_and_data.data;
    });
  }

  /**
   * Check server health status.
   * Returns a successful return code if the instance is healthy.
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
   */
  checkHealthSystemHealthGetWithHttpInfo() {
    let postBody = null;

    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = null;
    return this.apiClient.callApi(
      '/system/health',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }

  /**
   * Check server health status.
   * Returns a successful return code if the instance is healthy.
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}
   */
  checkHealthSystemHealthGet() {
    return this.checkHealthSystemHealthGetWithHttpInfo().then(function (
      response_and_data
    ) {
      return response_and_data.data;
    });
  }

  /**
   * Remove an image from the list of allowed images.
   * @param {String} imageName Name of a docker image without the tag
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
   */
  deleteAllowedImageWithHttpInfo(imageName) {
    let postBody = null;
    // verify the required parameter 'imageName' is set
    if (imageName === undefined || imageName === null) {
      throw new Error(
        "Missing the required parameter 'imageName' when calling deleteAllowedImage"
      );
    }

    let pathParams = {};
    let queryParams = {
      image_name: imageName,
    };
    let headerParams = {};
    let formParams = {};

    let authNames = [
      'APIKeyCookie',
      'APIKeyHeader',
      'APIKeyQuery',
      'OAuth2PasswordBearer',
    ];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = null;
    return this.apiClient.callApi(
      '/system/allowed-images',
      'DELETE',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }

  /**
   * Remove an image from the list of allowed images.
   * @param {String} imageName Name of a docker image without the tag
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}
   */
  deleteAllowedImage(imageName) {
    return this.deleteAllowedImageWithHttpInfo(imageName).then(function (
      response_and_data
    ) {
      return response_and_data.data;
    });
  }

  /**
   * Get system info.
   * Returns information about this instance.
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/SystemInfo} and HTTP response
   */
  getSystemInfoWithHttpInfo() {
    let postBody = null;

    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = SystemInfo;
    return this.apiClient.callApi(
      '/system/info',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }

  /**
   * Get system info.
   * Returns information about this instance.
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/SystemInfo}
   */
  getSystemInfo() {
    return this.getSystemInfoWithHttpInfo().then(function (response_and_data) {
      return response_and_data.data;
    });
  }

  /**
   * Get system statistics.
   * Returns statistics about this instance.
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/SystemStatistics} and HTTP response
   */
  getSystemStatisticsWithHttpInfo() {
    let postBody = null;

    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [
      'APIKeyCookie',
      'APIKeyHeader',
      'APIKeyQuery',
      'OAuth2PasswordBearer',
    ];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = SystemStatistics;
    return this.apiClient.callApi(
      '/system/statistics',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }

  /**
   * Get system statistics.
   * Returns statistics about this instance.
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/SystemStatistics}
   */
  getSystemStatistics() {
    return this.getSystemStatisticsWithHttpInfo().then(function (
      response_and_data
    ) {
      return response_and_data.data;
    });
  }

  /**
   * Initialize the system.
   * Initializes the system.
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
   */
  initializeSystemWithHttpInfo() {
    let postBody = null;

    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = null;
    return this.apiClient.callApi(
      '/system/initialize',
      'POST',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }

  /**
   * Initialize the system.
   * Initializes the system.
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}
   */
  initializeSystem() {
    return this.initializeSystemWithHttpInfo().then(function (
      response_and_data
    ) {
      return response_and_data.data;
    });
  }

  /**
   * List all allowed images.
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<module:model/AllowedImageInfo>} and HTTP response
   */
  listAllowedImagesWithHttpInfo() {
    let postBody = null;

    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [
      'APIKeyCookie',
      'APIKeyHeader',
      'APIKeyQuery',
      'OAuth2PasswordBearer',
    ];
    let contentTypes = [];
    let accepts = ['application/json'];
    let returnType = [AllowedImageInfo];
    return this.apiClient.callApi(
      '/system/allowed-images',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }

  /**
   * List all allowed images.
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<module:model/AllowedImageInfo>}
   */
  listAllowedImages() {
    return this.listAllowedImagesWithHttpInfo().then(function (
      response_and_data
    ) {
      return response_and_data.data;
    });
  }

  /**
   * Register Admin User
   * @param {String} password
   * @param {String} passwordConfirm
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Object} and HTTP response
   */
  registerAdminUserSystemAdminPostWithHttpInfo(password, passwordConfirm) {
    let postBody = null;
    // verify the required parameter 'password' is set
    if (password === undefined || password === null) {
      throw new Error(
        "Missing the required parameter 'password' when calling registerAdminUserSystemAdminPost"
      );
    }
    // verify the required parameter 'passwordConfirm' is set
    if (passwordConfirm === undefined || passwordConfirm === null) {
      throw new Error(
        "Missing the required parameter 'passwordConfirm' when calling registerAdminUserSystemAdminPost"
      );
    }

    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {
      password: password,
      password_confirm: passwordConfirm,
    };

    let authNames = [];
    let contentTypes = ['application/x-www-form-urlencoded'];
    let accepts = ['application/json'];
    let returnType = Object;
    return this.apiClient.callApi(
      '/system/admin',
      'POST',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }

  /**
   * Register Admin User
   * @param {String} password
   * @param {String} passwordConfirm
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Object}
   */
  registerAdminUserSystemAdminPost(password, passwordConfirm) {
    return this.registerAdminUserSystemAdminPostWithHttpInfo(
      password,
      passwordConfirm
    ).then(function (response_and_data) {
      return response_and_data.data;
    });
  }
}

# sysHUB Findr - Configuration File Guide

This document provides an overview of the `config.json` file used for configuring the sysHUB Findr application. The configuration file follows a specific schema to ensure the application runs smoothly.

In the same folder as this README, you will find three template files: `config-apikey.json.template`, `config-basic.json.template`, and `config-oauth.json.template`. These templates provide examples for configuring the three supported API types: API Key, Basic Authentication, and OAuth. Each template includes a reference to a JSON schema that you can use for validation. The schema is also available at [this link](https://raw.githubusercontent.com/surcoufx83/sysHUB-Findr/dev/json-schema/1.0.0/schema). Use these templates as a starting point for your `config.json` file.

## Configuration Schema

### Root Properties

- **api**: Configuration for the API settings. Supports three types:
  - `ApikeyRestSettings`
  - `BasicRestSettings`
  - `OAuthRestSettings`

- **appInitializationFailure**: Configuration related to application initialization failures.
  - **configStatusCode** (number): Status code for configuration errors.

- **app**: Application-specific settings.
  - **baseUrl** (string): The base URL for the application.
  - **disabledFunctions** (array of strings): Functions that are disabled in the application. Options include:
    - `config`
    - `jobtypes`
    - `parameterset`
    - `workflows`
    - `certstore`
    - `serverConfig`
    - `serverInfo`
    - `ippDevices`
    - `users`
  - **displaySystemName** (boolean): Whether to display the system name.
  - **loadDictionaryWorkflow** (string): A workflow uuid that is executed to retrieve dictionary variables.
  - **minPhraseLength** (number): Minimum phrase length for certain operations.
  - **promotionLink** (string): URL for promotions.
  - **unusedWorkflowBadge** (boolean): Whether to show badges for unused workflows.
  - **useCache** (boolean): Whether to use caching.
  - **webclientLink** (string): URL for the web client.

- **i10n**: Internationalization settings.
  - **fallback** (string): Fallback language. Options: `de`, `en`.
  - **locales** (array of strings): List of supported locales.

- **storage**: Storage-related settings.
  - **categoriesKey** (string): Key for categories storage.
  - **configKey** (string): Key for config storage.
  - **jobtypesKey** (string): Key for job types storage.
  - **l10nKey** (string): Key for localization storage.
  - **parametersetKey** (string): Key for parameter set storage.
  - **searchconfigKey** (string): Key for search config storage.
  - **tokenKey** (string): Key for token storage.
  - **userconfigKey** (string): Key for user config storage.
  - **userdataKey** (string): Key for user data storage.
  - **workflowsKey** (string): Key for workflows storage.

### API Settings

#### ApikeyRestSettings **(do not use)**

API key authentication is available from sysHUB 2024.
This method is currently not supported in Findr as we need access to protected Rest API endpoints that are not accessible to API key logins.

- **host** (string): The API host.
- **version** (number): The API version. Options: 
  - `4` = sysHUB 2024
- **apiKey** (string): The API key.
- **provider** (string): The provider name.
- **options**: Additional options.
  - **autoConnect** (boolean): Whether to auto-connect.
  - **autoLogoutOn401** (boolean): Whether to auto-logout on 401 errors.
  - **autoLogoutTimer** (number): Timer for auto-logout.
  - **useEtags** (boolean): Whether to use ETags.
- **scope** (string): Scope of the API. Always `public`.
- **throwErrors** (boolean): Whether to throw errors.

#### BasicRestSettings

- **host** (string): The API host.
- **version** (number): The API version. Options: 
  - `1` = sysHUB 2021
  - `2` = sysHUB 2022
  - `3` = sysHUB 2023 (**default**)
  - `4` = sysHUB 2024
- **basic**: Basic connection settings.
  - **enabled** (boolean): Must be `true`.
  - **requiresLogin** (boolean): Whether login is required. If true, this makes `username` and `password` optional. This is not yet supported in Findr.
  - **username** (string): Username for basic auth.
  - **password** (string): Password for basic auth.
  - **provider** (string): The provider name.
  - **scope** (string): Scope of the API. Options: `private`, `public`, `private+public`, `public+private`.
- **options**: Additional options (same as in `ApikeyRestSettings`).
- **throwErrors** (boolean): Whether to throw errors.

#### OAuthRestSettings

- **host** (string): The API host.
- **version** (number): The API version. Options: 
  - `1` = sysHUB 2021
  - `2` = sysHUB 2022
  - `3` = sysHUB 2023 (**default**)
  - `4` = sysHUB 2024
- **oauth**: OAuth connection settings.
  - **enabled** (boolean): Must be `true`.
  - **clientId** (string): OAuth client ID.
  - **clientSecret** (string): OAuth client secret.
  - **scope** (string): Scope of the API. Options: `private`, `public`, `private+public`, `public+private`.
  - **storeKey** (string): Key to store OAuth tokens.
- **options**: Additional options (same as in `ApikeyRestSettings`).
- **throwErrors** (boolean): Whether to throw errors.

### Example `config.json`

```json
{
  "api": {
    "host": "https://api.example.com",
    "version": 3,
    "apiKey": "your_api_key",
    "provider": "example_provider",
    "options": {
      "autoConnect": true,
      "autoLogoutOn401": true,
      "autoLogoutTimer": 300,
      "useEtags": false
    },
    "scope": "public",
    "throwErrors": true
  },
  "appInitializationFailure": {
    "configStatusCode": 500
  },
  "app": {
    "baseUrl": "https://app.example.com",
    "disabledFunctions": ["config", "users"],
    "displaySystemName": true,
    "loadDictionaryWorkflow": "c0a80a838fed1172818fed8172ff0000",
    "minPhraseLength": 3,
    "promotionLink": "https://promo.example.com",
    "unusedWorkflowBadge": false,
    "useCache": true,
    "webclientLink": "https://webclient.example.com"
  },
  "i10n": {
    "fallback": "en",
    "locales": ["en", "de", "fr"]
  },
  "storage": {
    "categoriesKey": "categories",
    "configKey": "config",
    "jobtypesKey": "jobtypes",
    "l10nKey": "localization",
    "parametersetKey": "parameterset",
    "searchconfigKey": "searchconfig",
    "tokenKey": "token",
    "userconfigKey": "userconfig",
    "userdataKey": "userdata",
    "workflowsKey": "workflows"
  }
}
```

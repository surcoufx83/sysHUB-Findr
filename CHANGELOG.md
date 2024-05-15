# sysHUB Findr Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0-beta.5 (Unreleased)

### Added

- In the workflow presentation an additional hint is shown if a process or decision is marked as deprecated (#40)
- The title of the browser tabs changes depending on the current view to make it easier working with multiple tabs and workflows (#38)
- The workflow presentation allows tracing the path to an element. Therefore, a new button has been implemented in decisions, processes, CElements and workflow calls. The selected node and all traces leading to it are highlighted in red (#42). This will also work in paths that use a call workflow element to continue at another start point in the same workflow (#48).
- The workflow presentation contains a drop-down menu with all server variables and the option to add custom variables. These are used for path tracking when workflow calls contain variable names (#49, #48, #46).
- The Findr version is visible in the dropdown menu and about page (#43)
- The system name is now visible in the Findr if not `Base` (#44). This can be disabled via the config.json file.
- Findr will make use of server cache (if possible). This is based on the updated Rest module (https://www.npmjs.com/package/syshub-rest-module) and sysHUB 2024 with included Etag-functionality. This will also work if served via webapps (not Node.js live server) on a sysHUB 2023 server. For this to work, parameterset, config, categories, workflows and jobtypes are compressed and stored in sessionStorage (and though removed by closing the browser). Closes #23
- Findr will show a small badge next to a workflow name in the workflow list (not workflow ui) if there's no reference for a workflow and if it's not the SystemWorkflow (#41). This feature can be disabled via the config.json file.

### Changed

- The workflow presentation has changed to native HTML as far as possible. Arrows remain svg elements.

## 1.0.0-beta.4 2024-03-05

### Added

- The page config file can contain a list of topics that will not be searched and are not selectable anymore (#28)

### Fixed

- Search results not shown when search phrase contains characters that needs to be escaped in Regex (#36)
- Loading of references takes very long (#35)
- List of versions and references may be to large for the screen (#33)
- Workflow size too small (#32)
- Search fails if browser cache is based on COSMOS Findr (#31)
- 'Include workflow contents'-filter not applied (#29)
- Description of 'Exlude [B]-comments' not clear (#29)

## 1.0.0-beta.3 2024-02-19

### Added

- Basic functionality
- Angular 17 Framework and Bootstrap
- REST API via native endpoints in addition to existing workflow execution
- Search configuration, parameterset, jobtypes, workflows, cert store, server properties, server infos, ipp devices, users
- Multiple moveable and resizable tooltips per entity
- Fully scrollable workflow viewer
- Show workflow versions and references
- Cache clear function
- Language switch and localisation for English, German, French
- Theme switch (light, dark, automatic)
- Help and about pages
- Links to source code on Github and to the sysHUB web client

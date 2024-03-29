# sysHUB Findr Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-beta.4]

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

## [1.0.0-beta.3]

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

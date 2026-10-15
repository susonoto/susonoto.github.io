# Security Policy

## Scope

This is a static website that requests public GitHub repository metadata in the visitor's browser. It does not include a backend or intentionally handle private repository data.

## Supported versions

The latest version on the default branch is the supported version.

## Reporting a vulnerability

Please do not publish sensitive vulnerability details in a public issue. Contact the repository maintainer privately using the contact information available on the GitHub profile. Include:

- A clear description of the issue.
- Steps to reproduce it.
- The potential impact.
- Any suggested remediation, if known.

Please allow reasonable time for investigation and a fix before public disclosure.

## Security notes

- Never put personal access tokens or other secrets in `config.js`, HTML, or JavaScript.
- Avoid adding third-party scripts without reviewing their source and purpose.
- Keep hosting-provider permissions limited to what deployment requires.
- Repository links and descriptions come from GitHub; review your public repository metadata before featuring it.

# Contributing to ws-rc4

## Table of contents

 - [Coding conventions](#coding-conventions)
 - [Reporting a bug](#reporting-a-bug)
 - [Patching a bug](#patching-a-bug)
 - [Requesting new functionality](#requesting-new-functionality)
 - [Submitting new functionality](#submitting-new-functionality)


## Coding conventions

The JavaScript source code in this project must adhere to the rules as described in [RATUS/SPEC0001][RATUS/SPEC0001].

## Reporting a bug

 - **Do not open up an issue if the bug is a security vulnerability in ws-rc4.** Instead,
   [send a message to finwo on gitter][gitter/finwo].
 - **Ensure the bug was not already reported** by searching [the GitLab issues][issues].
 - If you're unable to find an open issue addressing the problem,
   [open a new one][issues/new]. Be sure to include a **title and clear description**, as much relevant information as
   possible and a **code sample** or an **executable test case** demonstrating the expected behavior that is not
   occurring.
 - If applicable, use the related issues tool to reference issues related to your new issue.

## Patching a bug

 - [Open a new merge request][merge_requests/new] from your own fork towards the master branch with the changes fixing
   the bug.
 - Ensure the MR description clearly describes the problem and solution. Attach related issues to the merge request if
   applicable.
 - The merge request must include a new version number, bumping the patch number according to [SemVer][semver]. If the
   patch produces breaking-changes, the major number must be bumped instead.
 - Your code will be reviewed and tested by the maintainers. Only if passed, the patch will be merged.

## Requesting new functionality

 - First, ensure the request has not already been made by searching through [the GitLab issues][issues].
 - If you're unable to find an open issue requesting the feature, [open a new one][issues/new]. Be sure to include a
   **title and clear description of intended behavior**, as much relevant information as possible, one or more use-cases
   for the feature and mark it with the `feature request` label.
   
## Submitting new functionality

 - Ensure an open issue exists for the functionality you're submitting which includes approval for the new
   functionality.
 - Just like with patching a bug, [open a new merge request][merge_requests/new] from your own fork towards the master
   branch with the changes to add the functionality as described in the issue.
 - Ensure the new code is tested & does not break any existing functionality or features.
 - Attach the issue describing the new functionality in detail as a related issue.
 - The merge request must include a new version number, bumping the minor number according to [SemVer][semver]. If the
   update produces breaking-changes, the major number must be bumped instead.
 - Your code will be reviewed and tested by the maintainers. Only if passed, the new code will be merged.

[RATUS/SPEC0001]: https://gitlab.com/ratusbv/specifications/raw/master/spec/0001.txt
[gitter/finwo]: https://gitter.im/finwo
[issues]: https://gitlab.com/finwo/ws-rc4/issues
[issues/new]: https://gitlab.com/finwo/ws-rc4/issues/new
[merge_requests/new]: https://gitlab.com/finwo/ws-rc4/merge_requests/new
[semver]: http://semver.org

# star-diff
[<img src="https://img.shields.io/npm/dt/star-diff.svg">](https://www.npmjs.com/package/star-diff)
[<img src="https://img.shields.io/npm/v/star-diff.svg">](https://www.npmjs.com/package/star-diff)
> Performs a comparison of the github stars between two repositories.

## Preview

[![asciicast](https://asciinema.org/a/mCVQf8MgExBspKcKxqLHIyX3p.png)](https://asciinema.org/a/mCVQf8MgExBspKcKxqLHIyX3p)

## Installation

```bash
$ npm install -g star-diff

# or with yarn

$ yarn global add star-diff
```

## Usage

```bash
$ star-diff <repo1> <repo2> [options]
```

## Example

```bash
$ star-diff react vue

# or if you want to be more especify you can add the organization or owner of the repository

$ star-diff facebook/react vuejs/vue
```

![](https://i.imgur.com/bQ6mX9h.png)

## Options

<table>
    <thead>
        <tr>
            <th>Option</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tbody>
            <tr>
                <td>-V, --version</td>
                <td>output the version number</td>
            </tr>
            <tr>
                <td>-s, --stats</td>
                <td>display request Github stats</td>
            </tr>
            <tr>
                <td>-h, --help</td>
                <td>output usage information</td>
            </tr>
        </tbody>
    </tbody>
</table>

## Importants notes

* Node.js `>=8.0.0` is required to use this package, if you want to check out what version of node you have installed run in the terminal `node -v`.
* At this moment this package only works with public repositories.
* If you suddenly start having errors, it is probably because you have exhausted the calls to the Github API, use the `-s` flag to show the statistics of the remaining calls and the time in which API calls are renewed.

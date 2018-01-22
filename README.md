# star-diff
> Makes a star diff between two Github repository

## Preview
![](https://i.imgur.com/yDmkUiA.png)

## Installation
```bash
$ npm install -g star-diff
```

## Usage

```bash
$ star-diff <repo1> <repo2> [option]
```
# Example
```bash
$ star-diff react vue -s
# or if you want to be more especify you can add the organization or owner of the repository
$ star-diff facebook/react vuejs/vue -s
```
![](https://i.imgur.com/3QxB8ZR.png)

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
- Node.js version `>=8.5.0`, if you want to check out what version of node you have installed run in the terminal `node -v`
- If you suddenly start having errors, it is probably because you have exhausted the calls to the Github API, use the `-s` flag to show the statistics of the remaining calls and the time in which API calls are renewed.
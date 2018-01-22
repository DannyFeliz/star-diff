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
```
![](https://i.imgur.com/RGaI3a2.png)

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

## Requirements
Node.js version `>=8.5.0`, if you want to check out what version of node you have installed run in the terminal `node -v`
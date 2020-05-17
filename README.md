# svg-rect-to-path
SVG tool that convert `<rect>` to `<path>` or `<polygon>`.

[Try now!](https://kurachiweb.github.io/svg-rect-to-path/)

## Example
input
```<rect x="387.4" y="332.4" width="4" height="40" transform="translate(-97.1 154.4) rotate(-20)" fill="#afe2b7" class="decoration" />```

output (path)
```<path d="M380.62,334.26l3.76,-1.37l13.68,37.59l-3.76,1.37Z" fill="#afe2b7" class="decoration" />```

output (polygon)
```<polygon points="380.62,334.26 384.38,332.89 398.06,370.47 394.31,371.84" fill="#afe2b7" class="decoration" />```
# svg-rect-to-path
SVG tool that convert `<rect>` to `<path>` or `<polygon>`.

[Try now!](https://kurachiweb.github.io/svg-rect-to-path/)

## Example
input
``` svg
<rect x="387.4" y="332.4" width="4" height="40" transform="translate(-97.1 154.4) rotate(-20)" fill="#afe2b7" class="decoration" />
<rect x="10" y="85" transform="matrix(0.7837 -0.6211 0.6211 0.7837 -44.3907 110.5272)" fill="#D16B6B" width="253" height="68"/>
```

output (path)
``` svg
<path d="M380.62,334.26l3.76,-1.37l13.68,37.59l-3.76,1.37Z" fill="#afe2b7" class="decoration" />
<path d="M16.24,170.93l198.28,-157.14l42.23,53.29l-198.28,157.14Z" fill="#D16B6B" />
```

output (polygon)
``` svg
<polygon points="380.62,334.26 384.38,332.89 398.06,370.47 394.31,371.84" fill="#afe2b7" class="decoration" />
<polygon points="16.24,170.93 214.52,13.79 256.75,67.08 58.47,224.22" fill="#D16B6B" />
```
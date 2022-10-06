### Installation
```
npm install react-stock-charts --save
```

### Bootstrap
```
mkdir stockchart
git clone https://gist.github.com/a27298bb7ae613d48ba2.git stockchart
cd stockchart
npm install react-stock-charts
```
edit the `index.html` and replace

```html
<script type="text/javascript" src="//unpkg.com/react-stock-charts@latest/dist/react-stock-charts.min.js"></script>
```

with

```html
<script type="text/javascript" src="node_modules/react-stock-charts/dist/react-stock-charts.js"></script>
```

You should be good to go

---
#### React version compatibility

As of `v0.4.x` react-stock-charts depends on React `^0.14.6`
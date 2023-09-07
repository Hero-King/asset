# echarts

## 三维地球

安装依赖 echarts 和 echarts-gl , 使用 globe 组件

### 地球上定点

使用 series>scatter3D 组件 设置经纬度到 `scatter3D`组件的 data 中, 注意数据格式 value 是数组[经度, 维度, 高度]

- 点击事件 : 需要 data 中的数据长度 > 1
- 需要悬浮窗: 设置 tooltip 即可
- 悬浮窗一直显示: 使用 dispatchAction API

### 限制可转动的角度

- globe > viewControl > alpha/beta 设置初始视角的位置, 怎么设置成中国中心? beta= 中心地点维度 + 90
- globe > viewControl > minAlpha/maxAlpha/minBeta/maxBeta 设置可转动的角度

### 鼠标 hover 效果变化

使用 emphasis 配置项

参见 qianduan 项目 src\echarts\globe.html

### globe 使用 echarts 实例作为纹理

- 两个 echart 实例的点击事件都是可用的
- 先用echart1绘制出图形, 在用echart2设置1为纹理或者layer

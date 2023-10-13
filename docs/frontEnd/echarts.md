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
- 先用 echart1 绘制出图形, 在用 echart2 设置 1 为纹理或者 layer

### 从小变大,自转动到某角度

使用动画实现, 初次 setOption 后再次 setOption 添加动画配置

```ts
setOption({
  globe: {
    viewControl: {
      animationEasingUpdate: 'linear',
      animationDurationUpdate: 3000,
      animation: true
      //   ...其他配置
    }
  }
})
```

### baseTexture 图片优先加载

```ts
const img = new Image()
img.onload = () => {
  echart.setOption({
    globe: {
      baseTexture: img
    }
  })
}
img.src = 'https://xxx'
```

注意: 使用 img 标签或者 image 实例作为 baseTexture, 后续再次 setOption 更新旋转配置会出现大白球(纹理丢失)

## 常见问题及解决方案

### 图表无数据时 Y 轴标题溢出问题

设置 Y 轴坐标轴 offset: -10

### ts 类型

```ts
import { EChartsOption, EChartsType, DefaultLabelFormatterCallbackParams,TooltipComponentFormatterCallbackParams } from 'echarts'
let echartInstance = ref<EChartsType>()
const option: EChartsOption = {
  tooltip: {
    trigger: 'item',
    formatter: (params: TooltipComponentFormatterCallbackParams) => {
      const { name, marker, value } = params as DefaultLabelFormatterCallbackParams
      return `
			<div>${name}</div>
			<div>
				${marker} <span style="font-size: 16px">${value}</span> 已解除 
				</div>
			`
    }
  }
}
```

### 柱状图折线图切换工具栏

```ts
let opt = {
  toolbox: {
    show: true,
    feature: {
      magicType: {
        type: ['line', 'bar']
      }
    }
  }
}
```

### 缩放条

```ts
let opt = {
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 0.01,
      minValueSpan: 15
    },
    {
      type: 'slider',
      backgroundColor: '#F0F2F5',
      borderColor: '#F0F2F5',
      moveHandleSize: 0,
      fillerColor: 'none',
      handleSize: '80%',
      handleIcon:
        'path://M3.4000000953674316,15.100000381469727C3.4000000953674316,8.746408462524414,8.546408653259277,3.5999999046325684,14.899999618530273,3.5999999046325684C21.253591537475586,3.5999999046325684,26.399999618530273,8.746408462524414,26.399999618530273,15.100000381469727C26.399999618530273,21.453590393066406,21.253591537475586,26.600000381469727,14.899999618530273,26.600000381469727C8.546408653259277,26.600000381469727,3.4000000953674316,21.453590393066406,3.4000000953674316,15.100000381469727Z M3.4000000953674316,15.100000381469727C3.4000000953674316,8.746408462524414,8.546408653259277,3.5999999046325684,14.899999618530273,3.5999999046325684C21.253591537475586,3.5999999046325684,26.399999618530273,8.746408462524414,26.399999618530273,15.100000381469727C26.399999618530273,21.453590393066406,21.253591537475586,26.600000381469727,14.899999618530273,26.600000381469727C8.546408653259277,26.600000381469727,3.4000000953674316,21.453590393066406,3.4000000953674316,15.100000381469727Z M12.399999618530273,10.100000381469727L12.399999618530273,10.100000381469727c0.3000001907348633,0,0.6000003814697266,0.19999980926513672,0.6000003814697266,0.5999994277954102l0,9.000000953674316c0,0.2999992370605469,-0.19999980926513672,0.5,-0.6000003814697266,0.5l0,0c-0.2999992370605469,0,-0.5999994277954102,-0.20000076293945312,-0.5999994277954102,-0.5l0,-9.000000953674316C11.899999618530273,10.300000190734863,12.100000381469727,10.100000381469727,12.399999618530273,10.100000381469727Z M17.399999618530273,10.100000381469727L17.399999618530273,10.100000381469727c0.3000011444091797,0,0.6000003814697266,0.19999980926513672,0.6000003814697266,0.5999994277954102l0,9.000000953674316c0,0.2999992370605469,-0.20000076293945312,0.5,-0.5,0.5l0,0c-0.2999992370605469,0,-0.5,-0.20000076293945312,-0.5,-0.5l0,-9.000000953674316C16.799999237060547,10.300000190734863,17.100000381469727,10.100000381469727,17.399999618530273,10.100000381469727Z',
      handleStyle: {
        shadowBlur: 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        borderColor: '#D9D9D9',
        borderWidth: 1,
        shadowOffsetY: 1
      },
      showDataShadow: true,
      dataBackground: {
        lineStyle: {
          opacity: 0
        },
        areaStyle: {
          opacity: 0
        }
      },
      selectedDataBackground: {
        lineStyle: {
          color: '#CED4D9',
          opacity: 1
        },
        areaStyle: {
          color: '#CED4D9',
          opacity: 1
        }
      },
      left: '10%',
      right: '10%',
      bottom: '2%'
    }
  ]
}
```

### 折线图设置到坐标轴区域渐变色

```ts
let opt = {
  series: [
    {
      areaStyle: {
        opacity: 1,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          // 起点位置
          {
            offset: 0,
            color: 'rgba(71,123,237,0.24)'
          },
          //   终点配置
          {
            offset: 1,
            color: 'rgba(70,123,237,0)'
          }
        ])
      }
    }
  ]
}
```

### 鼠标浮动交互

emphasis 配置项

### 图裂的样式特别复杂(比如带边框)

使用 html + css 画出图例样式 使用 js + echarts.dispatchAction()

## vue-echarts

API : https://ecomfe.github.io/vue-echarts/README.zh-Hans.html

```ts
import VChart from 'vue-echarts';
<v-chart style="height: 180px" :option="eventStatisticOpt" />

/**
 * v6 props
 * - init-options: object  : 请参考 echarts.init的 opts参数
 * - option: 修改这个 prop 会触发 ECharts 实例的 setOption 方法   `在没有指定 update-options 时，如果直接修改 option 对象而引用保持不变，setOption 方法调用时将默认指定 notMerge: false；否则，如果为 option 绑定一个新的引用，将指定 notMerge: true。`
 * - update-options: 图表更新的配置项。请参考 echartsInstance.setOption 的 opts参数
 */
```

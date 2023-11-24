# thingjs

## 坐标系

- 世界坐标系 相对于场景的中心的坐标, 右上前分别为 x y z 轴 position/angle
- 相对父亲坐标器 localPosition/localAngles
- 自身坐标器 moveTo/rotate 等函数使用 向前就是 z 轴

> 子物体不和父组件一起运动: 更改 inheritPosition 属性
> lookAt 摄像机朝向或者物体朝向: 面向物体/面向某个位置/物体面向摄影机
> 坐标转换 selfToWorld,localToWorld, worldToSelf, worldToLocal

## object

- 轴心点 物体坐标对应物体的具体位置, 最好是方便控制的位置, 比如人物体设置在脚底, 花盆放到底部
- moveto orientToPath 沿着面朝的方向前进

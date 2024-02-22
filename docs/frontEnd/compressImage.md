# 前端图片压缩

## 基本概念

### FileReader

FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。

- FileReader.readAsDataURL()  
  开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含一个 data: URL 格式的 Base64 字符串以表示所读取文件的内容。

- FileReader.result 只读
  文件的内容。该属性仅在读取操作完成后才有效，数据的格式取决于使用哪个方法来启动读取操作。

### Canvas

- HTMLCanvasElement.toDataURL()
  返回一个数据 URL，该 URL 包含由类型参数指定的格式的图像（默认为 png）。 返回的图像分辨率为 96dpi。
- HTMLCanvasElement.toBlob()
  创建一个 Blob 对象，表示 canvas 中包含的图像； 该文件可以由用户代理决定是否缓存在磁盘上或存储在内存中。

### 参考资料

> https://blog.csdn.net/qq_42190134/article/details/99238039 > https://www.cnblogs.com/ykCoder/p/14156450.html

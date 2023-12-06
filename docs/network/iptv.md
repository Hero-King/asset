# IPTV

## 组播技术

能够减少服务器压力, 不影响带宽

### rtsp

RTSP（Real-Time Streaming Protocol）是一种用于实时传输音频和视频数据的网络协议。它被设计用于控制流媒体服务器和客户端之间的数据传输，允许客户端通过网络连接到流媒体服务器并请求实时流媒体数据。

RTSP 提供了一种标准化的机制，用于向客户端提供对流媒体服务器上存储的多媒体资源的访问和控制。通过 RTSP，客户端可以发送指令给流媒体服务器，如播放、暂停、停止、定位等，以控制流媒体的播放行为。

RTSP 本身并不传输实际的音视频数据，它主要负责传输控制信令。实际的音视频数据通常使用 RTP（Real-time Transport Protocol）或者其他协议进行传输。

RTSP 广泛应用于实时流媒体传输领域，如视频监控系统、视频会议、直播平台等。它提供了灵活的控制和交互能力，使得客户端可以根据需要控制和定制流媒体的播放和交互体验。

### m3u

M3U（Moving Picture Experts Group Audio Layer 3 Uniform Resource Locator）是一种文本文件格式，用于存储多媒体播放列表信息。它通常包含了多个音视频文件的链接地址、标题和时长等信息，以便于播放器能够直接解析并播放这些文件。

M3U 文件最初是为 Winamp 媒体播放器而开发的，但现在它已成为广泛使用的标准格式，被许多多媒体播放器和流媒体应用程序所支持。

M3U 文件可以直接在文本编辑器中打开和修改，并且可以通过将其保存为 UTF-8 编码来支持各种语言和字符集。M3U 文件中的链接地址可以是本地路径（如电脑上的音视频文件路径）或者 URL 地址（如网络上的 HTTP 或 FTP 链接），这使得它可以用来创建不同来源的播放列表，如本地文件、在线流媒体、网络电视等。

在 IPTV 领域，M3U 文件也被广泛使用。供应商可以创建 M3U 格式的播放列表，其中包含多个电视频道或点播节目的链接地址，用户可以通过将这些播放列表导入他们的 IPTV 设备或应用程序来观看这些内容。

### 直播源

- https://github.com/fanmingming/live
- https://github.com/lylehust/Chinese-IPTV
- https://lqtv.github.io/
- 江苏联通 rtsp https://www.right.com.cn/forum/forum.php?mod=viewthread&tid=8291952&page=1#pid18673242

### 使用 ipv6 地址观看 IPTV

1. 电视上安装 `tvbox` 软件(下载路径: /cloud/aliyun/软件/电视)
2. tvbox 右上角配置页面中设置直播源:

```txt
https://fanmingming.com/txt?url=https://live.fanmingming.com/tv/m3u/v6.m3u
```

> 明明的 v6.m3u 支持回看 ipv6.m3u 不支持

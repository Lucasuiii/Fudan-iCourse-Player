# iCourse 随行播放器

在已经登录的复旦 iCourse 页面中，直接观看已开放的录播课次。支持课程课次列表、搜索、倍速、快捷键、画中画、全屏、官方字幕与断点续播。也可以粘贴本人有权限的 HLS `.m3u8` 地址观看直播。

## 安装

1. 下载并解压本文件夹（若已得到文件夹则无需解压）。
2. Chrome 或 Edge 打开扩展管理页，开启“开发者模式”，选择“加载已解压的扩展程序”，指向本文件夹。
3. 登录 [iCourse](https://icourse.fudan.edu.cn/)，进入课程页，点击右下角“随行播放器”。若课程 ID 未自动识别，把课程页面网址里的数字填入“课程 ID”后点击“打开课程”。

校园内网能直接访问 iCourse 时，直接使用 `icourse.fudan.edu.cn`，无需 WebVPN。若你从 WebVPN 中进入 iCourse，扩展会识别该代理页面，并通过 WebVPN 请求课程与视频。扩展不要求输入或保存 UIS 账号密码。

## 直播

如果你已从平台获得有权限的 `.m3u8` 直播地址，可粘贴到“已有直播地址”输入框。播放器使用 [hls.js](https://github.com/video-dev/hls.js) 播放，并提供“回到直播”按钮。参考仓库只公开了录播 MP4 的发现方式，没有直播源发现接口，因此本版本无法自动列出正在直播的课程。直播服务器若限制跨域请求，浏览器可能无法播放该地址。

## 实现与数据

- 课程列表沿用参考项目的 `/courseapi/v3/multi-search/get-course-detail`。所有课次均可尝试播放，列表会标示平台的 `playback_status`。
- 视频沿用参考项目的顺序：先查询 `/courseapi/v3/portal-home-setting/get-sub-info`，依次尝试 `video_list[*].preview_url`、`playurl[*]`、`content.playback.url`；仍没有地址时再查询 `/courseapi/v3/multi-search/get-sub-detail` 的 `content.playback.url`。`get-sub-info` 返回非零代码但附带数据时，仍检查该数据。取得地址后使用 `/userapi/v1/infosimple` 的账户信息生成相同的 `clientUUID`、`t` 参数。
- 字幕来自 `/courseapi/v3/web-socket/search-trans-result`，仅在页面内临时生成 WebVTT。
- 本地只保存课程 ID 与课次对应的播放进度。视频、字幕、账号和直播地址不会被持久保存；关闭播放器时视频暂停。

接口机制参考 [Lucasuiii/Fudan_iCourse_Subscriber](https://github.com/Lucasuiii/Fudan_iCourse_Subscriber/blob/main/src/api/icourse.py)。本扩展不是学校官方产品，请仅播放自己有权限的课程。平台接口若有变化，可能需要更新扩展。

## 第三方组件

- [CryptoJS 4.2.0](https://github.com/brix/crypto-js)，MIT 许可，见 `vendor/CRYPTO-JS-LICENSE`。
- [hls.js 1.7.3](https://github.com/video-dev/hls.js)，Apache-2.0 许可，见 `vendor/HLS-LICENSE`。

# iCourse 随行播放器

在已经登录的复旦 iCourse 页面中观看课程。支持课次列表、搜索、自动发现直播源、倍速、快捷键、画中画、全屏、官方字幕、逐句字幕跳转、断点续播与可选的轻度降噪。也可以粘贴本人有权限的 HLS `.m3u8` 地址观看直播。默认画面为 16:9；非全屏时点击画面或按空格可暂停、继续。

## 安装

1. 下载并解压本文件夹（若已得到文件夹则无需解压）。
2. Chrome 或 Edge 打开扩展管理页，开启“开发者模式”，选择“加载已解压的扩展程序”，指向本文件夹。
3. 登录 [iCourse](https://icourse.fudan.edu.cn/)，进入课程页，点击右下角“随行播放器”。若课程 ID 未自动识别，把课程页面网址里的数字填入“课程 ID”后点击“打开课程”。

校园内网能直接访问 iCourse 时，直接使用 `icourse.fudan.edu.cn`，无需 WebVPN。若你从 WebVPN 中进入 iCourse，扩展会识别该代理页面，并通过 WebVPN 请求课程与视频。扩展不要求输入或保存 UIS 账号密码。

## 直播

选择正在直播的课次时，扩展从平台的 `/courseapi/v3/portal-home-setting/get-sub-info` 读取 `live_url.output`，优先使用其 HLS 地址，并像平台播放器一样附加 `clientUUID`。若接口返回 `can_watch: false` 或没有直播地址，会显示原因，不会尝试绕过权限。平台状态可能与课表日期不同，以接口返回为准。也可从“连接直播流”粘贴本人有权限的 `.m3u8` 地址。播放器使用 [hls.js](https://github.com/video-dev/hls.js)，并提供“回到直播”按钮。直播服务器若限制跨域请求，浏览器可能无法播放该地址。

## 字幕与声音

- 播放课次时自动读取官方字幕。可用“字幕”按钮或 `C` 键切换视频字幕；侧栏“逐句字幕”可查看文本、点击跳到对应时间。若平台没有提供字幕，会显示“暂无官方字幕”。直播地址不会自动生成字幕。
- “轻度降噪”默认关闭，只过滤人声以外的低频轰鸣和高频底噪。它不是 AI 语音修复，不能消除与讲话同时出现的杂音。浏览器不能安全处理跨域音频时会保持原声，并提示不可用；切换课次后需按需重新开启。

## 实现与数据

- 课程列表沿用参考项目的 `/courseapi/v3/multi-search/get-course-detail`。所有课次均可尝试播放，列表会标示平台的 `playback_status`。
- 视频沿用参考项目的顺序：先查询 `/courseapi/v3/portal-home-setting/get-sub-info`，依次尝试 `video_list[*].preview_url`、`playurl[*]`、`content.playback.url`；仍没有地址时再查询 `/courseapi/v3/multi-search/get-sub-detail` 的 `content.playback.url`。`get-sub-info` 返回非零代码但附带数据时，仍检查该数据。取得地址后使用 `/userapi/v1/infosimple` 的账户信息生成相同的 `clientUUID`、`t` 参数。
- 直播源发现依据 iCourse 当前网页的播放逻辑：活动课次从 `get-sub-info` 的 `live_url.output` 读取直播地址；不会遍历其他课程或保存带签名的地址。课程状态与可观看权限由平台接口决定。
- 字幕来自 `/courseapi/v3/web-socket/search-trans-result`，在页面内生成 WebVTT，同时供逐句字幕列表使用。
- 本地只保存课程 ID 与课次对应的播放进度。视频、字幕、账号和直播地址不会被持久保存；关闭播放器时视频暂停。

接口机制参考 [Lucasuiii/Fudan_iCourse_Subscriber](https://github.com/Lucasuiii/Fudan_iCourse_Subscriber/blob/main/src/api/icourse.py)。本扩展不是学校官方产品，请仅播放自己有权限的课程。平台接口若有变化，可能需要更新扩展。

## 第三方组件

- [CryptoJS 4.2.0](https://github.com/brix/crypto-js)，MIT 许可，见 `vendor/CRYPTO-JS-LICENSE`。
- [hls.js 1.7.3](https://github.com/video-dev/hls.js)，Apache-2.0 许可，见 `vendor/HLS-LICENSE`。

# 本地流式字幕与人声增强可行性评估

评估日期：2026-09-30。当前实现版本：0.4.2。本文件是方案评估，不代表识别引擎或神经网络降噪已经实现或测试通过。

## 结论与优先顺序

两项功能可行，但需要先建立可靠的音频采集通道。建议按以下顺序开发独立功能分支：

1. 标签页音频采集与原声回放：暂停、切课、关闭时及时释放资源。
2. 人声增强第一版：轻度高通、可选人声频段提升、压缩及输出电平控制，保留一键原声。
3. 中文流式 ASR 原型：优先试 sherpa-onnx 的中文流式模型，提供本地识别与平台字幕两种来源。
4. 对比 RNNoise 和 DeepFilterNet，再决定是否增加更强降噪。

当前只有普通内容脚本，没有后台 service worker、offscreen document、tabCapture 权限或本地推理引擎。现有降噪是 90 Hz 高通和 8 kHz 低通；字幕来自平台转写接口。

## 音频通道

推荐从用户明确启动的标签页捕获取得课程音频，经离屏页面的 AudioContext 处理，再分别送到输出和识别分支。Chrome 官方说明：tabCapture 需要扩展调用的用户入口；捕获后原标签页会停止原来的音频输出，必须把捕获流连接到输出才能继续听到声音。Chrome 116 起支持后台取得 stream ID 后在 offscreen document 中消费。

这条路线应实测直连与 WebVPN、MP4 与 HLS。它捕获整个标签页，而非单独某个视频元素，因此应避免官方播放器与随行播放器同时发声。捕获只能处理浏览器允许捕获的内容，不能承诺所有媒体均可用。

推理与音频处理放入扩展自身的 offscreen 页面、Worker 和 AudioWorklet，不把计算堆进内容脚本或 service worker。WASM 需要相应扩展 CSP，运行时代码打包在本地；模型单独管理，首次取得模型需要网络，后续本地识别不应上传音频。

## 本地流式字幕

| 路线 | 依据 | 判断 |
| --- | --- | --- |
| sherpa-onnx + 流式 Zipformer/Paraformer + WASM | 官方有中文／中英浏览器实时示例及构建方法 | 第一候选，需要比较模型体积、识别质量和实际运行速度 |
| whisper.cpp + 滑动窗口 | 官方 stream 示例反复识别近期音频，并有浏览器版本 | 备选；需要处理重复文本、修订和断句，不能把示例当成已完成的字幕系统 |
| 本机辅助进程 | 可使用原生推理运行时 | 浏览器运行不足时再考虑，会增加安装与维护负担 |

实现时需要：

- 固定长度 PCM 队列、重采样、端点检测、暂定文字与最终句子，防止队列无限积压。
- 以视频时间映射字幕；暂停时停止入队，拖动进度或切课时清空队列并使旧结果失效。
- 第一轮先验证 1× 播放。标签页捕获的是实际播放声音，倍速可能影响识别效果和时间对齐，不能假设与 1× 等价。
- 显示字幕来源、加载进度、识别状态；平台字幕仍可切换。本地模型错误时保留正常视频播放。
- 数学表达式、英文术语与远距离讲课需要真实音频评测。流式标点、数字规范化和术语修正不能默认由所有模型提供。

不能依据桌面处理器规格直接承诺实时性能。需要在目标电脑上测持续运行时的识别耗时／音频时长比、端点后出字延迟、内存、长时间积压及中英文准确率。此轮未下载模型，也未取得课程音频做基准测试。

## 人声增强

目标是听清教师，而不是只降低声音中的低频或高频。建议提供原声与增强的响度匹配 A/B 对照。

- 第一版用温和高通、人声频段均衡、动态压缩和输出电平控制。参数应可调，避免直接高增益、强噪声门造成爆音或吞掉轻声词尾。
- RNNoise 是语音降噪候选，优先评测稳定背景噪声与人声保留；DeepFilterNet 是更强的全频带语音增强候选。实际效果、延迟、模型和运行时成本需要比较，不能预先宣称哪一个适合教室录音。
- 单路教室录音不能保证分离教师与同学，也不能保证恢复混响和过远拾音造成的缺失信息。
- 播放增强与 ASR 输入应分开。先以原声识别建立基线，再比较轻度增强是否改善识别，避免处理后的语音反而增加错字。

验证至少覆盖安静讲课、风扇／空调、键盘噪声、远距离与混响。先检查削波、失声、声画同步、听感与词尾保留，再决定默认强度；不得仅凭“处理后更响”认为更清楚。

## 官方资料

- [Chrome tabCapture](https://developer.chrome.com/docs/extensions/reference/api/tabCapture)
- [Chrome offscreen](https://developer.chrome.com/docs/extensions/reference/api/offscreen)
- [扩展 CSP 与 WASM](https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy)
- [sherpa-onnx 浏览器实时识别示例](https://k2-fsa.github.io/sherpa/onnx/wasm/hf-spaces.html)
- [sherpa-onnx WASM 构建](https://k2-fsa.github.io/sherpa/onnx/wasm/build.html)
- [whisper.cpp stream 示例](https://github.com/ggml-org/whisper.cpp/blob/master/examples/stream/README.md)
- [RNNoise](https://github.com/xiph/rnnoise)
- [DeepFilterNet](https://github.com/Rikorose/DeepFilterNet)

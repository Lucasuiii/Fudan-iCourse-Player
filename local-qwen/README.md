# Qwen 录播缓存字幕

Lyue 1.0.0 已接入播放器的“设置 → 来源 → Qwen 原版 · 录播缓存”。录播按原始音频提前识别，不需要工具栏音频捕获；直播可用 Whisper 流式备用。默认使用 [Qwen3-ASR-1.7B 未量化 BF16 权重](https://huggingface.co/mlx-community/Qwen3-ASR-1.7B-bf16)，运行时为 [mlx-qwen3-asr](https://github.com/moona3k/mlx-qwen3-asr)。

## 安装与复现

已验证 macOS、Apple M4、16 GB 内存、Python 3.13。需要 Apple Silicon；此实验未提供 Windows/Linux 后端。

在仓库根目录执行：

```sh
QWEN_HOME="$HOME/Library/Application Support/iCourseQwen"
python3 -m venv "$QWEN_HOME/venv"
"$QWEN_HOME/venv/bin/python" -m pip install -r local-qwen/requirements.txt
HF_HUB_DISABLE_XET=1 "$QWEN_HOME/venv/bin/python" local-qwen/download_model.py
```

下载脚本固定模型版本 `e1f6c266914abc5a46e8756e02580f834a6cf8a7`，权重文件约 4.08 GB，模型留在上述本机目录，另下载约 1.84 GB 的 Qwen3-ForcedAligner-0.6B 与 Silero VAD；所有模型均不放进扩展包。

提供本人有权使用的单声道 16 kHz PCM16 WAV。例如裁切片段对应原视频 10:00–40:00，则 `--offset 600`；`--position` 使用原视频时间：

```sh
"$QWEN_HOME/venv/bin/python" -u local-qwen/pilot.py \
  --audio /absolute/path/authorized-clip.wav \
  --model "$QWEN_HOME/models/qwen3-asr-1.7b-bf16" \
  --offset 600 --position 2080 --windows 10 \
  --terms '数值算法 QR 分解 Householder 变换 Givens 旋转'
```

`--terms` 可以省略或留空。切换关键词后会使用不同的缓存；旧文本不会冒充重新识别的结果。`--windows 90 --position 600` 可测完整 30 分钟。相同配置再次执行会直接复用缓存，不再加载模型。测冷缓存时给 `--state` 指定另一个本机目录。

终端只打印耗时、字符数等指标。含课堂文本的报告写到本机 `pilot-results.json`，权限为 0600；缓存每个文件也以 0600 写入，最多保留 1800 个窗口。独立 pilot 工具不启动服务；播放器服务只监听认证后的本机 8768 端口。

## 调度与时间边界

- `WindowCache.plan(position)` 返回当前位置优先、最多前瞻 100 秒的视频窗口；定位不能越过导入片段的范围。
- 每窗口覆盖 20 秒，附带前后各 2 秒上下文；边缘处裁到已导入片段内。只推理一个窗口，不并发运行模型。
- pilot 只跳过数字静音；播放器服务另外用 Silero VAD 检查是否有语音，以减少停顿误生成。VAD 不能保证消除所有幻觉。
- 缓存身份包含音频内容摘要、模型权重/配置及解码配置、课程关键词、窗口边界。截断的模型输出不会缓存。
- 基准测试连续计算指定的全部窗口以测吞吐；报告另用实测耗时模拟受 100 秒前瞻限制的顺序调度。模拟从首窗口准备好后开始播放，并按 1×、1.5×、2× 计算未及时准备的窗口数。模拟不等于真实浏览器播放验收。
- pilot 文本只有窗口时间；播放器服务用 ForcedAligner 生成字词时间戳，按词中点归属窗口，合并为短字幕。跳转/切课会丢弃旧回复；0.75×–2× 倍速切换保留缓存。

测试不下载模型，不依赖 MLX，可在 CI 中执行：

```sh
python3 -m unittest discover -s local-qwen -p 'test_*.py'
```

已完成同条件对比。按用户选择保留未量化原版，默认权重及计算精度均为 BF16；8-bit 权重及其专用缓存清理后仅保留小体积对比记录。识别与性能结果见 [Qwen 窗口缓存测试](../docs/qwen-window-pilot.md)。

## 对比报告复查

`pilot.py` 默认使用 `--precision bf16 --dtype bfloat16`。如需再次复现 8-bit 对照，必须显式提供其模型并使用 `--precision 8bit`；默认安装不再下载它。两者应使用同一 WAV、位置、窗口数、关键词及运行时版本，首次测量使用不同的空缓存目录，并顺序运行以避免 GPU 竞争。

已有两份私有报告时：

```sh
python3 local-qwen/compare.py \
  --quantized /absolute/path/8bit/pilot-results.json \
  --original /absolute/path/bf16/pilot-results.json \
  --output /absolute/path/comparison.json
```

对比工具会检查窗口边界和计算精度，并只在终端输出汇总；包含文本分歧的报告以 0600 留在指定目录。它统计两份输出的分歧，不提供准确率。`negative_controls.py --model /absolute/path/model --output /absolute/path/controls.json` 生成三个无语音控制输入，绕过缓存保护直接检查模型误生成；该结果不代表真实教室噪声性能。

## 播放器服务

安装后在仓库根目录执行 `sh local-qwen/start-macos.sh`，保持终端运行。端口为 `127.0.0.1:8768`。第一次启动会沿用已有 Whisper 连接密钥；没有旧密钥时生成 `~/Library/Application Support/iCourseQwen/connection-key.txt`，在扩展“关键词与连接”中保存它，选择 Qwen 检查连接。

模型串行处理 20 秒窗口，前后各 2 秒上下文，前瞻约 100 秒。当前窗口未就绪时临时暂停，准备好后恢复原来的播放状态；可点“取消准备”切回平台字幕。更换课程关键词会清空页面缓存并使用新的服务缓存身份；“重新载入”重新取当前与前方窗口，已有有效缓存仍会复用。服务读取有权限的课程 MP4，可复用 `local-whisper/register-recording.py` 导入的本地素材。导入片段只在覆盖当前窗口时优先使用；超出片段范围时自动尝试完整本地文件或原录播地址。跨域签名过期或录播访问受限会显示错误，不保证所有远程地址都可由 ffmpeg 读取。

[Silero VAD](https://github.com/snakers4/silero-vad) 使用 MIT 许可；[Qwen ForcedAligner](https://huggingface.co/Qwen/Qwen3-ForcedAligner-0.6B) 使用 Apache-2.0 许可。下载固定版本并检查 VAD SHA256。

## 可选豆包评分

`doubao_reference.py` 仅为手动基准工具，播放器不会调用云端。需要先取得音频上传授权和语音服务 API Key，保存到本机私有文件。每次最多上传 30 分钟、20 MB 编码音频，一份任务只提交一次，超时后再次运行只查询已有任务；拒绝或提交状态不明时停止，不自动重复付费。输出以 0600 保存。

```sh
"$QWEN_HOME/venv/bin/python" local-qwen/doubao_reference.py --audio /absolute/path/authorized.wav --key-file /absolute/path/private-api-key.txt --output /absolute/path/doubao-reference.json
python3 local-qwen/score_reference.py --reference /absolute/path/doubao-reference.json --quantized /absolute/path/8bit/pilot-results.json --original /absolute/path/bf16/pilot-results.json --output /absolute/path/scores.json
```

评分只表示与机器参考的字符一致程度，不是人工准确率。按每个模型输入窗口的精确音频范围选择参考词，双方都包含重叠上下文；统计分母也包含这些重复字符。若参考没有词时间戳则拒绝评分。

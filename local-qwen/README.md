# Qwen 窗口缓存实验

这是独立的录播音频实验工具，尚未接入扩展的字幕来源选择器。当前播放器及 Whisper 服务继续使用原来的实现。使用 [Qwen3-ASR-1.7B 的 MLX 8-bit 权重](https://huggingface.co/mlx-community/Qwen3-ASR-1.7B-8bit)，运行时为 [mlx-qwen3-asr](https://github.com/moona3k/mlx-qwen3-asr)。

## 安装与复现

已验证 macOS、Apple M4、16 GB 内存、Python 3.13。需要 Apple Silicon；此实验未提供 Windows/Linux 后端。

在仓库根目录执行：

```sh
QWEN_HOME="$HOME/Library/Application Support/iCourseQwen"
python3 -m venv "$QWEN_HOME/venv"
"$QWEN_HOME/venv/bin/python" -m pip install -r local-qwen/requirements.txt
HF_HUB_DISABLE_XET=1 "$QWEN_HOME/venv/bin/python" local-qwen/download_model.py
```

下载脚本固定模型版本 `a8379a2e2f9e313c9292cdf1af4055ab56d50d55`，权重文件约 2.46 GB，模型留在上述本机目录，不下载 ForcedAligner，也不放进扩展包。

提供本人有权使用的单声道 16 kHz PCM16 WAV。例如裁切片段对应原视频 10:00–40:00，则 `--offset 600`；`--position` 使用原视频时间：

```sh
"$QWEN_HOME/venv/bin/python" -u local-qwen/pilot.py \
  --audio /absolute/path/authorized-clip.wav \
  --model "$QWEN_HOME/models/qwen3-asr-1.7b-8bit" \
  --offset 600 --position 2080 --windows 10 \
  --terms '数值算法 QR 分解 Householder 变换 Givens 旋转'
```

`--terms` 可以省略或留空。切换关键词后会使用不同的缓存；旧文本不会冒充重新识别的结果。`--windows 90 --position 600` 可测完整 30 分钟。相同配置再次执行会直接复用缓存，不再加载模型。测冷缓存时给 `--state` 指定另一个本机目录。

终端只打印耗时、字符数等指标。含课堂文本的报告写到本机 `pilot-results.json`，权限为 0600；缓存每个文件也以 0600 写入，最多保留 1800 个窗口。本工具没有网络服务或公开课堂数据的操作。

## 调度与时间边界

- `WindowCache.plan(position)` 返回当前位置优先、最多前瞻 100 秒的视频窗口；定位不能越过导入片段的范围。
- 每窗口覆盖 20 秒，附带前后各 2 秒上下文；边缘处裁到已导入片段内。只推理一个窗口，不并发运行模型。
- 纯数字静音（PCM 振幅不超过 1 LSB）跳过模型并缓存空文本；这不是教室环境的语音 VAD，噪声和停顿仍可能产生幻觉。
- 缓存身份包含音频内容摘要、模型权重/配置及解码配置、课程关键词、窗口边界。截断的模型输出不会缓存。
- 基准测试连续计算指定的全部窗口以测吞吐；报告另用实测耗时模拟受 100 秒前瞻限制的顺序调度。模拟从首窗口准备好后开始播放，并按 1×、1.5×、2× 计算未及时准备的窗口数。模拟不等于真实浏览器播放验收。
- 模型文本包含重叠上下文，时间仅表示音频窗口，**不能当作逐句或逐字时间戳**。后续接入播放器前须完成边界去重、时间对齐、切课/跳转时丢弃旧回复以及真实浏览器验证。

测试不下载模型，不依赖 MLX，可在 CI 中执行：

```sh
python3 -m unittest discover -s local-qwen -p 'test_*.py'
```

实测结果见 [Qwen 窗口缓存测试](../docs/qwen-window-pilot.md)。

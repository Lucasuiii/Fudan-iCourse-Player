# Local ASR runtime provenance

Unmodified JavaScript files and optional WASM/data files originate from the official k2-fsa/sherpa-onnx v1.12.20 Chinese/English streaming Zipformer release:
https://github.com/k2-fsa/sherpa-onnx/releases/download/v1.12.20/sherpa-onnx-wasm-simd-v1.12.20-zh-en-asr-zipformer.tar.bz2

Archive SHA-256: e889207cd6a84973cbc028c05115cdd778ae8e277867b83169644be5b3a63c53

The upstream build uses sherpa-onnx (Apache-2.0), ONNX Runtime 1.17.1 (MIT, third-party notices included), Emscripten and its dependencies. Original sherpa-onnx LICENSE and ONNX Runtime LICENSE / ThirdPartyNotices are included. Model: sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20. The release bundle maps encoder/decoder/joiner and tokens into an Emscripten data file. Upstream build source:
https://github.com/k2-fsa/sherpa-onnx/blob/v1.12.20/.github/workflows/wasm-simd-hf-space-zh-en-asr-zipformer.yaml

WASM/data are excluded from Git. Run `python3 scripts/install-asr.py` for checksum-verified installation. Code executes from the extension package; no remote scripts are executed and no course audio is uploaded.

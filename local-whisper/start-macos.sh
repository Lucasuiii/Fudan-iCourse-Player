#!/bin/sh
set -eu
base=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
state="${ICOURSE_WHISPER_HOME:-$HOME/Library/Application Support/iCourseWhisper}"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
model="$state/models/ggml-large-v3-turbo.bin"
vad="$state/models/ggml-silero-v6.2.0.bin"
if [ ! -f "$model" ] || [ ! -f "$vad" ]; then
  printf '%s\n' '请先运行 python3 local-whisper/install-model.py'
  exit 1
fi
mkdir -p "$state/media"
exec python3 "$base/service.py" --model "$model" --state-dir "$state" --vad-model "$vad" --media-dir "$state/media" "$@"

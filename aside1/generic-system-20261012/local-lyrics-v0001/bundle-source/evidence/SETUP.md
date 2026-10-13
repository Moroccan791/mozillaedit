# Approved local lyrics setup, 2026-10-13

User direction: continue the remaining work and update handoff. The earlier
4..8-day /32..64-hour estimate was withdrawn after the user noted actual agent
implementation pace. Report measured milestone runtimes, not fixed days.

## Environment

Existing project `.venv` retained, Python3.12.10. Installed optional
`faster-whisper==1.2.1` and its wheel-only dependencies into that venv. No machine
Python/config change or new editor pipeline. Baseline installed packages captured
before/after; exact wheel hashes/package metadata/license declarations in
`pip-install-report.json`. `pip check`: no broken requirements. Runtime imports
succeed: faster-whisper1.2.1, CTranslate24.8.2; CPU int8 supported.

## Model

Systran/faster-whisper-small.en pinned revision
`d1d751a5f8271d482d14ca55d9e2deeebbae577f`, model card MIT license. Actual
model weights483,545,366bytes, SHA256 matches published Hugging Face LFS value.
Config/tokenizer/vocabulary/model-card hashes and source URLs in model-manifest.
Downloaded into `E:/ai-video-editor/models/faster-whisper-small.en-d1d751a5`.
Download/verification114.575s. No upload of raw footage/music to a provider.

First actual-song attempts failed before transcription because unconstrained
PyAV19.0.1 removed `metadata_errors` required by faster-whisper1.2.1. Pinned
compatible PyAV15.1.0 into the same venv; pip check passed and API smoke confirmed.
Old attempts/logs preserved. Exact compatible versions in packages-compatible.txt
and pip-av-compat-report.json. Added optional-runtime regression and dependency
pin instead of editing third-party packages or bypassing the existing adapter.

Existing adapter loads this local folder with offline/local_files_only, CPU/int8,
2threads,1worker,beam1,best_of1,no previous-text conditioning,no VAD filtering.
Temporary sample-zero mono16k PCM only; originals hashed before/after/read-only.
Existing caps600s decode prefix,512MiB source,60s decode/hash,120s provider by default,
600s hard provider maximum,6000words/results4MiB. Songs run sequentially.
Laptop reports8,316,334,080bytes RAM and4logical processors; this is not measured
peak-inference memory. No accuracy or listening claims from successful setup.

## Evidence boundary

Actual-song results remain `UNVERIFIED`. No alignment_verified=true, no legacy
*_words.json reuse, no lyrics silently disabled in requested renders. Real sung
word correction/listening and independent source-bound gameplay/music calibration
remain necessary. Model binaries/venv stay out of portable source bundles.

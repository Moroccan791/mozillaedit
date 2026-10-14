# Sandbox bootstrap helper (Linux only — NOT part of the Windows editor flow)
#
# The sandbox venv (/home/user/.venv) and ffmpeg/ffprobe (/home/user/.local/bin) are outside
# the repo and do not persist between sessions. This script rebuilds them and runs the suite.
# Kept here because plain files outside the repo did not survive earlier sandbox restarts.
#
#   bash aside1/sandbox-env-setup.sh          # bootstrap + full suite
#   bash aside1/sandbox-env-setup.sh --tests  # suite only

#
#   bash /home/user/env-setup.sh            # bootstrap + full test suite
#   bash /home/user/env-setup.sh --tests    # just run the suite
#
# Why: /home/user/.venv and /home/user/.local neither persist in snapshots nor
# belong in git. The repo itself always persists.
set -euo pipefail

REPO=/home/user/mozillaedit
VENV=/home/user/.venv
export PATH=/home/user/.local/bin:$PATH
# The engine's font defaults are the user's Windows paths (E:\fonts); point the
# sandbox at the licensed fonts shipped in the repo instead.
export AIVE_FONTS_ROOT=$REPO/font
# Both land outside the repo and are wiped on snapshot restore, so recreate them
# before anything tries to write a symlink into them.
mkdir -p /home/user/.local/bin /home/user/.local/node

if [ "${1:-}" != "--tests" ]; then
  if [ ! -x "$VENV/bin/python" ]; then
    python3 -m venv "$VENV"
    "$VENV/bin/pip" install --quiet --upgrade pip
    "$VENV/bin/pip" install --quiet numpy scipy soundfile librosa imageio-ffmpeg
  fi
  if ! command -v ffprobe >/dev/null 2>&1; then
    cd /home/user/.local/node
    npm install --silent --no-fund --no-audit @ffprobe-installer/linux-x64
    ln -sf /home/user/.local/node/node_modules/@ffprobe-installer/linux-x64/ffprobe /home/user/.local/bin/ffprobe
    cd - >/dev/null
  fi
  if ! command -v ffmpeg >/dev/null 2>&1; then
    FFMPEG=$("$VENV/bin/python" -c "import imageio_ffmpeg, sys; sys.stdout.write(imageio_ffmpeg.get_ffmpeg_exe())")
    ln -sf "$FFMPEG" /home/user/.local/bin/ffmpeg
  fi
  ffmpeg -version | head -1
  ffprobe -version | head -1
fi

cd "$REPO/setup"
time "$VENV/bin/python" -m unittest discover -s tests 2>&1 | tail -6

#!/bin/sh
# Starts layerling from this checkout on Linux and macOS: updates it first (when
# it is a git copy without local changes), starts the server, waits until it
# answers, and only then opens the browser. Ctrl+C stops the server again.
# The Windows counterpart is start-layerling.cmd.
cd "$(dirname "$0")/.." || exit 1
# Another port: PORT=3100 scripts/start-layerling.sh
PORT="${PORT:-3000}"
URL="http://127.0.0.1:$PORT/"

if [ -d .git ] && command -v git >/dev/null 2>&1; then
  if [ -n "$(git status --porcelain)" ]; then
    echo "There are local changes in this folder, so the update was skipped."
  else
    echo "Checking for updates..."
    before=$(git rev-parse HEAD)
    if git pull --ff-only --quiet; then
      if [ "$before" != "$(git rev-parse HEAD)" ]; then
        echo "layerling was updated. Installing dependencies..."
        npm install || exit 1
      fi
    else
      echo "The update could not be fetched - continuing with the version that is already here."
    fi
  fi
fi

npm run dev -- -p "$PORT" &
server=$!
trap 'kill "$server" 2>/dev/null' INT TERM

echo "Waiting for the server to come up..."
if PORT="$PORT" node -e '
  const net = require("net");
  let tries = 0;
  const attempt = () => {
    const socket = net.connect(Number(process.env.PORT), "127.0.0.1");
    socket.on("connect", () => { socket.destroy(); process.exit(0); });
    socket.on("error", () => {
      socket.destroy();
      if (++tries >= 90) process.exit(1);
      setTimeout(attempt, 1000);
    });
  };
  attempt();
'; then
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL" >/dev/null 2>&1
  elif command -v open >/dev/null 2>&1; then
    open "$URL"
  else
    echo "Open $URL in your browser."
  fi
else
  echo "layerling did not start within 90 seconds. Look at the messages above for errors."
fi

wait "$server"

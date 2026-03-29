#!/usr/bin/env sh
set -e

# Skilldex CLI installer
# Usage: curl -fsSL https://skilldex-web.vercel.app/install.sh | sh

PACKAGE="skilldex-cli"
MIN_NODE_MAJOR=20

# ── Colours ──────────────────────────────────────────────────────────────────
if [ -t 1 ]; then
  BOLD="\033[1m"
  GREEN="\033[32m"
  YELLOW="\033[33m"
  RED="\033[31m"
  RESET="\033[0m"
else
  BOLD="" GREEN="" YELLOW="" RED="" RESET=""
fi

info()    { printf "${BOLD}  info${RESET}  %s\n" "$1"; }
success() { printf "${GREEN}  done${RESET}  %s\n" "$1"; }
warn()    { printf "${YELLOW}  warn${RESET}  %s\n" "$1"; }
error()   { printf "${RED} error${RESET}  %s\n" "$1" >&2; }

# ── OS detection ─────────────────────────────────────────────────────────────
OS="$(uname -s 2>/dev/null || echo unknown)"
case "$OS" in
  Linux*)   PLATFORM="Linux" ;;
  Darwin*)  PLATFORM="macOS" ;;
  *)
    error "Unsupported OS: $OS"
    error "Install manually: npm install -g skilldex-cli"
    exit 1
    ;;
esac

info "Detected platform: $PLATFORM"

# ── Node.js check ────────────────────────────────────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  error "Node.js is not installed."
  error "Install Node.js $MIN_NODE_MAJOR+ from https://nodejs.org and re-run this script."
  exit 1
fi

NODE_VERSION="$(node --version | sed 's/v//')"
NODE_MAJOR="$(echo "$NODE_VERSION" | cut -d. -f1)"

if [ "$NODE_MAJOR" -lt "$MIN_NODE_MAJOR" ]; then
  error "Node.js $NODE_VERSION is installed, but $MIN_NODE_MAJOR+ is required."
  error "Upgrade at https://nodejs.org and re-run this script."
  exit 1
fi

info "Node.js $NODE_VERSION detected"

# ── npm check ────────────────────────────────────────────────────────────────
if ! command -v npm >/dev/null 2>&1; then
  error "npm is not installed. It should come with Node.js — try reinstalling from https://nodejs.org"
  exit 1
fi

# ── Install ──────────────────────────────────────────────────────────────────
info "Installing $PACKAGE via npm..."

if npm install -g "$PACKAGE" 2>&1; then
  success "$PACKAGE installed successfully"
else
  # Retry with sudo if permission error
  warn "Permission error — retrying with sudo..."
  warn "You may be prompted for your password."
  if sudo npm install -g "$PACKAGE"; then
    success "$PACKAGE installed successfully (with sudo)"
  else
    error "Installation failed."
    error "Try manually: npm install -g $PACKAGE"
    exit 1
  fi
fi

# ── Verify ───────────────────────────────────────────────────────────────────
if command -v skillpm >/dev/null 2>&1; then
  VERSION="$(skillpm --version 2>/dev/null || echo unknown)"
  success "skillpm $VERSION is ready"
  printf "\n"
  printf "  Run ${BOLD}skillpm --help${RESET} to get started.\n"
  printf "  Docs: https://skilldex-web.vercel.app/docs\n"
  printf "\n"
else
  warn "skillpm installed but not found in PATH."
  warn "Add npm's global bin to your PATH:"
  warn "  $(npm config get prefix)/bin"
fi

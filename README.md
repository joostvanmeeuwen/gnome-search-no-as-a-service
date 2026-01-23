# NaaS GNOME Search

[![Lint](https://github.com/joostvanmeeuwen/gnome-search-no-as-a-service/actions/workflows/lint.yml/badge.svg)](https://github.com/joostvanmeeuwen/gnome-search-no-as-a-service/actions/workflows/lint.yml)
[![GNOME Extensions](https://img.shields.io/badge/Install%20from-extensions.gnome.org-4A86CF?logo=gnome&logoColor=white)](https://extensions.gnome.org/extension/9186/naas-gnome-search/)

A GNOME Shell search provider for the [No-as-a-Service API](https://github.com/hotheadhacker/no-as-a-service).

## Features

- Search for excuses by typing "nee" or "no"
- Click or press Enter to copy the full excuse to the clipboard
- Caches up to 20 excuses (no duplicates)
- Fallback to cache when API is unavailable

## Installation (Development)

```bash
# Install dependencies
npm install

# Create extension directory if it doesn't exist
mkdir -p ~/.local/share/gnome-shell/extensions/gnome-search-no-as-a-service@vanmeeuwen.dev

# Copy files
cp -r * ~/.local/share/gnome-shell/extensions/gnome-search-no-as-a-service@vanmeeuwen.dev/

# Log out and log back in

# Enable the extension
gnome-extensions enable gnome-search-no-as-a-service@vanmeeuwen.dev
```

## Testing

```bash
# Check if extension is loaded
gnome-extensions list | grep gnome-search-no-as-a-service

# Check extension status
gnome-extensions info gnome-search-no-as-a-service@vanmeeuwen.dev

# Test the search provider:
# 1. Press Super key to open search
# 2. Type "nee" or "no"
# 3. Result should appear with excuse text
# 4. Click or press Enter to copy full excuse to clipboard
# 5. Paste somewhere to verify it works

# View error logs (if any issues occur)
journalctl -f /usr/bin/gnome-shell | grep -i "naas\|error"
```

## Development

```bash
# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

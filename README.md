# NaaS GNOME Search

A GNOME Shell search provider for the [No-as-a-Service API](https://github.com/hotheadhacker/no-as-a-service).

## Installation (Development)

```bash
# Create extension directory if it doesn't exist
mkdir -p ~/.local/share/gnome-shell/extensions/gnome-search-no-as-a-service@vanmeeuwen.dev

# Copy files
cp -r * ~/.local/share/gnome-shell/extensions/gnome-search-no-as-a-service@vanmeeuwen.dev/

# Restart GNOME Shell (Wayland)
# Log out and log back in (safest)

# Enable the extension
gnome-extensions enable gnome-search-no-as-a-service@vanmeeuwen.dev
```

# Custom New Tab

A lightweight, customizable Chrome New Tab extension that replaces the default new-tab page with a clean, desktop-style homepage for searching the web, accessing shortcuts, checking the latest news, and switching between light and dark themes.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)

## Features

* 🔎 **Multi-engine search**

  * Google
  * Bing
  * DuckDuckGo
  * Brave Search
  * Wikipedia
  * YouTube
* 🌐 **Direct URL navigation**

  * Enter a full website address to navigate directly instead of performing a search.
* 🔗 **Custom shortcuts**

  * Comes with useful default shortcuts such as Gmail, YouTube, GitHub, Calendar, Drive, Amazon, and Maps.
  * Add your own websites.
  * Remove shortcuts you no longer need.
* 📰 **News dashboard**

  * View headlines by category:

    * Top
    * Tech
    * Business
    * Sports
  * Uses NewsAPI for live headlines.
  * Falls back to sample headlines when the API is unavailable or not configured.
* 🌓 **Light and dark themes**

  * Switch between light and dark themes.
  * Your selected theme is saved locally.
* 🕐 **Live clock**

  * Displays the current time and date.
  * Updates automatically.
* 💾 **Local persistence**

  * Theme, selected search engine, news category, and shortcuts are stored using browser `localStorage`.
  * Includes an in-memory fallback if local storage is unavailable.

## Screenshots

Add screenshots of the extension here:

```md
![Custom New Tab](screenshots/home.png)
```

## Installation

### Install manually in Chrome

1. Clone or download this repository.

```bash
git clone https://github.com/YOUR_USERNAME/custom-new-tab.git
cd custom-new-tab
```

2. Make sure the extension files are in the project directory.

3. Open Chrome and go to:

```text
chrome://extensions/
```

4. Enable **Developer mode**.

5. Click **Load unpacked**.

6. Select the project directory.

7. Open a new tab to see the extension.

The extension uses Chrome Manifest V3 and overrides the browser's New Tab page with `newtab.html`.

## NewsAPI Configuration

The news section can retrieve live headlines from NewsAPI.

Create a `config.js` file in the project directory:

```js
const NEWS_API_KEY = "YOUR_NEWSAPI_KEY";
```

The application loads `config.js` before `app.js`, and `app.js` uses the key to request top headlines from NewsAPI.

### Important: Do not commit your API key

For a public GitHub repository, **do not commit a real API key**.

Add this to `.gitignore`:

```gitignore
config.js
```

Then provide a safe example file such as `config.example.js`:

```js
const NEWS_API_KEY = "PUT-YOUR-NEWSAPI-KEY-HERE";
```

If a real API key has already been committed to GitHub, revoke or rotate it before making the repository public.

## Project Structure

```text
custom-new-tab/
├── app.js
├── config.js
├── manifest.json
├── newtab.html
├── icon-16.png
├── icon-48.png
├── icon-128.png
├── config.example.js
├── .gitignore
└── README.md
```

### `manifest.json`

Defines the Chrome extension metadata and permissions. It uses **Manifest V3**, declares the extension name and version, and configures `newtab.html` as the Chrome New Tab override.

### `newtab.html`

Contains the user interface and styling for the new-tab homepage, including the search interface, shortcuts section, news section, theme controls, and responsive layout.

### `app.js`

Contains the application's functionality, including:

* Local storage handling
* Clock updates
* Theme switching
* Search-engine selection
* Search and URL detection
* Shortcut management
* News loading and category selection

The application stores preferences such as the theme and selected search engine locally.

### `config.js`

Contains the NewsAPI configuration. Keep this file out of source control if it contains a private API key.

## How It Works

### Search

Select a search provider and enter a query.

```text
Google → Search query
Bing → Search query
DuckDuckGo → Search query
Brave → Search query
Wikipedia → Search query
YouTube → Search query
```

If the input looks like a URL, the extension navigates directly to it instead of sending it to a search engine.

### Shortcuts

Shortcuts are stored locally in the browser. Users can add a website by entering its name and URL, and can remove existing shortcuts directly from the interface.

### News

News categories are stored locally, and selecting a category triggers a new NewsAPI request. If live news cannot be loaded, the extension displays sample headlines instead.

## Technologies

* HTML5
* CSS3
* Vanilla JavaScript
* Chrome Extensions Manifest V3
* NewsAPI
* Browser `localStorage`

No JavaScript framework or build system is required.

## Permissions

The extension requests access to:

```text
https://newsapi.org/*
```

This permission allows the extension to retrieve NewsAPI headlines.

## Customization

You can customize:

* Search engines
* Default shortcuts
* Shortcut websites
* News categories
* Colors and themes
* Layout and responsive breakpoints
* Clock formatting

The UI uses CSS custom properties for its light and dark themes, making the appearance relatively easy to modify.

## Known Limitations

* NewsAPI requires a valid API key for live headlines.
* The API key should not be exposed in a public repository.
* News is currently limited to the categories implemented in the application.
* Shortcut icons currently use a generated globe icon rather than website favicons.
* Settings are stored locally per browser/profile and are not synchronized across devices.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/my-feature
```

3. Make your changes.
4. Test the extension using **Load unpacked** in Chrome.
5. Commit your changes:

```bash
git commit -m "Add my feature"
```

6. Push the branch:

```bash
git push origin feature/my-feature
```

7. Open a Pull Request.

## License

Add your preferred license here.

For example:

```text
MIT License
```

If you choose MIT, add a `LICENSE` file containing the standard MIT License text.

---

## Roadmap

Potential future improvements:

* [ ] Drag-and-drop shortcut reordering
* [ ] Website favicons for shortcuts
* [ ] Import/export settings
* [ ] More news categories
* [ ] Configurable default search engine
* [ ] Custom backgrounds
* [ ] Keyboard shortcuts
* [ ] Weather widget
* [ ] Search suggestions
* [ ] Chrome sync support
* [ ] Options/settings page

## Acknowledgements

* [NewsAPI](https://newsapi.org/) for news data.
* Chrome Extensions documentation for the Manifest V3 platform.

---

**Built as a lightweight personal start page for Chrome.**

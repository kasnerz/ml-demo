# ML Quiz

An interactive quiz that teaches you how machine learning classification works — no prior knowledge needed.

![ML Quiz screenshot](assets/img/screenshot.png)

You are shown an image and asked to pick which class it belongs to. First you go through a **training set** to build your intuition, then a **test set** to see how well you've learned the pattern. It's the same workflow a machine learning model follows when it's trained and evaluated.

The quiz is available in Czech and English:

- **Czech:** [zdenekkasner.cz/ml-demo/](https://zdenekkasner.cz/ml-demo/)
- **English:** [zdenekkasner.cz/ml-demo/en/](https://zdenekkasner.cz/ml-demo/en/)

## Run it locally

You only need Python — no install, no build step:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/` in your browser.

## How it's built

Plain HTML, CSS, and JavaScript — no framework, no backend. The quiz questions and images are loaded from a static JSON file, so the whole thing runs directly from GitHub Pages without a server.

## Hosting your own copy

Fork the repo, go to **Settings → Pages**, choose to deploy from the `main` branch root, and GitHub will publish it automatically. That's it.

# ml-demo

Static extraction of the ML quiz from the original Flask app.

## What is included

- Czech quiz at `/`
- English quiz at `/en/`
- Static JSON configuration in `assets/data/quiz-config.json`
- Static image assets in `assets/img/train` and `assets/img/test`
- Vanilla JavaScript app in `assets/js/quiz-app.js`

## Local preview

Run a simple static server from the repository root:

```bash
python3 -m http.server 4173
```

Then open:

- `http://127.0.0.1:4173/`
- `http://127.0.0.1:4173/en/`

## GitHub Pages deployment

1. Push this repository to GitHub.
2. In the GitHub repository, open `Settings -> Pages`.
3. Set `Build and deployment` to `Deploy from a branch`.
4. Select branch `main` and folder `/ (root)`.
5. Save and wait for Pages to publish.

If your main GitHub Pages site already uses the custom domain `zdenekkasner.cz`, this project page should be reachable at:

- `https://zdenekkasner.cz/ml-demo/`
- `https://zdenekkasner.cz/ml-demo/en/`

Do not add a `CNAME` file to this repository unless you want this repository to own a separate domain by itself.

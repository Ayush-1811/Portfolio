# Portfolio

A simple static portfolio website.

## Project structure

- `index.html`
- `style.css`
- `main.js`
- `assets/`

## Local preview

Open `index.html` in a browser, or serve the folder locally:

```bash
python -m http.server 8000
# or
npx http-server .
```

## Git / repository

This workspace has basic repo metadata and a GitHub Actions workflow for Pages deployment.

Create a GitHub repo and push (example using the GitHub CLI):

```bash
gh repo create <username>/<repo> --public --source=. --remote=origin --push
```

Or create the repo on GitHub and run:

```bash
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## Deploy

The workflow in `.github/workflows/pages.yml` (if present) will deploy the repository to GitHub Pages on pushes to `main`.

## License

This project is available under the MIT License — see the `LICENSE` file.

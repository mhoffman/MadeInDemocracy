# Made In Democracy

## Vision

The idea centers around an app (mobile for in store shopper, web or browser plugin) that gives shoppers guidance for how to avoid sponsoring non-democratic regimes with everyday shopping decisions.

**Rationale:** If you live in a democracy it is easy to believe that all you can do to influence the course of your country is go vote every 4 years or so. In practice you vote everyday when you make a purchase (e.g. buy shoes, clothing, electronics, cars, etc.) you make an active decision to add some of your resources to a value chain that runs through the place where it says 'Made in ...'. Not always, but sometimes you have the choice between two or more similar products but very different political systems behind it. Send your resources to a democracy and empower their representatives. Send it away and their decisions will become meaningless.

**Further directions:** Combination with bar code scanner and product databases that direct shoppers to more 'democratic' alternatives.

---

## Live Demo

Visit: [https://mhoffman.github.io/MadeInDemocracy](https://mhoffman.github.io/MadeInDemocracy)

## Current Features

This web prototype displays **4 key governance indices** for 180+ countries:

- **Democracy Index (2015)** - Economist Intelligence Unit
- **Worker Rights (2016)** - International Trade Union Confederation
- **Press Freedom (2016)** - Reporters Without Borders
- **Corruption Perception (2024)** - Transparency International

### Visual Features

- **Color-Coded Cards:**
  - 🟢 Green = Excellent
  - 🟡 Yellow = Good
  - 🟠 Orange = Concerning
  - 🔴 Red = Critical
  - ⚫ Grey = No data

- **2x2 Grid Layout** - See all indices at a glance without scrolling
- **Interactive** - Click any card to visit the data source
- **Recommendation System** - Get quick guidance based on combined scores

## Quick Start

### Option 1: Open Locally
1. Clone this repository
2. Open `index-minimal.html` in any modern browser
3. No build process or server needed!

### Option 2: Deploy to GitHub Pages
See `DEPLOY.md` for detailed instructions.

```bash
# Quick deploy
git add index-minimal.html styles.css app-minimal.js *.js
git commit -m "Add Made In Democracy app"
git push origin main
# Then enable GitHub Pages in repo settings
```

## Project Structure

```
MadeInDemocracy/
├── index-minimal.html      # Main HTML (minimal version, recommended)
├── index.html              # React version (larger, requires CDN)
├── app-minimal.js          # Vanilla JavaScript app (~5KB)
├── app.js                  # React version (~8KB + 640KB CDN)
├── styles.css              # Styling
├── democracy_index_2015.js # Data: Democracy Index
├── ituc_data_2016.js       # Data: Worker Rights
├── fop_2016.js             # Data: Press Freedom
├── cpi_2024.js             # Data: Corruption Perception
├── convert_cpi_data.py     # Script to update CPI data
├── DATA_SOURCES.md         # Data source documentation
└── DEPLOY.md               # GitHub Pages deployment guide
```

## Technology

**Minimal Version (Recommended):**
- Pure vanilla JavaScript - no frameworks
- No build process required
- Works in all modern browsers
- Fully client-side (~150KB total)
- Fast loading (< 1 second)

**React Version (Alternative):**
- React 18 + ReactDOM from CDN
- Babel standalone for JSX
- Larger payload but same functionality

## Data Sources

All data is sourced from reputable international organizations with full attribution:

- [Economist Intelligence Unit](http://www.eiu.com/public/topical_report.aspx?campaignid=DemocracyIndex2015) - Democracy Index
- [ITUC](https://www.ituc-csi.org/ituc-global-rights-index-workers) - Global Labor Rights
- [Reporters Without Borders](https://rsf.org/en/ranking) - Press Freedom Index
- [Transparency International](https://www.transparency.org/en/cpi/2024) - Corruption Perception Index

See `DATA_SOURCES.md` for detailed information on data provenance and how to update.

## Updating Data

1. Download new data from official sources
2. Run conversion script: `python3 convert_cpi_data.py`
3. Update year in section titles (in `app-minimal.js`)
4. Test locally: `python3 -m http.server 8000`
5. Commit and deploy

## Contributing

Contributions welcome! Areas for improvement:

- [ ] Update older indices (Democracy 2015 → 2024, etc.)
- [ ] Add more countries/territories
- [ ] Improve color thresholds based on data distribution
- [ ] Add barcode scanning integration
- [ ] Create browser extension
- [ ] Mobile app version

## License

Data is sourced from public international organizations. Please maintain attribution when using this project.

Code is provided as-is for educational and informational purposes.

---

**Remember:** Every purchase is a vote for the kind of world you want to live in.

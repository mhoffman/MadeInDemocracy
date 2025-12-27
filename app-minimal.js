// Minimal vanilla JavaScript version - no JSX, no Babel needed

const DFLT = {
    rank: "???", id: "???", score: "0",
    electoralProcessandPluralism: "???", functioningOfgovernment: "???",
    politicalparticipation: "???", politicalculture: "???",
    civilliberties: "???", category: "???"
};

const ITUC_DFLT = "???";
const FOP_DFLT = "???";
const CPI_DFLT = "???";

// Color functions
function getHeaderColor(score) {
    const numScore = parseFloat(score.replace(/\*/gi, ''));
    if (numScore >= 8) return 'bg-green';
    if (numScore >= 6) return 'bg-greenyellow';
    if (numScore >= 4) return 'bg-yellow';
    if (numScore > 0) return 'bg-red';
    if (numScore === 0) return 'bg-grey';
    return 'bg-white';
}

function getDemocracyColor(score) {
    const numScore = parseFloat(score.replace(/\*/gi, ''));
    if (numScore === 0 || score === '???') return 'bg-grey';
    if (numScore >= 8) return 'bg-green';
    if (numScore >= 6) return 'bg-yellow';
    if (numScore >= 4) return 'bg-orange';
    return 'bg-red';
}

function getITUCColor(score) {
    if (score === '???') return 'bg-grey';
    const numScore = parseInt(score);
    if (numScore === 1) return 'bg-green';
    if (numScore === 2) return 'bg-yellow';
    if (numScore <= 4) return 'bg-orange';
    return 'bg-red';
}

function getPressColor(score) {
    if (score === '???') return 'bg-grey';
    const numScore = parseFloat(score);
    if (numScore < 15) return 'bg-green';
    if (numScore < 25) return 'bg-yellow';
    if (numScore < 35) return 'bg-orange';
    return 'bg-red';
}

function getCPIColor(score) {
    if (score === '???') return 'bg-grey';
    const numScore = parseFloat(score);
    if (numScore >= 70) return 'bg-green';
    if (numScore >= 50) return 'bg-yellow';
    if (numScore >= 30) return 'bg-orange';
    return 'bg-red';
}

function getVerdict(score, itucElem) {
    const numScore = parseFloat(score.replace(/\*/gi, ''));
    const numItuc = parseFloat(itucElem);
    if (numScore >= 8 && numItuc < 4) return 'Go for it!';
    if (numScore >= 6 && numItuc < 4) return 'Sounds good.';
    if (numScore >= 5 && numItuc < 4) return 'Probably okay';
    if (numScore >= 4) return 'Proceed with caution ...';
    if (numScore === 0) return 'No data available';
    return 'Look for alternatives.';
}

function getITUCMeaning(score) {
    if (score === '???') return '';
    const numScore = parseInt(score);
    const meanings = {
        1: 'Irregular violation of rights',
        2: 'Repeated violation of rights',
        3: 'Regular violation of rights',
        4: 'Systematic violation of rights',
        5: 'No guarantee of rights',
        6: 'No guarantee of rights due to the breakdown of the rule of law'
    };
    return meanings[numScore] || '';
}

// Main app
let currentCountry = 'Democracy';

function render() {
    const root = document.getElementById('root');

    // Get data
    const elem = democracyData[currentCountry] || DFLT;
    const itucElem = itucData[currentCountry] || ITUC_DFLT;
    const fopElem = fopData[currentCountry] || FOP_DFLT;
    const cpiElem = (typeof cpiData !== 'undefined' && cpiData[currentCountry]) || CPI_DFLT;

    const showData = currentCountry !== 'Democracy';
    const headerColorClass = currentCountry === 'Democracy' ? 'bg-white' : getHeaderColor(elem.score);

    // Get sorted countries
    const countries = Object.keys(democracyData).sort();

    // Build HTML
    root.innerHTML = `
        <div class="container">
            <div class="header ${headerColorClass}">
                <h1>Made In ${currentCountry}</h1>
            </div>

            <select class="country-select" id="countrySelect">
                <option value="Democracy">Select a country...</option>
                ${countries.map(c => `<option value="${c}" ${c === currentCountry ? 'selected' : ''}>${c}</option>`).join('')}
            </select>

            ${showData ? `
                <div class="recommendation">
                    Recommendation: ${getVerdict(elem.score, itucElem)}
                </div>

                <div class="indices-grid">
                    <a href="http://www.eiu.com/public/topical_report.aspx?campaignid=DemocracyIndex2015" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
                        <div class="section ${getDemocracyColor(elem.score)}">
                            <h2>Democracy Index (2015)</h2>
                            <p><strong>Overall Score:</strong> ${elem.score}</p>
                            <p>Electoral Process: ${elem.electoralProcessandPluralism}</p>
                            <p>Government Function: ${elem.functioningOfgovernment}</p>
                            <p>Political Participation: ${elem.politicalparticipation}</p>
                            <p>Civil Liberties: ${elem.civilliberties}</p>
                            <p><strong>Category:</strong> ${elem.category}</p>
                            <p class="explanation">Economist Intelligence Unit • 10: best, 0: worst</p>
                        </div>
                    </a>

                    <a href="https://www.ituc-csi.org/ituc-global-rights-index-workers" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
                        <div class="section ${getITUCColor(itucElem)}">
                            <h2>Worker Rights (2016)</h2>
                            <p><strong>ITUC Global Rights:</strong> ${itucElem}</p>
                            <p>${getITUCMeaning(itucElem)}</p>
                            <p class="explanation">International Trade Union Confederation • 1: best, 6: worst</p>
                        </div>
                    </a>

                    <a href="https://rsf.org/en/ranking" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
                        <div class="section ${getPressColor(fopElem)}">
                            <h2>Press Freedom (2016)</h2>
                            <p><strong>World Press Freedom Index:</strong> ${fopElem}</p>
                            <p class="explanation">Reporters Without Borders • 0: best, 100: worst</p>
                        </div>
                    </a>

                    <a href="https://www.transparency.org/en/cpi/2024" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
                        <div class="section ${getCPIColor(cpiElem)}">
                            <h2>Corruption Perception (2024)</h2>
                            <p><strong>CPI 2024 Score:</strong> ${cpiElem}</p>
                            <p class="explanation">Transparency International • 100: very clean, 0: highly corrupt</p>
                        </div>
                    </a>
                </div>
            ` : ''}
        </div>
    `;

    // Attach event listener
    const select = document.getElementById('countrySelect');
    if (select) {
        select.addEventListener('change', (e) => {
            currentCountry = e.target.value;
            render();
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
} else {
    render();
}

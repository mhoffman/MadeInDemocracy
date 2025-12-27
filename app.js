const { useState } = React;

// Default values
const DFLT = {
    "rank": "???",
    "id": "???",
    "score": "0",
    "electoralProcessandPluralism": "???",
    "functioningOfgovernment": "???",
    "politicalparticipation": "???",
    "politicalculture": "???",
    "civilliberties": "???",
    "category": "???"
};

const ITUC_DFLT = "???";
const FOP_DFLT = "???";
const CPI_DFLT = "???";

// Helper functions
function getColor(score) {
    const numScore = parseFloat(score.replace(/\*/gi, ''));
    if (numScore >= 8) return 'bg-green';
    if (numScore >= 6) return 'bg-greenyellow';
    if (numScore >= 4) return 'bg-yellow';
    if (numScore > 0) return 'bg-red';
    if (numScore === 0) return 'bg-grey';
    return 'bg-white';
}

// Color coding functions for each index
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
    switch (numScore) {
        case 1: return 'Irregular violation of rights';
        case 2: return 'Repeated violation of rights';
        case 3: return 'Regular violation of rights';
        case 4: return 'Systematic violation of rights';
        case 5: return 'No guarantee of rights';
        case 6: return 'No guarantee of rights due to the breakdown of the rule of law';
        default: return '';
    }
}

function MainView() {
    const [country, setCountry] = useState('Democracy');

    // Get data for selected country
    const elem = democracyData.hasOwnProperty(country) ? democracyData[country] : DFLT;
    const itucElem = itucData.hasOwnProperty(country) ? itucData[country] : ITUC_DFLT;
    const fopElem = fopData.hasOwnProperty(country) ? fopData[country] : FOP_DFLT;
    const cpiElem = (typeof cpiData !== 'undefined' && cpiData.hasOwnProperty(country)) ? cpiData[country] : CPI_DFLT;

    const showData = country !== 'Democracy';
    const headerColorClass = country === 'Democracy' ? 'bg-white' : getColor(elem.score);

    // Get sorted list of countries from democracy data
    const countries = Object.keys(democracyData).sort();

    return (
        <div className="container">
            <div className={`header ${headerColorClass}`}>
                <h1>Made In {country}</h1>
            </div>

            <select
                className="country-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
            >
                <option value="Democracy">Select a country...</option>
                {countries.map(countryName => (
                    <option key={countryName} value={countryName}>
                        {countryName}
                    </option>
                ))}
            </select>

            {showData && (
                <div className="recommendation">
                    Recommendation: {getVerdict(elem.score, itucElem)}
                </div>
            )}

            {showData && (
                <div className="indices-grid">
                    <a
                        href="http://www.eiu.com/public/topical_report.aspx?campaignid=DemocracyIndex2015"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div className={`section ${getDemocracyColor(elem.score)}`}>
                            <h2>Democracy Index (2015)</h2>
                            <p><strong>Overall Score:</strong> {elem.score}</p>
                            <p>Electoral Process: {elem.electoralProcessandPluralism}</p>
                            <p>Government Function: {elem.functioningOfgovernment}</p>
                            <p>Political Participation: {elem.politicalparticipation}</p>
                            <p>Civil Liberties: {elem.civilliberties}</p>
                            <p><strong>Category:</strong> {elem.category}</p>
                            <p className="explanation">Economist Intelligence Unit • 10: best, 0: worst</p>
                        </div>
                    </a>

                    <a
                        href="https://www.ituc-csi.org/ituc-global-rights-index-workers"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div className={`section ${getITUCColor(itucElem)}`}>
                            <h2>Worker Rights (2016)</h2>
                            <p><strong>ITUC Global Rights:</strong> {itucElem}</p>
                            <p>{getITUCMeaning(itucElem)}</p>
                            <p className="explanation">International Trade Union Confederation • 1: best, 6: worst</p>
                        </div>
                    </a>

                    <a
                        href="https://rsf.org/en/ranking"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div className={`section ${getPressColor(fopElem)}`}>
                            <h2>Press Freedom (2016)</h2>
                            <p><strong>World Press Freedom Index:</strong> {fopElem}</p>
                            <p className="explanation">Reporters Without Borders • 0: best, 100: worst</p>
                        </div>
                    </a>

                    <a
                        href="https://www.transparency.org/en/cpi/2024"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div className={`section ${getCPIColor(cpiElem)}`}>
                            <h2>Corruption Perception (2024)</h2>
                            <p><strong>CPI 2024 Score:</strong> {cpiElem}</p>
                            <p className="explanation">Transparency International • 100: very clean, 0: highly corrupt</p>
                        </div>
                    </a>
                </div>
            )}
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainView />);

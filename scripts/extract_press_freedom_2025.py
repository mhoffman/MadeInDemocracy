#!/usr/bin/env python3
"""
Extract World Press Freedom Index 2025 data from Wikipedia HTML

Usage:
    python3 extract_press_freedom_2025.py

Input: /Users/maxjh/Downloads/World Press Freedom Index - Wikipedia.html
Output: fop_2025.js
"""

import re
from datetime import datetime

def extract_press_freedom_index():
    html_path = '/Users/maxjh/Downloads/World Press Freedom Index - Wikipedia.html'

    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: File not found at {html_path}")
        print("Please download the Wikipedia page and save it to the Downloads folder")
        return False

    # Extract country names and scores using regex
    # Pattern looks for country links followed by scores after <br />
    # Format: <a>Country</a></span></td><td>(...)<br />SCORE
    pattern = r'<a href="/wiki/([^"]+)" title="([^"]+)">([^<]+)</a>.*?</td>\s*<td[^>]*>\([0-9]+\)<br />([0-9.]+)'
    matches = re.findall(pattern, content, re.DOTALL)

    fop_data = {}
    for match in matches:
        wiki_link, title, country_name, score = match
        country = country_name.strip()
        country = re.sub(r'\s+', ' ', country)

        try:
            score_num = float(score)
            # Validate score range (0-100) and country name
            if 0 <= score_num <= 100 and len(country) > 2 and not country.replace('.', '').isdigit():
                # Normalize country names for consistency
                if country == "United States":
                    country = "United States of America"

                if country not in fop_data:
                    fop_data[country] = score_num
        except ValueError:
            pass

    # Remove invalid entries
    invalid_keys = [k for k in fop_data.keys() if k.replace('.', '').isdigit() or len(k) <= 2 or k.lower() in ['countries', 'country', 'region']]
    for key in invalid_keys:
        del fop_data[key]

    print(f"Extracted {len(fop_data)} countries from Press Freedom Index 2025")

    # Show top 10 (best press freedom = HIGHEST score in new scale)
    print("\nTop 10 (most free - highest scores):")
    for country, score in sorted(fop_data.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {country}: {score}")

    print("\nBottom 10 (least free - lowest scores):")
    for country, score in sorted(fop_data.items(), key=lambda x: x[1])[:10]:
        print(f"  {country}: {score}")

    # Write to JavaScript file
    sorted_data = sorted(fop_data.items())

    output = f"""// World Press Freedom Index 2025
// Source: Reporters Without Borders via Wikipedia
// URL: https://rsf.org/en/ranking
// Wikipedia: https://en.wikipedia.org/wiki/World_Press_Freedom_Index
// Download date: {datetime.now().strftime('%Y-%m-%d')}
// Scale: 0-100 (100 = best/most free, 0 = worst/least free)
// Note: Scale was inverted in recent years - higher score now means MORE press freedom
// Total countries: {len(fop_data)}

var fopData = {{
"""

    for i, (country, score) in enumerate(sorted_data):
        country_escaped = country.replace('"', '\\"')
        # Convert to int if whole number, otherwise keep decimal
        if score == int(score):
            score_str = str(int(score))
        else:
            score_str = str(score)

        comma = ',' if i < len(sorted_data) - 1 else ''
        output += f'    "{country_escaped}": {score_str}{comma}\n'

    output += "}\n"

    # Write to file
    output_path = 'fop_2025.js'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output)

    print(f"\n✓ Successfully wrote {output_path} with {len(fop_data)} countries")
    return True

if __name__ == '__main__':
    extract_press_freedom_index()

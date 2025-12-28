#!/usr/bin/env python3
"""
Extract Democracy Index 2024 data from Wikipedia HTML

Usage:
    python3 extract_democracy_2024.py

Input: /Users/maxjh/Downloads/The Economist Democracy Index - Wikipedia.html
Output: democracy_index_2024.js
"""

import re
from datetime import datetime

def extract_democracy_index():
    # Read HTML
    html_path = '/Users/maxjh/Downloads/The Economist Democracy Index - Wikipedia.html'

    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: File not found at {html_path}")
        print("Please download the Wikipedia page and save it to the Downloads folder")
        return False

    # Extract country names and scores using regex
    # Pattern looks for country links followed by scores in <b> tags
    pattern = r'<a href="/wiki/([^"]+)" title="([^"]+)">([^<]+)</a>\s*</td>.*?<b>([0-9.]+)</b>'
    matches = re.findall(pattern, content, re.DOTALL)

    democracy_data = {}
    for match in matches:
        wiki_link, title, country_name, score = match
        country = country_name.strip()
        country = re.sub(r'\s+', ' ', country)

        try:
            score_num = float(score)
            # Validate score range and country name
            if 0 <= score_num <= 10 and len(country) > 2 and not country.replace('.', '').isdigit():
                if country not in democracy_data:
                    democracy_data[country] = score_num
        except ValueError:
            pass

    # Remove invalid entries (just numbers, etc.)
    invalid_keys = [k for k in democracy_data.keys() if k.replace('.', '').isdigit() or len(k) <= 2]
    for key in invalid_keys:
        del democracy_data[key]

    print(f"Extracted {len(democracy_data)} countries from Democracy Index 2024")

    # Show top 10 for verification
    print("\nTop 10 democracies:")
    for country, score in sorted(democracy_data.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {country}: {score}")

    print("\nBottom 10 democracies:")
    for country, score in sorted(democracy_data.items(), key=lambda x: x[1])[:10]:
        print(f"  {country}: {score}")

    # Write to JavaScript file
    sorted_data = sorted(democracy_data.items())

    output = f"""// Democracy Index 2024
// Source: Economist Intelligence Unit via Wikipedia
// URL: https://www.eiu.com/
// Wikipedia: https://en.wikipedia.org/wiki/Democracy_Index
// Download date: {datetime.now().strftime('%Y-%m-%d')}
// Scale: 0-10 (10 = full democracy, 0 = authoritarian)
// Total countries: {len(democracy_data)}

var democracyData = {{
"""

    for i, (country, score) in enumerate(sorted_data):
        country_escaped = country.replace('"', '\\"')
        comma = ',' if i < len(sorted_data) - 1 else ''

        # Create entry with score and placeholder for detailed data
        output += f'    "{country_escaped}": {{'
        output += f'"score": "*{score}*", '
        output += f'"rank": {i+1}, '
        output += f'"id": "{country_escaped}", '
        output += f'"electoralProcessandPluralism": "???", '
        output += f'"functioningOfgovernment": "???", '
        output += f'"politicalparticipation": "???", '
        output += f'"politicalculture": "???", '
        output += f'"civilliberties": "???", '
        output += f'"category": "???"'
        output += f'}}{comma}\n'

    output += "}\n"

    # Write to file
    output_path = 'democracy_index_2024.js'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output)

    print(f"\n✓ Successfully wrote {output_path} with {len(democracy_data)} countries")
    return True

if __name__ == '__main__':
    extract_democracy_index()

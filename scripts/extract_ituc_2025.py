#!/usr/bin/env python3
"""
Extract ITUC Global Rights Index 2025 data from PDF

Usage:
    python3 extract_ituc_2025.py

Input: /Users/maxjh/Downloads/en__global_right_index_2025__final_web.pdf
Output: ituc_data_2025.js

Note: Requires pdfplumber or PyPDF2
Install: pip3 install pdfplumber
"""

import re
from datetime import datetime

def extract_ituc_index():
    pdf_path = '/Users/maxjh/Downloads/en__global_right_index_2025__final_web.pdf'

    try:
        import pdfplumber
    except ImportError:
        print("Error: pdfplumber not installed")
        print("Install with: pip3 install pdfplumber")
        return False

    try:
        ituc_data = {}
        current_rating = None

        with pdfplumber.open(pdf_path) as pdf:
            print(f"Processing PDF with {len(pdf.pages)} pages...")

            for page_num, page in enumerate(pdf.pages, 1):
                text = page.extract_text()

                if not text:
                    continue

                lines = text.split('\n')

                for line in lines:
                    line = line.strip()

                    # Look for rating headers like "Rating 5+ NO GUARANTEE OF RIGHTS DUE TO THE BREAKDOWN OF THE RULE OF LAW"
                    rating_match = re.match(r'Rating\s+([1-6]|5\+)', line, re.IGNORECASE)
                    if rating_match:
                        current_rating = rating_match.group(1)
                        continue

                    # If we have a current rating, check if line contains country names
                    if current_rating and line:
                        # Skip section headers and descriptions
                        if re.search(r'(VIOLATION|RIGHTS|GUARANTEE|RULE OF LAW|Index|Rating|Page)', line, re.IGNORECASE):
                            continue

                        # Split line by common delimiters to get multiple countries per line
                        # Countries can be separated by tabs, multiple spaces, or nothing (just country names)
                        potential_countries = re.split(r'\s{2,}|\t', line)

                        for country in potential_countries:
                            country = country.strip()

                            # Clean up and validate country name
                            if len(country) > 3 and not re.search(r'\d{4}|ITUC|GLOBAL|INDEX', country):
                                # Remove common prefixes/suffixes
                                country = re.sub(r'\s+', ' ', country)

                                # Skip obvious non-country entries
                                skip_words = ['Workers', 'Trade', 'Union', 'Page', 'www', 'Credit', 'Source', 'Photo']
                                if not any(word in country for word in skip_words):
                                    if country not in ituc_data:
                                        ituc_data[country] = current_rating

        print(f"\nExtracted {len(ituc_data)} countries from ITUC 2025")

        # Show sample for verification
        print("\nSample entries:")
        for i, (country, rating) in enumerate(sorted(ituc_data.items())[:15]):
            print(f"  {country}: {rating}")

        if len(ituc_data) < 50:
            print("\n⚠️  Warning: Only found {} countries. The PDF might need manual parsing.".format(len(ituc_data)))
            print("You may need to adjust the regex patterns or extract data manually.")
            return False

        # Write to JavaScript file
        sorted_data = sorted(ituc_data.items())

        output = f"""// ITUC Global Rights Index 2025
// Source: International Trade Union Confederation
// URL: https://www.ituc-csi.org/ituc-global-rights-index
// PDF: en__global_right_index_2025__final_web.pdf
// Download date: {datetime.now().strftime('%Y-%m-%d')}
// Scale: 1-6 (1 = best, 6 = worst) + 5+ for severe violations
// Total countries: {len(ituc_data)}

var itucData = {{
"""

        for i, (country, rating) in enumerate(sorted_data):
            country_escaped = country.replace('"', '\\"')
            comma = ',' if i < len(sorted_data) - 1 else ''
            output += f'    "{country_escaped}": "{rating}"{comma}\n'

        output += "}\n"

        # Write to file
        output_path = 'ituc_data_2025.js'
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(output)

        print(f"\n✓ Successfully wrote {output_path} with {len(ituc_data)} countries")
        return True

    except FileNotFoundError:
        print(f"Error: PDF not found at {pdf_path}")
        return False
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return False

if __name__ == '__main__':
    extract_ituc_index()

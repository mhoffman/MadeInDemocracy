#!/usr/bin/env python3
"""
Extract ITUC Global Rights Index 2025 data from PDF
This version focuses on pages 19-20 which contain the country rating lists
"""

import re
from datetime import datetime

def extract_ituc_index():
    pdf_path = '/Users/maxjh/Downloads/en__global_right_index_2025__final_web.pdf'

    try:
        import pdfplumber
    except ImportError:
        print("Error: pdfplumber not installed")
        return False

    try:
        ituc_data = {}

        with pdfplumber.open(pdf_path) as pdf:
            # Pages 19-21 contain the country lists
            text = ""
            for page_num in [18, 19, 20]:  # 0-indexed, so pages 19-21
                if page_num < len(pdf.pages):
                    text += pdf.pages[page_num].extract_text() + "\n"

            print("Extracting country ratings from pages 19-21...")

            # Split into sections by rating
            current_rating = None
            in_country_list = False

            for line in text.split('\n'):
                line = line.strip()

                # Detect rating headers
                rating_match = re.match(r'Rating\s+([1-6]|5\+)\s+(.+)', line, re.IGNORECASE)
                if rating_match:
                    current_rating = rating_match.group(1)
                    in_country_list = True
                    continue

                # Stop when we hit a new section
                if re.search(r'(Workers.*rights|IMPROVED|WORSE|2025 ITUC)', line, re.IGNORECASE):
                    in_country_list = False
                    continue

                # Extract countries if we're in a country list
                if current_rating and in_country_list and line:
                    # Skip description lines
                    if re.search(r'(VIOLATION|RIGHTS|GUARANTEE|RULE OF LAW|THE 2025)', line, re.IGNORECASE):
                        continue

                    # Countries are listed separated by spaces
                    # Some country names are multi-word like "United Kingdom", "Costa Rica"
                    # Extract all potential country names from the line
                    words = line.split()

                    # Build country names (handling multi-word countries)
                    i = 0
                    while i < len(words):
                        word = words[i]

                        # Known multi-word country patterns
                        if i + 1 < len(words):
                            two_word = f"{word} {words[i+1]}"
                            if two_word in ["United States", "United Kingdom", "United Arab", "Costa Rica",
                                            "El Salvador", "Saudi Arabia", "New Zealand", "South Africa",
                                            "South Sudan", "North Macedonia", "Central African", "Dominican Republic",
                                            "Trinidad and", "Sierra Leone", "Sri Lanka", "Hong Kong", "Bosnia and",
                                            "Burkina Faso", "Czech Republic", "Russian Federation", "South Korea"]:
                                if i + 2 < len(words):
                                    if two_word == "United States" and words[i+2] == "of":
                                        country = "United States of America"
                                        i += 4  # Skip "of America"
                                    elif two_word == "United Arab" and words[i+2] == "Emirates":
                                        country = "United Arab Emirates"
                                        i += 3
                                    elif two_word == "Central African" and words[i+2] == "Republic":
                                        country = "Central African Republic"
                                        i += 3
                                    elif two_word == "Dominican Republic":
                                        country = "Dominican Republic"
                                        i += 2
                                    elif two_word == "Trinidad and" and words[i+2] == "Tobago":
                                        country = "Trinidad and Tobago"
                                        i += 3
                                    elif two_word == "Bosnia and" and words[i+2] == "Herzegovina":
                                        country = "Bosnia and Herzegovina"
                                        i += 3
                                    elif two_word == "Burkina Faso":
                                        country = "Burkina Faso"
                                        i += 2
                                    elif two_word == "Czech Republic":
                                        country = "Czech Republic"
                                        i += 2
                                    elif two_word == "Russian Federation":
                                        country = "Russia"  # Normalize to "Russia"
                                        i += 2
                                    elif two_word == "South Korea":
                                        country = "South Korea"
                                        i += 2
                                    else:
                                        country = two_word
                                        i += 2
                                else:
                                    # Handle two-word patterns at end of list
                                    if two_word == "Burkina Faso":
                                        country = "Burkina Faso"
                                    elif two_word == "Czech Republic":
                                        country = "Czech Republic"
                                    elif two_word == "Russian Federation":
                                        country = "Russia"
                                    elif two_word == "South Korea":
                                        country = "South Korea"
                                    else:
                                        country = two_word
                                    i += 2

                                if country not in ituc_data:
                                    ituc_data[country] = current_rating
                                continue

                        # Single word country
                        if len(word) > 2 and word[0].isupper():
                            # Skip page numbers, obvious non-countries, and fragments of multi-word names
                            # Note: "Czechia" is valid (official short name for Czech Republic)
                            # Note: "Korea" likely refers to South Korea in this context
                            skip_words = ['Rating', 'THE', 'RIGHTS', 'INDEX', 'Federation', 'Republic', 'Burkina', 'Faso', 'Russian']
                            if not word.isdigit() and word not in skip_words:
                                # Normalize specific single-word countries
                                country = word
                                if word == "Czechia":
                                    country = "Czech Republic"
                                elif word == "Korea":
                                    country = "South Korea"

                                if country not in ituc_data:
                                    ituc_data[country] = current_rating

                        i += 1

        print(f"\nExtracted {len(ituc_data)} countries from ITUC 2025")

        # Show distribution by rating
        rating_counts = {}
        for country, rating in ituc_data.items():
            rating_counts[rating] = rating_counts.get(rating, 0) + 1

        print("\nDistribution by rating:")
        for rating in ['1', '2', '3', '4', '5', '5+']:
            count = rating_counts.get(rating, 0)
            print(f"  Rating {rating}: {count} countries")

        # Show samples
        print("\nSample entries by rating:")
        for rating in ['1', '2', '3', '4', '5', '5+']:
            countries = [c for c, r in ituc_data.items() if r == rating]
            if countries:
                print(f"\n  Rating {rating}:")
                for c in sorted(countries)[:5]:
                    print(f"    {c}")

        # Write to JavaScript file
        sorted_data = sorted(ituc_data.items())

        output = f"""// ITUC Global Rights Index 2025
// Source: International Trade Union Confederation
// URL: https://www.ituc-csi.org/ituc-global-rights-index
// PDF: en__global_right_index_2025__final_web.pdf
// Download date: {datetime.now().strftime('%Y-%m-%d')}
// Scale: 1-6 (1 = best, 6 = worst) + 5+ for rights violations due to breakdown of rule of law
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
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    extract_ituc_index()

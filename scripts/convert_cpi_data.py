#!/usr/bin/env python3
"""
Convert Transparency International CPI data to JavaScript format

Usage:
    1. Download the CPI 2024 data from:
       https://www.transparency.org/en/cpi/2024/media-kit

    2. Save it as 'cpi_2024_source.csv' in the same directory
       Expected CSV format: Country,Score (or similar)

    3. Run: python3 convert_cpi_data.py

    4. This will update cpi_2024.js with the full dataset

Author: Generated for MadeInDemocracy project
Date: 2025
"""

import csv
import json
from datetime import datetime

def convert_csv_to_js(input_csv='cpi_2024_source.csv', output_js='cpi_2024.js'):
    """Convert CPI CSV data to JavaScript module format"""

    # Dictionary to store country: score mappings
    cpi_data = {}

    try:
        with open(input_csv, 'r', encoding='utf-8') as csvfile:
            # Try to detect the CSV format
            sample = csvfile.read(1024)
            csvfile.seek(0)

            # Detect delimiter
            sniffer = csv.Sniffer()
            delimiter = sniffer.sniff(sample).delimiter

            reader = csv.DictReader(csvfile, delimiter=delimiter)

            # Try common column name variations
            country_col = None
            score_col = None

            for col in reader.fieldnames:
                col_lower = col.lower()
                if 'country' in col_lower or 'nation' in col_lower or 'territory' in col_lower:
                    country_col = col
                if 'score' in col_lower or 'cpi' in col_lower or '2024' in col_lower:
                    score_col = col

            if not country_col or not score_col:
                print(f"Error: Could not identify columns. Found: {reader.fieldnames}")
                print("Please specify column names manually in the script")
                return False

            print(f"Using columns: Country='{country_col}', Score='{score_col}'")

            # Read data
            for row in reader:
                country = row[country_col].strip()
                try:
                    score = float(row[score_col])
                    cpi_data[country] = score
                except (ValueError, KeyError):
                    print(f"Warning: Skipping invalid row for {country}")
                    continue

        # Generate JavaScript file
        header = f"""// Corruption Perception Index 2024
// Source: Transparency International
// URL: https://www.transparency.org/en/cpi/2024
// Download date: {datetime.now().strftime('%Y-%m-%d')}
// Scale: 0 (highly corrupt) to 100 (very clean)
// Total countries: {len(cpi_data)}

var cpiData = {{
"""

        # Sort countries alphabetically for easier maintenance
        sorted_countries = sorted(cpi_data.items())

        entries = []
        for country, score in sorted_countries:
            # Handle special characters in country names
            country_escaped = country.replace('"', '\\"')
            entries.append(f'    "{country_escaped}": {score}')

        footer = "\n}\n"

        # Write to file
        with open(output_js, 'w', encoding='utf-8') as jsfile:
            jsfile.write(header)
            jsfile.write(',\n'.join(entries))
            jsfile.write(footer)

        print(f"✓ Successfully converted {len(cpi_data)} countries to {output_js}")
        print(f"\nTop 5 least corrupt:")
        for country, score in sorted(cpi_data.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"  {country}: {score}")

        print(f"\nBottom 5 most corrupt:")
        for country, score in sorted(cpi_data.items(), key=lambda x: x[1])[:5]:
            print(f"  {country}: {score}")

        return True

    except FileNotFoundError:
        print(f"Error: Could not find {input_csv}")
        print("Please download the CPI 2024 data and save it as 'cpi_2024_source.csv'")
        print("Download from: https://www.transparency.org/en/cpi/2024/media-kit")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == '__main__':
    print("CPI Data Converter for MadeInDemocracy")
    print("=" * 50)
    convert_csv_to_js()

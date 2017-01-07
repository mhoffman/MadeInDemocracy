#!/usr/bin/env python
import json
import numpy as np
import pandas  as pd

data = {}

with open("ituc_index.txt") as infile:
    line = None
    i = 0
    while line != '':
        line = infile.readline()
        sline = line.strip()
        j = i % 4
        if j == 0:
            country = sline
        elif j == 2:
            score = sline
            data[country] = score
        i += 1

with open('ituc_data_2016.json', 'w') as outfile:
    json.dump(data, outfile, sort_keys=True, indent=4, separators=(',', ': '))


fop_data = pd.read_csv('fop.csv', delimiter=',', quotechar='"', decimal=',')

fop_dict = {}
for (i, elem) in fop_data[['EN_country', 'Overall Score 2016']].iterrows():
    country, score = elem
    print(country)
    print(score)
    fop_dict[country] = score

with open('fop_2016.json', 'w') as outfile:
    json.dump(fop_dict, outfile, sort_keys=True, indent=4, separators=(',', ': '))

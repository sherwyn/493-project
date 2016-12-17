import json
import os
import collections
import datetime
from pprint import pprint

data_output = {}
community_id = {}
cid = 0
data_output['NULL'] = {};
community_id['NULL'] = cid
cid = cid + 1

with open('communities.txt') as f:
    communities = f.read().split('\n')
    for i in range(len(communities)):
        data_output[communities[i]] = {};
        community_id[communities[i]] = cid
        cid = cid + 1

for year in range(2009, 2017):
    filename = 'crime_data/crime_' + str(year)
    with open(filename + '.txt') as f:
        data_communities = f.read().split('\n')
        
    with open(filename + '.json') as f:    
        data = json.load(f)
        for i in range(len(data)):
            # data[i]['community'] = data_communities[i]

            c = data_communities[i]
            d = data[i]['date']
            d = str(d[0:7])
            # d = datetime.datetime.strptime(d, '%Y-%m-%dT%H:%M:%S').strftime('%Y%m%d')
            if d in data_output[c]:
                if data[i]['category'] == 'Violent Crime':
                    data_output[c][d][0] += 1
                elif data[i]['category'] == 'Property Crime':
                    data_output[c][d][1] += 1
                elif data[i]['category'] == 'Quality-of-Life Crime':
                    data_output[c][d][2] += 1
            else:
                data_output[c][d] = [0, 0, 0]

mydict  = data_output['NULL']
od = collections.OrderedDict(sorted(mydict.items()))

# for key, value in od.items():
#     print key + ' ' + str(value)

# os.remove(filename + '.json')
# with open(filename + '.json', 'w') as f:
#     json.dump(data, f, indent=2)
# import ipdb; ipdb.set_trace();
for c in communities:
    with open('historical_graph_categorized/' + str(community_id[c]) + '.historical', 'w') as f:
        mydict = data_output[c]
        od = collections.OrderedDict(sorted(mydict.items()))
        f.write('date\tviolent\tproperty\tquality\n')
        for key, value in od.items():
            f.write(key + '\t' + str(value[0]) + '\t' + str(value[1]) + '\t' + str(value[2]) + '\n')

    f.close()
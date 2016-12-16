import json
import os
from pprint import pprint

filename = 'crime_Oct30_Nov30'

data_output = {}
community_id = {}
cid = 0
data_output['NULL'] = [];
community_id['NULL'] = cid
cid = cid + 1

with open('communities.txt') as f:
	communities = f.read().split('\n')
	for i in range(len(communities)):
		data_output[communities[i]] = [];
		community_id[communities[i]] = cid
		cid = cid + 1

with open(filename + '.txt') as f:
	data_communities = f.read().split('\n')
	
with open(filename + '.json') as f:    
    data = json.load(f)
    for i in range(len(data)):
    	data[i]['community'] = data_communities[i]
    	data_output[data_communities[i]].append(data[i])
    	
os.remove(filename + '.json')
with open(filename + '.json', 'w') as f:
    json.dump(data, f, indent=2)

for key, value in data_output.items():
	with open('data/' + filename + '/' + str(community_id[key]) + '.crime', 'w') as f:
	    json.dump(value, f, indent=2)

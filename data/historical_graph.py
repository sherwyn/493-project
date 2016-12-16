import json
import os
import collections
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
	    	if d in data_output[c]:
	    		data_output[c][d] = data_output[c][d] + 1
	    	else:
	    		data_output[c][d] = 0

mydict  = data_output['NULL']
od = collections.OrderedDict(sorted(mydict.items()))

# for key, value in od.items():
# 	print key + ' ' + str(value)

# os.remove(filename + '.json')
# with open(filename + '.json', 'w') as f:
#     json.dump(data, f, indent=2)
import ipdb; ipdb.set_trace();
for c in communities:
	with open('historical_graph/' + str(community_id[c]) + '.historical', 'w') as f:
		mydict = data_output[c]
		od = collections.OrderedDict(sorted(mydict.items()))
		f.write('date\tclose\n')
		for key, value in od.items():
			f.write(key + '\t' + str(value) + '\n')

	f.close()




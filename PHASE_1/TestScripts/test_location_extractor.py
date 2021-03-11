import spacy
from spacy import displacy

nlp = spacy.load('xx_ent_wiki_sm')

# Text with nlp
doc = nlp(" Multiple tornado warnings were issued for parts of New York on Sunday night.The first warning, which expired at 9 p.m., covered the Bronx, Yonkers and New Rochelle. More than 2 million people live in the impacted area. New South Wales")

locations = list(filter(lambda x: x.ent_type_ == "LOC", doc))

new_locations = list()
index = 0
while index < len(locations)-1:
	new_location = str()

	new_location += locations[index].text
	inner_index = index

	while inner_index < len(locations)-1:
		if locations[inner_index].i == locations[inner_index+1].i-1:
			new_location += " "+locations[inner_index+1].text
			inner_index += 1
		else:
			inner_index += 1
			break

	index = inner_index
	
	new_locations.append(new_location)

for i in locations:
	print("%s (%s)" % (i, i.i))

print(new_locations)

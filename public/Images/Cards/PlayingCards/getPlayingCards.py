import requests
from bs4 import BeautifulSoup
import pprint as pp

# https://www.random.org/playing-cards/54.png

rootURL = 'https://www.random.org/playing-cards/'
fileLocation = r"C:\Users\kevin.gillanders\Desktop\projects\Cards\PlayingCards\basic\\"

for x in range(1,55):
	try:
		img = "{}.png".format(x)
		fullfilename = "{}{}".format(fileLocation, img)
		
		url = "{}{}".format(rootURL, img)
		print(url)
		print(fullfilename)
		r = requests.get(url)
		with open(fullfilename, 'wb') as out:
			out.write(r.content)

		
	except AttributeError as e:
		print(e)
	except OSError as e:
		print(e)
			


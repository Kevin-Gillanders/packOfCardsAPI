import urllib.request
from bs4 import BeautifulSoup
import pprint as pp


rootURL = 'https://www.tarotcardmeanings.net/images/tarotcards120px/'
fileLocation = r"C:\Users\kevin.gillanders\Desktop\projects\TarotCards\medium120px\\"

with urllib.request.urlopen(rootURL) as res:
	content =  BeautifulSoup(res, 'lxml')
	rows = content.find("table")
	print(rows)
	for x in rows:
		try:
			img = x.find('a').get('href')
			pp.pprint(img)
			pp.pprint("======================")
			
			fullfilename = "{}{}".format(fileLocation, img)
			
			url = "{}{}".format(rootURL, img)
			urllib.request.urlretrieve(url, fullfilename)

			
		except AttributeError:
			print("nope")
		except OSError:
			print("nope")
			
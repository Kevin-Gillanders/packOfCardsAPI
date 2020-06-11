import urllib.request
from bs4 import BeautifulSoup
import pprint as pp
from pathlib import Path

# https://www.tarotcardmeanings.net/images/tarotcards-large/
# https://www.tarotcardmeanings.net/images/tarotcards120px/
# https://www.tarotcardmeanings.net/images/tarotcards/
# https://www.tarotcardmeanings.net/images/mini/
# https://www.tarotcardmeanings.net/images/mini60px/

folderName = "tarotcards120px"
rootURL = 'https://www.tarotcardmeanings.net/images/{}/'.format(folderName)
fileLocation = r".\{}\\".format(folderName)
print(fileLocation)
Path(fileLocation).mkdir(parents=True, exist_ok=True)

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
			
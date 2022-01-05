from urllib.parse import parse_qs, urlencode,  urlsplit, unquote
import openpyxl
import os

locationDict = {
    "4hf7g85j": "1337Hack3r",
    "48t584hgj": "Hax0R1337",
    "5bjujk4j": "Ub3Hax0R",
}

os.chdir('')#folder location

fb = 'Facebook.xlsx' #file name

wb = openpyxl.load_workbook(fb)

sheet = wb['Sheet1'] #Excel sheet name

for i in range(2,5): #range is the cell number for Link column

    number = i
    numString = str(number)
    #cellNum = 'AI' + numString #AI is usually where Links is, check before each run
    cellNum = 'G' + numString
    url = sheet[cellNum].value
    
    test_str = url
      
    # initializing substrings
    sub1 = "id"
    sub2 = "&"
      
    # getting index of substrings
    idx1 = ''
    idx2 = ''
    idx1 = test_str.index(sub1)
    idx2 = test_str.index(sub2)
      
    # length of substring 1 is added to
    # get string from next character
    res = test_str[idx1 + len(sub1) + 1: idx2]

    orgID = res
    arNum = locationDict[orgID]

    param, newvalue = 'id', arNum

    parsed = urlsplit(url)

    query_dict = parse_qs(parsed.query)

    query_dict[param][0] = newvalue

    query_new = urlencode(query_dict, doseq=True)

    parsed=parsed._replace(query=query_new)

    url_new = (parsed.geturl())

    #print(url_new)
    url_new.replace('%3A',':')
    #
    testCell = 'G' + numString
    sheet[testCell] = url_new
    
wb.save(fb)

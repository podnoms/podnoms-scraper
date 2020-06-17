[![Build Status](https://dev.azure.com/podnoms/podnoms-web/_apis/build/status/podnoms.podnoms-scraper?branchName=master)](https://dev.azure.com/podnoms/podnoms-web/_build/latest?definitionId=15&branchName=master)

# PodNoms Page Parser

Provides a lightweight page parser for finding audio links on pages to avoid hammering the API server's more heavyweight parser.

-   Check it out

```
curl https://scrpy.podnoms.com/check-url?url\=https://www.theguardian.com/politics/audio/2020/jun/03/pm-accused-of-winging-the-covid-19-response-politics-weekly-podcast | jq
```

```json
{
  "title": "PM accused of 'winging' the Covid-19 response: Politics Weekly podcast | Politics | The Guardian",
  "type": "remote",
  "links": [
    {
      "key": "03-54246-gdn.pw.200603.ds.Johnson_winging_it.mp3",
      "title": "PM accused of 'winging' the Covid-19 response: Politics Weekly podcast | Politics | The Guardian",
      "url": "https://audio.guim.co.uk/2020/06/03-54246-gdn.pw.200603.ds.Johnson_winging_it.mp3"
    }
  ]
}
'''
```

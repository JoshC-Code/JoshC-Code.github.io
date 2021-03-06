const range = JSON.stringify({  // Date range used for the Facebook data pull
    since: "2021-06-18",
    until: "2021-06-18"
  })

const Fb_Token = "" // Enter Facebook Token here
const MARKET_API_BASE_URL = "https://graph.facebook.com/v10.0"
      
      accountList = ['',''] // Enter Facebook ad accounts here, can use multiple in an array
      facebookData = []
      dataContainer= {}
      thingExists = null
    
      async function getFacebookData(accountList) {      // Function pulls data from Facebook
        for (let i = 0; i < accountList.length; i++) {
            const accountID = accountList[i];
            const metricFields = 'campaign_name,spend,actions,account_name' // Wanted fields from Facebook platform
            const adMetricsUrl = `${MARKET_API_BASE_URL}/act_${accountID}/insights?access_token=${Fb_Token}&fields=${metricFields}&time_range=${range}&level=campaign&limit=500`
            const result = await fetch(adMetricsUrl)
            facebookFetch = await result.json()
            facebookData.push(facebookFetch)
        }
          for (let i = 0; i < facebookData.length; i++) {
            for (let j = 0; j < facebookData[i].data.length; j++) {

              const data = facebookData[i].data[j]
              
              if(data.actions){
              var leads = {
                action_type: 'lead',
                value: '0'
              }
              leads = data.actions.find(action => action.action_type == 'lead')
              console.log(leads)
              if (leads){
                if(thingExists != null)
                {
                  console.log('if push')
                  thingExists.push({
                    account: data.account_name,                                  
                    campaign : data.campaign_name,
                    spend :  data.spend,
                    leads : leads.value,
                    cpl : data.spend/leads.value})
                }else thingExists = [{  
                  account: data.account_name,                
                  campaign : data.campaign_name,
                  spend :  data.spend,
                  leads : leads.value,
                  cpl : data.spend/leads.value}]           
              }
              else{
                console.log('else push')
                if(thingExists != null)
                {
                  thingExists.push({  
                    account: data.account_name,                                
                    campaign : data.campaign_name,
                    spend :  data.spend,
                    leads : '0',
                    cpl : '0'})
                }else thingExists = [{    
                  account: data.account_name,                              
                  campaign : data.campaign_name,
                  spend :  data.spend,
                  leads : '0',
                  cpl : '0'}]
                }
              }
              else{
                console.log('else push')
                if(thingExists != null)
                {
                  thingExists.push({  
                    account: data.account_name,                                
                    campaign : data.campaign_name,
                    spend :  data.spend,
                    leads : '0',
                    cpl : '0'})
                }else thingExists = [{    
                  account: data.account_name,                              
                  campaign : data.campaign_name,
                  spend :  data.spend,
                  leads : '0',
                  cpl : '0'}]
                }
            }
            }
          }

async function messageChannel() {   //function that sends Facebook data to Slack
  console.log('message start')
  fbData = '#################################' + '\n' + '#################################' + '\n'  // Marks to differentiate between API pulls, following strings beautify the Slack messsage
  console.log(thingExists[0])
  for (let i = 0; i < thingExists.length; i++) {
    for (const key in thingExists[i]) {
      fbData += key + ': ' + JSON.stringify(thingExists[i][key]) + '\n'
   }
   fbData += "------------------------------------------------" + '\n'
  }
  fbData += '#################################' + '\n' + '#################################' + '\n'

  const init = {
      method: 'POST',
      body: JSON.stringify ({
          "text": fbData    // fbData contains Facebook data pulled from Facebook API
      }) 
  }
  const response = await fetch('', init) // Enter Slack API token inside the ''
console.log(response)
console.log('message end')
}

async function start() {
  await getFacebookData(accountList)
  await messageChannel()
}

start()
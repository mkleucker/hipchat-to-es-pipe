var dotenv = require('dotenv').config();
var srequest = require('sync-request');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: process.env.ES_INSTANCE
});


getAllMessages(process.env.HIPCHAT_ROOM, process.env.HIPCHAT_TOKEN, function(messages)
{
	var bulkRequest = [];

	messages.forEach(function(el, index, arr){
		bulkRequest = pushToEs(bulkRequest, el);
	})

	var busy = false;
	var callback = function(err, resp) {
		if (err) { console.log(err); }
		busy = false;
	};

	var perhaps_insert = function(){
	if (!busy) {
	  busy = true;
	  client.bulk({
	    body: bulkRequest.slice(0, 1000)
	  }, callback);
	  bulkRequest = bulkRequest.slice(1000);
	  console.log(bulkRequest.length);
	}

	if (bulkRequest.length > 0) {
	  setTimeout(perhaps_insert, 10);
	} else {
	  console.log('Inserted all records.');
	}
	};

	perhaps_insert();
});



function getAllMessages(room, auth_token, callback)
{
	var base_url = "https://api.hipchat.com/v2/room/"+ room +"/history?auth_token="+ auth_token;

	var allItems = [];
	var moreMessages = true;
	while (moreMessages)
	{
		var url = base_url + "&max-results=1000&date="+Math.floor(Date.now() / 1000)+"&start-index="+allItems.length;
		var res = srequest('GET', url);

		var newItems = JSON.parse(res.getBody()).items;
		allItems = allItems.concat(newItems);

		if(newItems.length < 1)
		{
			moreMessages = false;
		}
	}
	console.log("Fetched "+allItems.length+" messages");
	callback(allItems);
}


function pushToEs(bulkRequest, message){
	bulkRequest.push({
		index: {_index: process.env.ES_INDEX, _type: 'message', _id: message.id}
	});

	bulkRequest.push(message);
	return bulkRequest;
}
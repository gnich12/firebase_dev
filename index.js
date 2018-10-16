var fs = require('fs');
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyDD9SbivxXw1mTr5h26vP0U7S-pSEmyYsY",
    authDomain: "midtermapp-9b881.firebaseapp.com",
    databaseURL: "https://midtermapp-9b881.firebaseio.com",
    projectId: "midtermapp-9b881",
    storageBucket: "midtermapp-9b881.appspot.com",
    messagingSenderId: "528608092517"
  };

firebase.initializeApp(config);
function loadData (fname) {
	var content = []
	var temp = ''
	content = fs.readFileSync(fname).toString().split('\r\n');
	temp = content.slice(1,content.length)
	var ref = firebase.database().ref()
	var q = ref.child('questions');

	temp.forEach((t,i)=>{
		var it = t.split("\t")
		q.push({
			q_num: i+1,
			question: it[0],
			type: it[1],
			options: it[2],
			answer: it[3],
			points: it[4]
		})
	})
}


// var u;
// function show(data){
// 	console.log(data[Object.keys(data)[0]].question)
// }
// function loadMessages() {
//   // Loads the last 12 messages and listen for new ones.
//   var callback = function(snap) {
//     var data = snap.val();
//     show(data)
//   };

//   firebase.database().ref('/quetions/').on('value', callback);
// }
//loadData('qdat2.txt')
//loadMessages()
function printReport () {
	firebase.database().ref('/answers/').once('value')
	.then((data) => {
		firebase.database().ref('/questions/').once('value')
		.then((res) => {
			const a = data.val()
			const q = res.val()
			let stream = fs.createWriteStream('output.txt');
			let counter = 0
			let wfile = ''
			for(var j in a){
				wfile = `################################## \n `+
				`---------C202 Midterm----------\n`+
				`Student Name: ${a[j].name}\n`+
				`Date: ${a[j].date}\n`+
				`################################## \n`
				a[j].q_answers.forEach(dat=>{
					for(var i in q)
					{
						if(q[i].q_num == dat.num){
							let str = q[i].answer
						    let str2 = dat.a
							if (str.toLowerCase() == str2.toLowerCase()) {
								wfile+=`${q[i].q_num}) ${q[i].question}\n`+
								`Student Answer: ${str2.toLowerCase()}\n`+
								`Correct answer: ${str.toLowerCase()}\n`+
								`Point = 3.33 \n\n`
								counter += 3.33
							} else {
								wfile+=`${q[i].q_num}) ${q[i].question}\n`+
								`Student Answer: ${str2.toLowerCase()} (X)\n`+
								`Correct answer: ${str.toLowerCase()}\n`+
								`Point = 0 \n\n`
							}
						}
					}
					
				})
				 wfile += `-----------------------\n-----------------------\n`+
				 `TOTAL SCORE: ${counter} out of 100\n `+
				 `-------------------------\n-----------------------\n\n`
				counter = 0
				stream.write(wfile, 'UTF8')

			}
			stream.end();
			stream.on('finish', function() {
			    console.log("Write completed.");
			});
			stream.on('error', function(err){
			   console.log(err.stack);
			});

		})	
	})
}
printReport();


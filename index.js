const express = require('express')
const app = express()
const dotenv = require('dotenv');

const port = 3000
dotenv.config();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const reqestoption = {
    method: 'GET',
    redirect: 'follow',
    headers: {
        "Authorization" : process.env.API_KEY
    }
}
const url = "https://fortniteapi.io/v1/lookup?username="

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/epicid.html')
})

app.post('/epicid', (req, res) => {
    const data = req.body.epicid;
    console.log(url + data)
    fetch(url + data, reqestoption)
    .then(response => response.json())
    .then(data => {
        if(data.result) {
        res.send(`<link rel="stylesheet" href="/style.css"><div class="container"><div class="item"><h1>EpicIDが見つかりました</h1><input type="text" value="${data.account_id}"></div></div>`);
        }
        else {
            fetch(url + data + "&platform=psn", reqestoption)
            .then(response => response.json())
            .then(data => {
                if(data.result){
                    res.send(`<link rel="stylesheet" href="/style.css"><div class="container"><div class="item"><h1>PSNアカウント検索でEpicIDが見つかりました</h1><input type="text" value="${data.account_id}"></div></div>`);
                }
                else{
                    fetch(url + data + "&platform=xbl", reqestoption)
                    .then(response => response.json())
                    .then(data => {
                        if(data.result){
                            res.send(`<link rel="stylesheet" href="/style.css"><div class="container"><div class="item"><h1>Xboxアカウント検索でEpicIDが見つかりました</h1><input type="text" value="${data.account_id}"></div></div>`);
                        }
                        else{
                            res.send("IDが見つかりませんでした")
                        }
                    })
                }
            })
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).send({ error: 'Server error' });
    });
});

app.listen(port, () => {console.log(">Express startup!")})
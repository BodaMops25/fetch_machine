// STATIC SERVER

const http = require('http'),
      PORT = process.env.PORT || 80,
      fs = require('fs').promises,
      fetch = require('node-fetch')

const server = http.createServer(async (req, res) => {
      
  res.setHeader('Access-Control-Allow-Origin', '*')

  if(req.method === 'GET') {

    if(req.url === '/') req.url = '/info.html'

    fs.readFile(__dirname + req.url)
    .then(content => {

      let contentType = ''

      switch(req.url.match(/\..+$/)[0]) {
        case '.js':
          contentType = 'text/javascript'
          break
        case '.css':
          contentType = 'text/css'
          break
        case '.html':
          contentType = 'text/html' 
          break
      }

      res.writeHead(200, {'Content-Type': contentType})
      res.write(content)
      res.end()
    })
    .catch(err => {
      res.writeHead(404, {'Content-Type': 'text/html'})
      res.write('<meta charset="utf-8">')
      res.write('<h1><strong>404</strong> error, page not found<h1>')
      res.write(`<pre>${err}}</pre>`)
      res.end()
    })
  }
  else if(req.method === 'POST' && req.url === '/fetch_machine/getFetch') {

    let response = null

    try {
      const postData = JSON.parse(await getPostData(req)),
            preResponse = await fetch(postData.url, postData)
            
      response = await preResponse.text()
    }
    catch(err) {
      response = err.toString()
    }

    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.write(response)
    res.end()
  }
  else {
    res.writeHead(405, {'Content-Type': 'text/plain'})
    res.write('Invalid request')
    res.end()
  }
}).listen(PORT)

function getPostData(req) {
  let body = ''

  req.on('data', data => {
    body += data

    if(body.length > 1e6) {
      console.log('request post data too much!')
      req.connection.destroy()
    }
  })
  return new Promise(res => req.on('end', () => res(body)))
}

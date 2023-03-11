async function FM_makeFetch(url, {method = 'GET', headers, body} = {}) {
  return fetch('http://ec2-13-48-131-187.eu-north-1.compute.amazonaws.com/fetch_machine/getFetch', {
    method: 'POST',
    body: JSON.stringify({
      url: url,
      method: method,
      headers: headers,
      body: body
    })
  })
}

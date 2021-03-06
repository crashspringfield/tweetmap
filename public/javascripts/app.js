const heatOptions = {
  minOpacity: .01,
  maxZoom: 8,
  max: 1.0,
  radius: 50,
  blur: 50,
  // gradient: ?
}
const intensity = 5
const searchBox = document.getElementById('search')

let map = new L.Map("map", {center: [37.8, -96.9], zoom: 2})
  .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"))

searchBox.addEventListener('submit', (e) => {
  e.preventDefault()
  map.eachLayer((layer) => { map.removeLayer(layer) })
  map.addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"))

  const searchTerm = document.getElementById('searchTerm').value
  const numberOfTweets = document.getElementById('numberOfTweets').value
  const url = `/twitter/${searchTerm}/${numberOfTweets}`

  d3.json(url, (res) => {
    const tweets = res.tweetLocations

    if (document.getElementById('showMarkers').checked) {
      tweets.forEach((tweet) => {
        L.marker(tweet[1]).addTo(map)
         .bindPopup(`
           <div class="info-window">
             <div class="tweet">${tweet[0].text}</div>
             <div class="twitter-user">
               <a href="https://twitter.com/${tweet[0].user.screen_name}" target="_blank">
                 ${tweet[0].user.screen_name}
               </a>
               <img class="twitter-user-img" src="${tweet[0].user.profile_image_url_https}" />
             </div>
           </div>
           `)
      })
    }

    /* convert object to array: [lat, lng, intensity] */
    const tweetsWithIntensity = tweets.map((tweet) => {
      return [].concat(tweet[1].lat, tweet[1].lng, intensity)
    })
    if (document.getElementById('showHeatmap').checked) {
      const heat = L.heatLayer(tweetsWithIntensity, heatOptions).addTo(map)
    }
  })

})

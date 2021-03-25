// on initialise les variable pour la carte et les clusters
let mymap
var markerClusters


window.onload = () => {
//on charge la carte et on la fait ce centrer sur paris par défault grace à openstreetmap
    mymap = L.map("map").setView([48.852969, 2.349903], 5)
    markerClusters = L.markerClusterGroup()
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(mymap);
//event pour la barre de recherche et la géolocalisation
    document.querySelector("#ville").addEventListener("blur", getCity)
    document.querySelector('#find-me').addEventListener('click', geoFindMe)
// on initialise la requete ajax
    var xobj = new XMLHttpRequest()
    var datas
    xobj.overrideMimeType("application")
    xobj.open('GET', 'geo.json', true)
    xobj.onreadystatechange = function () {

        if (xobj.readyState == 4 && xobj.status == "200") {

            datas = JSON.parse(xobj.response)
            for (data in datas) {
                let alldata = datas[data]
                let id_dojo = alldata["id_dojo"]
                let lon = alldata["lon"]
                let lat = alldata["lat"]
                let pos = [lat, lon]
                let titre = alldata["titre"]
                let adresse = alldata["adresse"] + ", " + alldata["cp"] + " " + alldata["ville"]
            // affichage de tous les dojos dans une liste
                let el = document.querySelector("#dojo")
                let buttonDojo = document.createElement('button')
                buttonDojo.id = 'dojo-'+ id_dojo.toString()
                buttonDojo.className ='btn btn-dark'
                buttonDojo.setAttribute('type', 'button')
                buttonDojo.innerHTML = titre
            // event qui va zommer sur le dojo sur lequel on clique
                buttonDojo.onclick = function(){
                    mymap.setView(pos, 15)
                }
                el.appendChild(buttonDojo)
                el.appendChild(document.createElement("br"))
                el.appendChild(document.createElement("br"))

            // modification de l'icone et de l'emplacement du popup    
                var myIcon = L.icon({
                    iconUrl: "images/autre.png",
                    iconSize: [50, 50],
                    iconAnchor: [25, 50],
                    popupAnchor: [-3, -76],
                })
            // ajout des markers , cluster et on choisi ce que l'on met dans les popup
                var marker = L.marker([lat,lon], { icon: myIcon })
                    marker.bindPopup(titre + " " + "<br>" + adresse + "<br>" + `<a href="#">Site Web</a>`)
                    markerClusters.addLayer(marker)
            }
            mymap.addLayer(markerClusters)
        }
    }
    xobj.send(null)
}

// fonction qui récupère et zoom sur la ville choist en passant par l'api nominatim
function getCity(){

    let adresse = document.querySelector("#ville").value

    const xmlhttp = new XMLHttpRequest

    xmlhttp.onreadystatechange = () => {

        if(xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                let response = JSON.parse(xmlhttp.response)
                
                let lat = response[0]["lat"]
                let lon = response[0]["lon"]

                let pos = [lat, lon]

                mymap.setView(pos, 12)
            }
        }
    }

    xmlhttp.open("get", `https://nominatim.openstreetmap.org/search?q=${adresse}&format=json&addressdetails=1&limit=1&polygon_svg=1`)

    xmlhttp.send()
}

// syteme de géolocalisation et gestion des erreurs
function geoFindMe() {

    function success(position) {
        const latitude  = position.coords.latitude
        const longitude = position.coords.longitude
        const pos = [latitude, longitude]

        mymap.setView(pos, 15)

    }

    function error() {
        status.textContent = 'Unable to retrieve your location'
    }

    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser'
    } else {
        status.textContent = 'Locating…'
        navigator.geolocation.getCurrentPosition(success, error)
    }
}








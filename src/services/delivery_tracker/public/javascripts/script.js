const map = L.map("map").setView([0, 0], 15);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors",
}).addTo(map);

let marker = null;
let routeControl = null;
let destinationMarker = null;
let destinationCoords = null;
let hasCentered = false; // Pour éviter de rezoomer à chaque mise à jour

// Détection mobile
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// Récupère l'adresse depuis l'URL (ex: ?address=Paris)
const urlParams = new URLSearchParams(window.location.search);
const address = urlParams.get("address");

// Si adresse fournie => géocodage
if (address) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(res => res.json())
        .then(results => {
            if (results.length === 0) {
                alert("Adresse non trouvée.");
                return;
            }

            const { lat, lon } = results[0];
            const latNum = parseFloat(lat);
            const lonNum = parseFloat(lon);
            destinationCoords = { lat: latNum, lng: lonNum };

            destinationMarker = L.marker([latNum, lonNum], {
                icon: L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [0, -41]
                })
            }).addTo(map).bindPopup("Destination").openPopup();
        })
        .catch(err => console.error("Erreur lors du géocodage :", err));
}

// Affiche l'itinéraire entre deux points
function updateRoute(start, end) {
    if (routeControl) {
        map.removeControl(routeControl);
    }
    routeControl = L.Routing.control({
        waypoints: [
            L.latLng(start.lat, start.lng),
            L.latLng(end.lat, end.lng)
        ],
        createMarker: () => null,
        lineOptions: {
            styles: [{ color: '#3388ff', weight: 5 }]
        },
        addWaypoints: false,
        draggableWaypoints: false,
        routeWhileDragging: false,
    }).addTo(map);

    routeControl.getContainer().style.display = 'none'; // Cache les infos de trajet
}

// 📱 Cas mobile : géolocalisation en direct
if (isMobile && "geolocation" in navigator) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // Envoie au serveur
            fetch("/api/location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latitude, longitude }),
            }).catch((err) => console.error("Erreur envoi position:", err));

            // Met à jour le marqueur
            if (marker) {
                marker.setLatLng([latitude, longitude]);
            } else {
                marker = L.marker([latitude, longitude]).addTo(map);
            }

            // 👇 Ne centre qu'une seule fois (évite rezoom en boucle)
            if (!hasCentered) {
                map.setView([latitude, longitude], 15);
                hasCentered = true;
            }

            if (destinationCoords) {
                updateRoute({ lat: latitude, lng: longitude }, destinationCoords);
            }
        },
        (error) => {
            console.error("Erreur géolocalisation:", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
        }
    );
}

// Cas ordinateur : lecture de la position depuis l’API (ex: dashboard)
else {
    function updateLocation() {
        fetch("/api/location")
            .then((res) => res.json())
            .then((data) => {
                if (!data || !data.latitude || !data.longitude) return;
                const { latitude, longitude } = data;

                if (marker) {
                    marker.setLatLng([latitude, longitude]);
                } else {
                    marker = L.marker([latitude, longitude]).addTo(map);
                }

                if (!hasCentered) {
                    map.setView([latitude, longitude], 15);
                    hasCentered = true;
                }

                if (destinationCoords) {
                    updateRoute({ lat: latitude, lng: longitude }, destinationCoords);
                }
            })
            .catch((err) => console.error("Erreur récupération position:", err));
    }

    updateLocation();
    setInterval(updateLocation, 5000);
}

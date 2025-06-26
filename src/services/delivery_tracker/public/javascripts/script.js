const map = L.map("map").setView([0, 0], 15);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors",
}).addTo(map);

let marker = null;
let routeControl = null;
let destinationMarker = null;

// Détecte si on est sur mobile
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// Destination stockée localement
let destinationCoords = null;

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

    routeControl.getContainer().style.display = 'none'; // Cache le conteneur de la route

    //setTimeout(() => map.invalidateSize(), 100); // Force la mise à jour de la carte
}

function setDestination(lat, lng) {
    destinationCoords = { lat, lng };

    if (destinationMarker) {
        destinationMarker.setLatLng([lat, lng]);
    } else {
        destinationMarker = L.marker([lat, lng], { icon: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [0, -41]
            }) }).addTo(map).bindPopup("Destination").openPopup();
    }
}

if (isMobile && "geolocation" in navigator) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // Envoie la position au serveur
            fetch("/api/location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latitude, longitude }),
            }).catch((err) => {
                console.error("Erreur envoi position:", err);
            });

            // Met à jour le marqueur local
            if (marker) {
                marker.setLatLng([latitude, longitude]);
            } else {
                marker = L.marker([latitude, longitude]).addTo(map);
            }

            map.setView([latitude, longitude], 15);

            // Affiche la route si destination connue
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

    // Le mobile interroge le serveur toutes les 5 sec pour récupérer la destination
    function fetchDestination() {
        fetch("/api/destination")
            .then(res => res.json())
            .then(dest => {
                if (dest.latitude && dest.longitude) {
                    setDestination(dest.latitude, dest.longitude);
                    if (marker) {
                        const pos = marker.getLatLng();
                        updateRoute({ lat: pos.lat, lng: pos.lng }, dest);
                    }
                }
            })
            .catch(err => console.error("Erreur récupération destination:", err));
    }

    setInterval(fetchDestination, 5000);
} else {
    // Partie ordinateur : récupération de la position + saisie destination

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

                map.setView([latitude, longitude], 15);

                if (destinationCoords) {
                    updateRoute({ lat: latitude, lng: longitude }, destinationCoords);
                }
            })
            .catch((err) => {
                console.error("Erreur récupération position:", err);
            });
    }

    setInterval(updateLocation, 5000);
    updateLocation();

    // Formulaire pour saisir la destination
    const form = document.getElementById("destination-form");
    const input = document.getElementById("destination-input");

    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const address = input.value;
        if (!address) return;

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
            .then(res => res.json())
            .then(results => {
                if (results.length === 0) {
                    alert("Adresse non trouvée.");
                    return;
                }
                const { lat, lon } = results[0];
                setDestination(parseFloat(lat), parseFloat(lon));

                // Envoie la destination au serveur
                fetch("/api/destination", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ latitude: parseFloat(lat), longitude: parseFloat(lon) }),
                }).catch(err => console.error("Erreur envoi destination:", err));
            })
            .catch(err => {
                console.error("Erreur géocodage:", err);
            });
    });
}

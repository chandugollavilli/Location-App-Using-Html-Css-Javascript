const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const mapContainer = document.getElementById('map');
const notificationPopup = document.getElementById('notification-popup');

searchButton.addEventListener('click', () => {
  const location = searchInput.value;
  if (location) {
    searchLocation(location);
  }
});

function searchLocation(location) {
  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }
      return response.json();
    })
    .then(data => {
      if (data.length > 0) {
        const mapData = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
        displayMap(mapData);
        showNotificationPopup('success', 'Location found successfully');
      } else {
        showNotificationPopup('error', 'No location found');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showNotificationPopup('error', 'Failed to fetch location');
    });
}

function displayMap(mapData) {
  mapContainer.innerHTML = ''; // Clear previous map

  const map = document.createElement('iframe');
  map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${mapData.longitude - 0.01},${mapData.latitude - 0.01},${mapData.longitude + 0.01},${mapData.latitude + 0.01}&layer=mapnik`;
  map.width = '100%';
  map.height = '400';

  mapContainer.appendChild(map);
}

function showNotificationPopup(type, message) {
  notificationPopup.innerHTML = message;
  notificationPopup.className = `notification-popup ${type}`;
  notificationPopup.style.display = 'block';

  setTimeout(() => {
    notificationPopup.style.display = 'none';
  }, 3000);
}

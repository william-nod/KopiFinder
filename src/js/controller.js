import { API_KEY } from "./config";
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const platform = new H.service.Platform({
  'apikey': `${API_KEY}`
});

const defaultLayers = platform.createDefaultLayers();

navigator.geolocation.getCurrentPosition((pos) => {
  const coords = pos.coords;
  const { latitude: lat, longitude: lng } = coords;

  const map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
      zoom: 16,
      center: { lat: lat, lng: lng }
    });

  let bubble = new H.ui.InfoBubble({ lng: lng, lat: lat }, {
    content: '<b>This is you</b>'
  });

  const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  window.addEventListener('resize', () => map.getViewPort().resize());

  let ui = H.ui.UI.createDefault(map, defaultLayers);
  ui.addBubble(bubble);


  dragMaps(map, behavior);
  getCafe(map, lat, lng);

}, (err) => {
  alert(`Click allow to show map, Error : ${err.message}`);
});


const dragMaps = function (map) {
  map.addEventListener('dragstart', function (ev) {
    var target = ev.target,
      pointer = ev.currentPointer;
    if (target instanceof H.map.Marker) {
      var targetPosition = map.geoToScreen(target.getGeometry());
      target['offset'] = new H.math.Point(pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y);
      behavior.disable();
    }
  }, false);

  map.addEventListener('dragend', function (ev) {
    var target = ev.target;
    if (target instanceof H.map.Marker) {
      behavior.enable();
    }
  }, false);

  map.addEventListener('drag', function (ev) {
    var target = ev.target,
      pointer = ev.currentPointer;
    if (target instanceof H.map.Marker) {
      target.setGeometry(map.screenToGeo(pointer.viewportX - target['offset'].x, pointer.viewportY - target['offset'].y));
    }
  }, false);
};

const getCafe = async function (map, lat, lng) {
  const data = await fetch(`https://discover.search.hereapi.com/v1/discover?at=${lat},${lng}&q=cafe&apiKey=${API_KEY}`).then((res) => res.json()).then(res => res.items);
  console.log(data);
  data.forEach(item => {
    const html = `
      <div class="result">
        <p>${item.title}</p>
        <p>${item.address.street}, ${item.address.district}, ${item.address.city}, ${item.address.countryName}</p>
      </div>
    `;
    const resultContainer = document.getElementById('result-container');
    resultContainer.insertAdjacentHTML('afterbegin', html);
    map.addObject(new H.map.Marker(item.position));
  });
};

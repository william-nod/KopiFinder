import { API_KEY } from "./config";
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bookmark from '../img/bookmark-white.png';
import bookmarked from '../img/bookmark.png'

const platform = new H.service.Platform({
  'apikey': `${process.env.API_KEY}`
});

const defaultLayers = platform.createDefaultLayers();

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
  const data = await fetch(`https://discover.search.hereapi.com/v1/discover?at=${lat},${lng}&q=cafe&apiKey=${process.env.API_KEY}`).then((res) => res.json()).then(res => res.items);

  data.forEach((item, idx) => {
    const html = `
      <div class="result" id=result-${idx + 1}>
        <div>
          <p class="result__title">${item.title}</p>
          <p class="result__desc">${item.address.street}, ${item.address.district}, ${item.address.city}, ${item.address.countryName}</p>
        </div>
        <img class="result__bookmark-icon" src=${bookmark}>
      </div>
    `;
    const resultContainer = document.getElementById('result-container');
    resultContainer.insertAdjacentHTML('afterbegin', html);
    map.addObject(new H.map.Marker(item.position));
  });
};

navigator.geolocation.getCurrentPosition((pos) => {
  const coords = pos.coords;
  const { latitude: lat, longitude: lng } = coords;

  const map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
      zoom: 17,
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


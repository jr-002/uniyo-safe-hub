import { Map, NavigationControl } from 'maplibre-gl';

export const initMap = (container: HTMLElement, center: [number, number] = [-0.118092, 51.509865]) => {
  return new Map({
    container,
    style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_key',
    center,
    zoom: 15
  }).addControl(new NavigationControl());
};

export const addMarker = (map: Map, coordinates: [number, number]) => {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.backgroundColor = '#FF0000';
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.border = '2px solid white';

  new maplibregl.Marker(el)
    .setLngLat(coordinates)
    .addTo(map);
};
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pentru iconițele Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function RealMap() {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);

    // Orașe din Moldova cu coordonate
    const cities = [
        { name: 'Chișinău', lat: 47.0105, lng: 28.8638, population: '732,000' },
        { name: 'Bălți', lat: 47.7531, lng: 27.9184, population: '127,000' },
        { name: 'Tiraspol', lat: 46.8483, lng: 29.6067, population: '133,000' },
        { name: 'Cahul', lat: 45.9048, lng: 28.1994, population: '39,000' },
        { name: 'Ungheni', lat: 47.2105, lng: 27.8005, population: '35,000' },
        { name: 'Comrat', lat: 46.3000, lng: 28.6500, population: '25,000' },
        { name: 'Soroca', lat: 48.1574, lng: 28.2977, population: '28,000' },
        { name: 'Orhei', lat: 47.3843, lng: 28.8245, population: '25,000' },
    ];

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Inițializează harta
        mapRef.current = L.map(mapContainerRef.current).setView([47.0, 28.5], 8);

        // Adaugă stratul de hartă (OpenStreetMap)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
            minZoom: 6
        }).addTo(mapRef.current);

        // Adaugă markere pentru fiecare oraș
        cities.forEach(city => {
            const marker = L.marker([city.lat, city.lng]).addTo(mapRef.current);

            // Popup cu informații
            marker.bindPopup(`
        <div style="font-family: Arial, sans-serif; padding: 5px;">
          <strong style="font-size: 16px; color: #10b981;">📍 ${city.name}</strong><br/>
          <span style="color: #666;">Populație: ${city.population}</span><br/>
          <span style="color: #666;">📍 ${city.lat.toFixed(4)}°, ${city.lng.toFixed(4)}°</span>
        </div>
      `);

            // Adaugă hover effect
            marker.on('mouseover', function() {
                this.openPopup();
            });
            marker.on('mouseout', function() {
                this.closePopup();
            });
        });

        // Adaugă un cerc pentru zona de acoperire (raza 30km în jurul Chișinăului)
        const coverageCircle = L.circle([47.0105, 28.8638], {
            color: '#10b981',
            fillColor: '#34d399',
            fillOpacity: 0.2,
            radius: 40000
        }).addTo(mapRef.current);

        coverageCircle.bindPopup('📦 Zona de acoperire principală');

        // Adaugă legendă
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'legend');
            div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-size: 12px;">
          <strong style="color: #10b981;">📍 Acoperire națională</strong><br/>
          <span style="color: #666;">📦 Sediu central: Chișinău</span><br/>
          <span style="color: #666;">🏠 Operăm în toată Moldova</span>
        </div>
      `;
            return div;
        };
        legend.addTo(mapRef.current);

        // Cleanup
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
            <div
                ref={mapContainerRef}
                style={{
                    height: '450px',
                    width: '100%',
                    background: '#f0f4f8'
                }}
            />
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                background: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                color: '#666'
            }}>
                📍 {cities.length} orașe acoperite
            </div>
        </div>
    );
}

export default RealMap;
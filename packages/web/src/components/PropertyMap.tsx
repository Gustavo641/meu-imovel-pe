import { useEffect, useState } from 'react';
import { useGoogleMaps, type MapLocation, type NearbyPlace } from '../services/google-maps';
import type { Property } from '@meu-imovel-pe/shared';

interface PropertyMapProps {
  property: Property;
  showNearbyPlaces?: boolean;
}

export function PropertyMap({ property, showNearbyPlaces = true }: PropertyMapProps) {
  const mapsService = useGoogleMaps();
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<{
    schools: NearbyPlace[];
    hospitals: NearbyPlace[];
    shopping: NearbyPlace[];
    parks: NearbyPlace[];
  }>({
    schools: [],
    hospitals: [],
    shopping: [],
    parks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      if (!mapsService || !property.address) return;

      try {
        setLoading(true);
        const coords = await mapsService.geocodeAddress(property.address);
        setLocation(coords);

        if (showNearbyPlaces) {
          const [schools, hospitals, shopping, parks] = await Promise.all([
            mapsService.findNearbyPlaces(coords, 'school', 2000),
            mapsService.findNearbyPlaces(coords, 'hospital', 3000),
            mapsService.findNearbyPlaces(coords, 'shopping_mall', 3000),
            mapsService.findNearbyPlaces(coords, 'park', 2000),
          ]);

          setNearbyPlaces({ schools, hospitals, shopping, parks });
        }
      } catch (err) {
        setError(`Erro ao carregar mapa: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadMap();
  }, [property.address, mapsService, showNearbyPlaces]);

  if (loading) {
    return <div className="w-full h-96 bg-gray-200 flex items-center justify-center">Carregando mapa...</div>;
  }

  if (error) {
    return <div className="w-full h-96 bg-red-100 flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!location) {
    return <div className="w-full h-96 bg-gray-100 flex items-center justify-center">Endereço não encontrado</div>;
  }

  return (
    <div className="space-y-4">
      {/* Mapa */}
      <div className="w-full rounded-lg overflow-hidden shadow">
        <iframe
          width="100%"
          height="400"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapsService?.generateStreetViewUrl(location)}
          allowFullScreen
          loading="lazy"
          title="Property Map"
        />
      </div>

      {/* Localização */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-2">📍 Localização</h3>
        <p className="text-sm text-gray-600 mb-2">{location.address}</p>
        <a
          href={mapsService?.generateMapUrl(location)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          Ver no Google Maps →
        </a>
      </div>

      {/* Pontos de Interesse */}
      {showNearbyPlaces && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Escolas */}
          {nearbyPlaces.schools.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>🏫</span> Escolas Próximas
              </h4>
              <div className="space-y-2">
                {nearbyPlaces.schools.slice(0, 3).map((place) => (
                  <div key={place.name} className="text-sm">
                    <p className="font-medium text-gray-900">{place.name}</p>
                    <p className="text-gray-600">
                      {(place.distance / 1000).toFixed(1)}km de distância
                    </p>
                    {place.rating && (
                      <p className="text-yellow-600">⭐ {place.rating.toFixed(1)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hospitais */}
          {nearbyPlaces.hospitals.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>🏥</span> Hospitais Próximos
              </h4>
              <div className="space-y-2">
                {nearbyPlaces.hospitals.slice(0, 3).map((place) => (
                  <div key={place.name} className="text-sm">
                    <p className="font-medium text-gray-900">{place.name}</p>
                    <p className="text-gray-600">
                      {(place.distance / 1000).toFixed(1)}km de distância
                    </p>
                    {place.rating && (
                      <p className="text-yellow-600">⭐ {place.rating.toFixed(1)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shopping/Comércio */}
          {nearbyPlaces.shopping.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>🛍️</span> Shopping/Comércio
              </h4>
              <div className="space-y-2">
                {nearbyPlaces.shopping.slice(0, 3).map((place) => (
                  <div key={place.name} className="text-sm">
                    <p className="font-medium text-gray-900">{place.name}</p>
                    <p className="text-gray-600">
                      {(place.distance / 1000).toFixed(1)}km de distância
                    </p>
                    {place.rating && (
                      <p className="text-yellow-600">⭐ {place.rating.toFixed(1)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parques */}
          {nearbyPlaces.parks.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>🌳</span> Parques Próximos
              </h4>
              <div className="space-y-2">
                {nearbyPlaces.parks.slice(0, 3).map((place) => (
                  <div key={place.name} className="text-sm">
                    <p className="font-medium text-gray-900">{place.name}</p>
                    <p className="text-gray-600">
                      {(place.distance / 1000).toFixed(1)}km de distância
                    </p>
                    {place.rating && (
                      <p className="text-yellow-600">⭐ {place.rating.toFixed(1)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Google Maps Integration para CRM Imobiliário
 *
 * Funcionalidades:
 * - Localização de imóveis
 * - Cálculo de distâncias e rotas
 * - Pontos de interesse (escolas, shoppings, hospitais, etc)
 * - Visualização de vizinhança
 */

export interface MapLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface NearbyPlace {
  name: string;
  type: string;
  distance: number; // em metros
  rating?: number;
  location: MapLocation;
}

export interface PlaceDetails {
  name: string;
  address: string;
  placeId: string;
  location: MapLocation;
  formattedAddress: string;
  placeUrl: string;
  rating?: number;
  reviewCount?: number;
  photos?: string[];
}

export class GoogleMapsService {
  private apiKey: string;
  private geocoder: google.maps.Geocoder | null = null;
  private placesService: google.maps.places.PlacesService | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.initializeServices();
  }

  private initializeServices() {
    if (typeof google !== 'undefined' && google.maps) {
      this.geocoder = new google.maps.Geocoder();
      // PlacesService requer um mapa visível, será inicializado quando necessário
    }
  }

  /**
   * Converter endereço em coordenadas
   */
  async geocodeAddress(address: string): Promise<MapLocation> {
    if (!this.geocoder) {
      throw new Error('Google Maps não está inicializado');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address,
          });
        } else {
          reject(new Error(`Erro ao geocodificar endereço: ${status}`));
        }
      });
    });
  }

  /**
   * Converter coordenadas em endereço
   */
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    if (!this.geocoder) {
      throw new Error('Google Maps não está inicializado');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject(new Error(`Erro ao fazer geocodificação reversa: ${status}`));
          }
        }
      );
    });
  }

  /**
   * Calcular distância entre dois pontos
   */
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Gerar URL do Google Maps para compartilhar
   */
  generateMapUrl(location: MapLocation): string {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  }

  /**
   * Gerar URL do Street View
   */
  generateStreetViewUrl(location: MapLocation): string {
    return `https://www.google.com/maps/embed/v1/streetview?key=${this.apiKey}&location=${location.lat},${location.lng}&heading=0&pitch=0&fov=90`;
  }

  /**
   * Gerar URL do mapa estático
   */
  generateStaticMapUrl(
    location: MapLocation,
    zoom: number = 15,
    size: string = '400x400'
  ): string {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=${zoom}&size=${size}&markers=color:red%7C${location.lat},${location.lng}&key=${this.apiKey}`;
  }

  /**
   * Encontrar pontos de interesse próximos
   */
  async findNearbyPlaces(
    location: MapLocation,
    type: string, // 'school', 'shopping_mall', 'hospital', 'police', 'park', etc
    radiusMeters: number = 3000 // 3km padrão
  ): Promise<NearbyPlace[]> {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radiusMeters}&type=${type}&key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json() as {
        results: Array<{
          name: string;
          types: string[];
          geometry: { location: { lat: number; lng: number } };
          rating?: number;
        }>;
      };

      return (data.results || []).map((place) => ({
        name: place.name,
        type: place.types[0],
        distance: this.calculateDistance(
          location.lat,
          location.lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        ) * 1000, // converter para metros
        rating: place.rating,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          address: place.name,
        },
      }));
    } catch (error) {
      // Erro silencioso
      return [];
    }
  }

  /**
   * Obter detalhes de um lugar
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json() as {
        result: {
          name: string;
          formatted_address: string;
          place_id: string;
          geometry: { location: { lat: number; lng: number } };
          rating?: number;
          review_count?: number;
          photos?: Array<{ photo_reference: string }>;
          url: string;
        };
      };

      const place = data.result;
      return {
        name: place.name,
        address: place.formatted_address,
        placeId: place.place_id,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          address: place.formatted_address,
        },
        formattedAddress: place.formatted_address,
        placeUrl: place.url,
        rating: place.rating,
        reviewCount: place.review_count,
      };
    } catch (error) {
      // Erro silencioso
      throw error;
    }
  }

  /**
   * Gerar descrição de vizinhança
   */
  async generateNeighborhoodDescription(
    location: MapLocation,
    city: string,
    neighborhood: string
  ): Promise<string> {
    try {
      const schools = await this.findNearbyPlaces(location, 'school', 2000);
      const shopping = await this.findNearbyPlaces(location, 'shopping_mall', 3000);
      const hospitals = await this.findNearbyPlaces(location, 'hospital', 3000);
      const parks = await this.findNearbyPlaces(location, 'park', 2000);

      const description = `
🏘️ **Vizinhança: ${neighborhood}, ${city}**

🏫 Escolas: ${schools.length > 0 ? schools.slice(0, 2).map((s) => s.name).join(', ') : 'Não encontradas'}

🛍️ Shopping/Comércio: ${shopping.length > 0 ? shopping.slice(0, 2).map((s) => s.name).join(', ') : 'Não encontrados'}

🏥 Hospitais: ${hospitals.length > 0 ? hospitals.slice(0, 2).map((s) => s.name).join(', ') : 'Não encontrados'}

🌳 Parques: ${parks.length > 0 ? parks.slice(0, 2).map((s) => s.name).join(', ') : 'Não encontrados'}

📍 [Ver no Mapa](${this.generateMapUrl(location)})
      `;

      return description.trim();
    } catch (error) {
      // Erro silencioso
      return '';
    }
  }
}

// Hook para usar Google Maps na aplicação
export function useGoogleMaps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  if (!apiKey) {
    // API Key não configurada
    return null;
  }

  return new GoogleMapsService(apiKey);
}

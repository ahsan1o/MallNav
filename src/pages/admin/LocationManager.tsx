import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function LocationManager() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleUpdateLocation = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('malls')
        .update({
          coordinates: location
        })
        .eq('id', 'current-mall-id'); // Replace with actual mall ID

      if (error) throw error;
      alert('Location updated successfully!');
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <MapPin className="h-6 w-6 text-indigo-600 mr-2" />
          Location Manager
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">Current Location:</p>
              <p className="font-mono mt-1">
                Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
              </p>
            </div>
            <button
              onClick={handleGetLocation}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Get Current Location
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                value={location.lat}
                onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                step="0.000001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                value={location.lng}
                onChange={(e) => setLocation({ ...location, lng: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                step="0.000001"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateLocation}
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Mall Location'}
          </button>
        </div>
      </div>
    </div>
  );
}
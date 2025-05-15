import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { MapPin, User, Calendar, Clock } from 'lucide-react';
import Map from 'react-map-gl';

const AssignDuty: React.FC = () => {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [dutyPosts, setDutyPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [shifts, setShifts] = useState<string[]>([]);

  // Fetch personnel and duty posts from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/personnel', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setPersonnel(data.personnel || []));

    fetch('http://localhost:5000/api/duty-posts', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setDutyPosts(data.dutyPosts || []));
  }, []);

  const availablePersonnel = personnel.filter(p => !p.isOnLeave);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPost && selectedPersonnel && startDate && endDate && shifts.length > 0) {
      await fetch('http://localhost:5000/api/duty-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          personnelId: selectedPersonnel,
          dutyPostId: selectedPost,
          startDate,
          endDate,
          shifts,
        }),
      });

      // Reset form
      setSelectedPost(null);
      setSelectedPersonnel(null);
      setStartDate('');
      setEndDate('');
      setShifts([]);
    }
  };

  const handleShiftToggle = (shift: string) => {
    if (shifts.includes(shift)) {
      setShifts(shifts.filter(s => s !== shift));
    } else {
      setShifts([...shifts, shift]);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Assign Duty</h1>
          <p className="text-gray-600">Assign personnel to duty posts</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Duty Posts</h2>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duty Location
                  </label>
                  <select
                    value={selectedPost || ''}
                    onChange={e => setSelectedPost(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>Select a duty location</option>
                    {dutyPosts.map(post => (
                      <option key={post.id || post._id} value={post.id || post._id}>
                        {post.name} {post.location ? `- ${post.location}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="h-[400px] rounded-lg overflow-hidden mb-4">
                  <Map
                    initialViewState={{
                      longitude: -122.4,
                      latitude: 37.8,
                      zoom: 14
                    }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    mapboxAccessToken="your_mapbox_token"
                  >
                    {/* Map markers would go here */}
                  </Map>
                </div>
              </div>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Assignment Details</h2>
              </div>
              <div className="p-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Personnel
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {availablePersonnel.map((person) => (
                      <div
                        key={person.id || person._id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedPersonnel === (person.id || person._id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedPersonnel(person.id || person._id)}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={person.profileImage || '/default-profile.png'}
                            alt={person.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{person.name}</p>
                            <p className="text-sm text-gray-500">{person.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shifts
                  </label>
                  <div className="flex space-x-4">
                    {['morning', 'evening', 'night'].map((shift) => (
                      <button
                        key={shift}
                        type="button"
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          shifts.includes(shift)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => handleShiftToggle(shift)}
                      >
                        {shift.charAt(0).toUpperCase() + shift.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!selectedPost || !selectedPersonnel || !startDate || !endDate || shifts.length === 0}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Assign Duty
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssignDuty;
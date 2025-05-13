import React from 'react';
import Layout from '../../components/Layout';
import { useAppContext } from '../../context/AppContext';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';
import Map from 'react-map-gl';

const DutyPosts: React.FC = () => {
  const { dutyPosts, dutyAssignments } = useAppContext();
  const [selectedPost, setSelectedPost] = React.useState(dutyPosts[0]?.id);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Duty Posts</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Post Locations</h2>
            </div>
            
            <div className="p-4">
              <div className="h-[400px] rounded-lg overflow-hidden">
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
          
          <div className="space-y-4">
            {dutyPosts.map((post) => (
              <div
                key={post.id}
                className={`bg-white rounded-lg shadow p-4 border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPost === post.id
                    ? 'border-blue-500'
                    : post.priority === 'high'
                    ? 'border-red-500'
                    : post.priority === 'medium'
                    ? 'border-yellow-500'
                    : 'border-green-500'
                }`}
                onClick={() => setSelectedPost(post.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{post.name}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin size={16} className="mr-1" />
                      <span>{post.location}</span>
                    </div>
                  </div>
                  
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : post.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {post.priority.charAt(0).toUpperCase() + post.priority.slice(1)} Priority
                  </span>
                </div>
                
                <p className="text-gray-600 mt-2">{post.description}</p>
                
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span>
                      {dutyAssignments.find((da) => da.dutyPostId === post.id)?.shifts.join(', ')}
                    </span>
                  </div>
                  
                  {post.priority === 'high' && (
                    <div className="flex items-center text-red-600">
                      <AlertTriangle size={16} className="mr-1" />
                      <span>High attention required</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DutyPosts;
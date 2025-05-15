import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { User, MapPin, Calendar, DollarSign, Search } from 'lucide-react';

const ViewPersonnel: React.FC = () => {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [dutyPosts, setDutyPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch personnel
    fetch('http://localhost:5000/api/personnel', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setPersonnel(data.personnel || []);
        setLoading(false);
      });
    
  }, []);

  const filteredPersonnel = personnel.filter(person => 
    (person.name && person.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (person.email && person.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Personnel Management</h1>
          <p className="text-gray-600">View and manage security personnel</p>
        </div>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search personnel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personnel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duty Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td>
                  </tr>
                ) : filteredPersonnel.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <User size={48} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500">No personnel found</p>
                    </td>
                  </tr>
                ) : (
                  filteredPersonnel.map((person) => {
                    const dutyPost = dutyPosts.find(post => post.id === person.dutyPost);
                    return (
                      <tr key={person._id || person.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                              <img
                                src={person.profileImage || '/default-profile.png'}
                                alt={person.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{person.name}</div>
                              <div className="text-sm text-gray-500">{person.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{person.contact || person.contactNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {dutyPost ? (
                            <div className="flex items-center">
                              <MapPin size={16} className="text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900">{dutyPost.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            person.isOnLeave
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {person.isOnLeave ? 'On Leave' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <DollarSign size={16} className="text-gray-400 mr-1" />
                            {person.salary}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-1" />
                            {person.joiningDate ? new Date(person.joiningDate).toLocaleDateString() : ''}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewPersonnel;
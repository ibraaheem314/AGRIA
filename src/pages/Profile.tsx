import React from 'react';
import { Mail, Phone, MapPin, Edit, User, Lock, Bell } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Profile = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600">Manage your account information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-700 mb-4">
                <User size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">John Farmer</h2>
              <p className="text-gray-600">Farm Manager</p>
              
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={16} className="mr-2" />
                  john.farmer@example.com
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={16} className="mr-2" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  Rural Route 1, Farmville, CA
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="mt-6 w-full"
                icon={<Edit size={16} />}
              >
                Edit Profile
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <User size={18} className="mr-3 text-green-600" />
                  <span>Personal Information</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Lock size={18} className="mr-3 text-green-600" />
                  <span>Security & Password</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Bell size={18} className="mr-3 text-green-600" />
                  <span>Notifications</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Farm Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Name
                </label>
                <input
                  type="text"
                  id="farmName"
                  value="Green Valley Farm"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="farmType" className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Type
                </label>
                <input
                  type="text"
                  id="farmType"
                  value="Mixed Crop"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="totalArea" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Area
                </label>
                <input
                  type="text"
                  id="totalArea"
                  value="30.8 hectares"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value="Rural Route 1, Farmville, CA"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              className="mt-6"
              icon={<Edit size={16} />}
            >
              Edit Farm Details
            </Button>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscription & Plan</h3>
            
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Professional Plan</h4>
                  <p className="text-sm text-gray-600">Your subscription renews on Aug 15, 2025</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">Active</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>All features included with unlimited farms and crops</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-3">Current Plan Features</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Unlimited farms and crop monitoring
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Advanced weather forecasting
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Soil analysis and recommendations
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Priority customer support
                </li>
              </ul>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <Button variant="primary">Upgrade Plan</Button>
              <Button variant="outline">Manage Subscription</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
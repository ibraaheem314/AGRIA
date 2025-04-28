// Mock data for demonstration purposes

export const weatherData = [
  { day: 'Mon', temperature: 28, rainfall: 10 },
  { day: 'Tue', temperature: 30, rainfall: 0 },
  { day: 'Wed', temperature: 29, rainfall: 5 },
  { day: 'Thu', temperature: 26, rainfall: 25 },
  { day: 'Fri', temperature: 27, rainfall: 15 },
  { day: 'Sat', temperature: 31, rainfall: 0 },
  { day: 'Sun', temperature: 32, rainfall: 0 },
];

export const cropData = [
  { 
    id: 1, 
    name: 'Wheat', 
    area: '12.5 hectares', 
    plantedDate: '2024-03-15', 
    expectedHarvest: '2024-07-15',
    status: 'growing',
    health: 'good',
    image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg'
  },
  { 
    id: 2, 
    name: 'Corn', 
    area: '8.3 hectares', 
    plantedDate: '2024-04-01', 
    expectedHarvest: '2024-09-01',
    status: 'growing',
    health: 'excellent',
    image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg'
  },
  { 
    id: 3, 
    name: 'Soybeans', 
    area: '10.0 hectares', 
    plantedDate: '2024-04-15', 
    expectedHarvest: '2024-10-15',
    status: 'growing',
    health: 'attention needed',
    image: 'https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'
  },
];

export const taskData = [
  { 
    id: 1, 
    title: 'Irrigation check', 
    description: 'Verify irrigation system in the east wheat field',
    dueDate: '2024-06-15',
    priority: 'high',
    status: 'pending'
  },
  { 
    id: 2, 
    title: 'Apply fertilizer', 
    description: 'Second round of fertilizer for corn fields',
    dueDate: '2024-06-18',
    priority: 'high',
    status: 'pending'
  },
  { 
    id: 3, 
    title: 'Equipment maintenance', 
    description: 'Regular maintenance for the harvester',
    dueDate: '2024-06-25',
    priority: 'medium',
    status: 'pending'
  },
  { 
    id: 4, 
    title: 'Soil testing', 
    description: 'Collect soil samples from soybean field for testing',
    dueDate: '2024-06-20',
    priority: 'medium',
    status: 'completed'
  }
];

export const marketplaceItems = [
  {
    id: 1,
    name: 'Premium Fertilizer',
    category: 'Fertilizers',
    price: 120,
    unit: 'per 50kg bag',
    seller: 'AgriSupplies Co.',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/5483068/pexels-photo-5483068.jpeg'
  },
  {
    id: 2,
    name: 'Organic Pesticide',
    category: 'Pesticides',
    price: 85,
    unit: 'per 10L container',
    seller: 'OrganicFarm Solutions',
    rating: 4.2,
    image: 'https://images.pexels.com/photos/5187277/pexels-photo-5187277.jpeg'
  },
  {
    id: 3,
    name: 'Wheat Seeds - High Yield Variety',
    category: 'Seeds',
    price: 200,
    unit: 'per 25kg bag',
    seller: 'TopSeeds Ltd.',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/162806/wheat-spike-wheat-spike-cereals-162806.jpeg'
  },
  {
    id: 4,
    name: 'Irrigation System Components',
    category: 'Equipment',
    price: 350,
    unit: 'per set',
    seller: 'FarmTech Systems',
    rating: 4.0,
    image: 'https://images.pexels.com/photos/1006293/pexels-photo-1006293.jpeg'
  }
];

export const resourceArticles = [
  {
    id: 1,
    title: 'Modern Irrigation Techniques for Water Conservation',
    category: 'Irrigation',
    summary: 'Learn about the latest irrigation methods that can help reduce water usage while maintaining crop health.',
    readTime: '8 min read',
    date: '2024-05-10',
    image: 'https://images.pexels.com/photos/442584/pexels-photo-442584.jpeg'
  },
  {
    id: 2,
    title: 'Soil Health Management for Sustainable Farming',
    category: 'Soil Management',
    summary: 'Discover best practices for maintaining soil health, fertility, and structure for long-term agricultural sustainability.',
    readTime: '12 min read',
    date: '2024-04-22',
    image: 'https://images.pexels.com/photos/6543266/pexels-photo-6543266.jpeg'
  },
  {
    id: 3,
    title: 'Pest Control Strategies for Organic Farming',
    category: 'Pest Management',
    summary: 'Explore effective organic methods to manage pests without harmful chemicals.',
    readTime: '10 min read',
    date: '2024-05-03',
    image: 'https://images.pexels.com/photos/7728087/pexels-photo-7728087.jpeg'
  }
];

export const dashboardStats = {
  farms: 3,
  totalArea: '30.8 hectares',
  activeCrops: 3,
  pendingTasks: 3,
  weatherAlert: 'Heavy rain expected in 3 days',
  soilMoisture: '75%',
  recentActivity: [
    { time: '2 hours ago', action: 'Soil moisture levels updated' },
    { time: '1 day ago', action: 'Completed irrigation maintenance' },
    { time: '2 days ago', action: 'Updated crop rotation plan' }
  ]
};
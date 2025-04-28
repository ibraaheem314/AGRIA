import React from 'react';
import { Search, Bookmark, Filter } from 'lucide-react';
import ArticleCard from '../components/resources/ArticleCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { resourceArticles } from '../utils/mockData';

const Resources = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Resource Center</h1>
          <p className="text-gray-600">Explore articles, guides, and farming best practices</p>
        </div>
        <div className="mt-3 md:mt-0">
          <Button 
            variant="outline" 
            icon={<Bookmark size={16} />}
          >
            Saved Resources
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>

          <div className="flex gap-2">
            <select className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">All Categories</option>
              <option value="irrigation">Irrigation</option>
              <option value="soil">Soil Management</option>
              <option value="pest">Pest Management</option>
              <option value="sustainable">Sustainable Farming</option>
            </select>
            <Button 
              variant="outline" 
              icon={<Filter size={16} />}
            >
              Filter
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {resourceArticles.map((article) => (
          <ArticleCard 
            key={article.id}
            title={article.title}
            category={article.category}
            summary={article.summary}
            readTime={article.readTime}
            date={article.date}
            image={article.image}
          />
        ))}
      </div>

      <Card className="p-6 bg-green-50 border border-green-100">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">Get Personalized Farming Advice</h3>
            <p className="text-gray-600 mt-2">
              Connect with agriculture experts to get customized recommendations for your farm.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="primary">Connect with Expert</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Resources;
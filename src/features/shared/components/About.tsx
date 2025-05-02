import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cloud, Cpu, BarChart, Users, Globe } from 'lucide-react';
import Button from '../../shared/ui/components/Button';

const About = () => {
  return (
    <div className="bg-dark text-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>
        <div className="absolute right-0 w-3/4 h-full bg-[url('/img/earth.jpg')] bg-cover bg-center opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="text-primary mb-4">ABOUT US</div>
            <h1 className="text-5xl md:text-6xl font-light mb-8">
              Building the Agricultural Data Backbone for Sustainable Farming
            </h1>
            <p className="text-xl text-gray-400 mb-12">
              In 10 years, we want any agricultural data to be processed and distributed efficiently with AgriTech as the backbone. Our R&D will be the key to a true technological leapfrog for farming communities worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-b border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-2">500TB+</h2>
              <p className="text-gray-400">Training Data</p>
            </div>
            <div className="text-center p-6">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-2">35+</h2>
              <p className="text-gray-400">Countries Active</p>
            </div>
            <div className="text-center p-6">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-2">1000+</h2>
              <p className="text-gray-400">Data Sources</p>
            </div>
            <div className="text-center p-6">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-2">120M</h2>
              <p className="text-gray-400">Hectares Analyzed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-b from-dark to-darker">
        <div className="container mx-auto px-4 text-center">
          <div className="text-primary mb-6">OUR MISSION</div>
          <h2 className="text-4xl md:text-5xl font-light mb-12 max-w-4xl mx-auto">
            Provide the deep tech infrastructure upon which others can build to close the data and compute gaps for sustainable agriculture.
          </h2>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-6">Our core capabilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-dark border border-neutral-800 rounded-lg">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Cpu size={32} />
                </div>
              </div>
              <h3 className="text-xl font-medium text-center mb-4">AI Models for Agriculture</h3>
              <p className="text-gray-400 text-center">
                Transform your agricultural datasets into actionable insights using our pre-trained AI models optimized for farming contexts.
              </p>
            </div>

            <div className="p-8 bg-dark border border-neutral-800 rounded-lg">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Database size={32} />
                </div>
              </div>
              <h3 className="text-xl font-medium text-center mb-4">Data Processing</h3>
              <p className="text-gray-400 text-center">
                Structure and convert raw remote sensing, tabular and fragmented agricultural data into structured datasets ready for analysis.
              </p>
            </div>

            <div className="p-8 bg-dark border border-neutral-800 rounded-lg">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Cloud size={32} />
                </div>
              </div>
              <h3 className="text-xl font-medium text-center mb-4">Seamless Integration</h3>
              <p className="text-gray-400 text-center">
                Deploy data-driven intelligence that integrates seamlessly into any agricultural business workflows via API.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-8">
              By making agricultural data accessible and actionable, we empower industries to solve real-world farming challenges at scale.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-primary mb-4 text-center">WHO WE ARE</div>
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-center max-w-4xl mx-auto">
            Founded in 2022, headquartered in Paris, and built by a diverse team from across the globe, AgriTech is building foundational technologies for the future of farming.
          </h2>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark z-10"></div>
            <div className="rounded-lg overflow-hidden border border-neutral-800">
              <img src="/img/team.jpg" alt="AgriTech Team" className="w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-5xl font-light mb-12">Our Values</h2>
            </div>
            <div className="space-y-12">
              <div>
                <h3 className="flex items-center text-xl font-medium mb-4">
                  <span className="text-primary mr-2">*</span>
                  We are Collaborative
                </h3>
                <p className="text-gray-400">We are building an ecosystem to go further together in sustainable agriculture.</p>
              </div>
              
              <div>
                <h3 className="flex items-center text-xl font-medium mb-4">
                  <span className="text-primary mr-2">*</span>
                  We are Passionate
                </h3>
                <p className="text-gray-400">
                  We take our mission personally; our impact on the world will not be on how many features we have built, 
                  but how many farmers we have helped and environments we have preserved.
                </p>
              </div>
              
              <div>
                <h3 className="flex items-center text-xl font-medium mb-4">
                  <span className="text-primary mr-2">*</span>
                  We are Innovative
                </h3>
                <p className="text-gray-400">
                  We constantly explore new solutions and approaches to agricultural challenges.
                </p>
              </div>
              
              <div>
                <h3 className="flex items-center text-xl font-medium mb-4">
                  <span className="text-primary mr-2">*</span>
                  We have Integrity
                </h3>
                <p className="text-gray-400">
                  We think decades into the future, to lead where others may not yet see a path to sustainable farming.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-primary mb-4">MEET THE TEAM</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                AgriTech is built by a diverse, mission-driven team
              </h2>
            </div>
            <div>
              <p className="text-xl text-gray-400">
                Our experts in data science, AI, and geospatial intelligence are dedicated to building the data
                infrastructure for sustainable agriculture worldwide.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team members would go here */}
            <div className="bg-dark rounded-lg overflow-hidden border border-neutral-800">
              <div className="aspect-square bg-neutral-900 relative">
                {/* Placeholder for team member image */}
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                  <Users size={48} className="text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium">Marie Laurent</h3>
                <p className="text-gray-400">Founder & CEO</p>
              </div>
            </div>
            
            <div className="bg-dark rounded-lg overflow-hidden border border-neutral-800">
              <div className="aspect-square bg-neutral-900 relative">
                {/* Placeholder for team member image */}
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                  <Users size={48} className="text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium">Thomas Dubois</h3>
                <p className="text-gray-400">Chief Operations Officer</p>
              </div>
            </div>
            
            <div className="bg-dark rounded-lg overflow-hidden border border-neutral-800">
              <div className="aspect-square bg-neutral-900 relative">
                {/* Placeholder for team member image */}
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                  <Users size={48} className="text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium">Amir Karam</h3>
                <p className="text-gray-400">Technology Lead</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8">Join us in transforming agriculture</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Get in touch to learn how AgriTech can help you build a more sustainable agricultural future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary" className="text-white px-8 py-3">
              Contact Us
            </Button>
            <Button variant="outline" className="text-white border-white px-8 py-3">
              View Our Platform
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 
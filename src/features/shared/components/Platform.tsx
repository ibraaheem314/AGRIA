import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../../shared/ui/components/Button';

const Platform = () => {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="py-28 relative border-b border-neutral-800">
        <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="text-amber-500 mb-4">PLATFORM</div>
            <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
              Purpose-Built Data Infrastructure for Agriculture
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed">
              The AI-native distributed infrastructure stack for the age of precision farming—where data is unstructured, compute is everywhere, and trust is earned.
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mb-12">
              The biggest barriers to AI adoption in agriculture are: data and compute—scarce, fragmented, and inaccessible. AgriTech is developing the building blocks for the future of data in your farm.
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-20 border-b border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="border-l-2 border-amber-500 pl-6">
              <div className="text-5xl font-light mb-4">24TB</div>
              <div className="text-gray-400">Training Data</div>
            </div>
            <div className="border-l-2 border-amber-500 pl-6">
              <div className="text-5xl font-light mb-4">+40</div>
              <div className="text-gray-400">Countries Active</div>
            </div>
            <div className="border-l-2 border-amber-500 pl-6">
              <div className="text-5xl font-light mb-4">500+</div>
              <div className="text-gray-400">Data Sources</div>
            </div>
            <div className="border-l-2 border-amber-500 pl-6">
              <div className="text-5xl font-light mb-4">120M</div>
              <div className="text-gray-400">Hectares Analyzed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-28">
            <div className="text-amber-500 mb-4">UNLOCKING AI-READY DATA</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-light mb-6">
                  AgriTech simplifies the data-to-insights journey with a scalable, end-to-end data platform.
                </h2>
                <div className="mt-12 inline-block">
                  <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-black">
                    Book a demo
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              </div>
              <div className="py-12 px-8 bg-neutral-900 border border-neutral-800 rounded-lg">
                <p className="text-lg mb-4">Book a demo</p>
                <p className="text-gray-400 mb-8">
                  If you're looking to explore our platform and offerings, you can book a 1:1 consultation with us.
                </p>
                <Button className="bg-white text-black hover:bg-gray-200">
                  Book now
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Feature 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 items-center">
            <div>
              <div className="text-amber-500 mb-4">INGEST & AGGREGATE</div>
              <h3 className="text-3xl font-light mb-4">
                Collect and aggregate multi-source data,{" "}
                <span className="text-gray-500">and structure it for analysis.</span>
              </h3>
              <p className="text-gray-400 mt-6">
                Our platform seamlessly integrates satellite imagery, weather data, IoT sensors, and historical records to create a comprehensive view of your agricultural operations.
              </p>
            </div>
            <div className="aspect-square bg-neutral-900 border border-neutral-800 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-6 grid-rows-6 gap-2 opacity-70">
                  {Array(36).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-4 ${Math.random() > 0.7 ? 'bg-gray-600' : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 items-center">
            <div className="order-2 md:order-1 aspect-square bg-neutral-900 border border-neutral-800 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {Array(4).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className="col-start-1 row-start-1 bg-gray-700"
                      style={{
                        gridColumnStart: Math.floor(Math.random() * 6) + 1,
                        gridRowStart: Math.floor(Math.random() * 6) + 1,
                        gridColumnEnd: 'span 2',
                        gridRowEnd: 'span 2'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="text-amber-500 mb-4">VALIDATE & CALIBRATE</div>
              <h3 className="text-3xl font-light mb-4">
                Align data with ground-truth sources{" "}
                <span className="text-gray-500">to ensure accuracy and reliability.</span>
              </h3>
              <p className="text-gray-400 mt-6">
                Our validation mechanisms ensure that all data is cross-referenced with established benchmarks, providing you with accurate insights you can trust for critical farming decisions.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 items-center">
            <div>
              <div className="text-amber-500 mb-4">AI-POWERED ANALYTICS</div>
              <h3 className="text-3xl font-light mb-4">
                Process complex datasets with custom AI models{" "}
                <span className="text-gray-500">tailored for your farm.</span>
              </h3>
              <p className="text-gray-400 mt-6">
                Our specialized AI models can predict crop yields, detect pest infestations early, optimize irrigation schedules, and provide actionable recommendations specific to your agricultural conditions.
              </p>
            </div>
            <div className="aspect-square bg-neutral-900 border border-neutral-800 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-70">
                <div className="grid grid-cols-10 grid-rows-10 gap-0 w-4/5 h-4/5">
                  {Array(100).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-center text-[8px] text-gray-600">
                      {Math.random() > 0.5 ? 'd' : Math.random() > 0.3 ? '8' : Math.random() > 0.5 ? 'B' : '0'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 aspect-square bg-neutral-900 border border-neutral-800 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-1/2 h-1/2 border border-gray-700">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-4 border border-gray-700">
                    <div className="text-2xl font-light text-white">AGRITECH</div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full">
                    {Array(8).fill(0).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute bg-transparent w-8 h-px bg-gray-700"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `rotate(${i * 45}deg)`,
                          transformOrigin: 'left center'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="text-amber-500 mb-4">API-FIRST INTEGRATION</div>
              <h3 className="text-3xl font-light mb-4">
                Embed AgriTech's insights{" "}
                <span className="text-gray-500">directly into your workflows and existing platforms for seamless automation.</span>
              </h3>
              <p className="text-gray-400 mt-6">
                Our API-centric design allows you to integrate our agricultural intelligence into your existing farm management software, mobile apps, or IoT systems with minimal development effort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-neutral-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-light mb-8">Ready to transform your agricultural data?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Get in touch with our team to explore how AgriTech can help optimize your farming operations.
          </p>
          <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg">
            Schedule a consultation
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Platform; 
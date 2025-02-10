import React from "react";

function FeaturedProperties({ properties }) {
  const features = [
    {
      title: "Advanced Mapping",
      description:
        "Seamlessly integrate maps for land surveys and acquisition planning.",
    },
    {
      title: "Data Accuracy",
      description: "Ensure precision with real-time geospatial data.",
    },
    {
      title: "Transparent Workflow",
      description: "Track every step of the acquisition process effortlessly.",
    },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-6">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default FeaturedProperties;

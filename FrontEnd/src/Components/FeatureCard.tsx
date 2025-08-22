import React from 'react'

type FeatureCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;

}

const FeatureCard: React.FC<FeatureCardProps> =({icon, title, description}) => {
  return (
    <div className='bg-white p-8 rounded-xl shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center text-center'>
        <div className='bg-blue-100 text-blue-600 rounded-full p-4 mb-5'>
            {icon}
        </div>
        <h3 className='text-xl font-bold text-gray-900 mb-3'>{title}</h3>
        <p className='text-gray-600 leading-relaxed'>{description}</p>
    </div>
  )
}

export default FeatureCard;
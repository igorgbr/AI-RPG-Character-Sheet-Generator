
import React from 'react';

interface StatBlockProps {
    title: string;
    stats: Record<string, number>;
    color: string;
}

const StatBlock: React.FC<StatBlockProps> = ({ title, stats, color }) => {
    return (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <h3 className={`text-lg font-bold mb-3 ${color}`}>{title}</h3>
            <div className="space-y-3">
                {Object.entries(stats).map(([skill, value]) => (
                    <div key={skill}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-medium text-gray-300">{skill}</span>
                            <span className={`font-semibold ${color}`}>{value}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${value * 10}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatBlock;

import React from 'react';

type Props = {
  experienceUrl: string;
  title?: string;
  height?: string;
};

const TeachingLearningResearch: React.FC<Props> = ({ experienceUrl, title = 'Teaching, Learning and Research', height = '80vh' }) => {
  return (
    <div className="w-full bg-white rounded overflow-hidden">
      <div className="px-4 py-2 border-b bg-slate-50 text-sm font-medium text-slate-700">{title}</div>
      <div style={{ height }} className="w-full">
        <iframe
          src={experienceUrl}
          title={title}
          style={{ width: '100%', height: '100%', border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default TeachingLearningResearch;

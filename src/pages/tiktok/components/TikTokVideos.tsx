interface TikTokVideo {
  id: string;
  thumbnail: string;
  caption: string;
  duration: string;
  type: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  posted: string;
  leads: number;
  engagementRate: number;
}

interface TikTokVideosProps {
  videos: TikTokVideo[];
  onNewVideo: () => void;
  formatNumber: (n: number) => string;
}

export default function TikTokVideos({ videos, onNewVideo, formatNumber }: TikTokVideosProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Recent Videos</h3>
        <button
          onClick={onNewVideo}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, #FE2C55, #25F4EE)' }}
        >
          <i className="ri-add-line mr-1" /> New Video
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="bg-slate-50 rounded-2xl overflow-hidden">
            <div className="relative">
              <img src={video.thumbnail} alt={video.caption} className="w-full h-48 object-cover" />
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md">
                {video.duration}
              </div>
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold text-white" style={{ background: 'linear-gradient(135deg, #FE2C55, #25F4EE)' }}>
                {video.type}
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2">{video.caption}</p>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 mb-2">
                <span><i className="ri-eye-line mr-1" />{formatNumber(video.views)}</span>
                <span><i className="ri-heart-3-line mr-1" />{formatNumber(video.likes)}</span>
                <span><i className="ri-chat-1-line mr-1" />{formatNumber(video.comments)}</span>
                <span><i className="ri-share-forward-line mr-1" />{formatNumber(video.shares)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{video.posted}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: '#FE2C55' }}>
                  {video.leads} leads
                </span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-slate-500">Engagement</span>
                  <span className="font-semibold" style={{ color: '#FE2C55' }}>{video.engagementRate}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(video.engagementRate * 8, 100)}%`, background: 'linear-gradient(90deg, #FE2C55, #25F4EE)' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

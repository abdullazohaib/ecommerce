import React from 'react';
import { useStore } from '../../context/StoreContext';
import { blogPosts } from '../../data/blogPosts';
import { ArrowLeft, Clock, BookOpen, ArrowRight } from 'lucide-react';

export const BlogPage = () => {
  const { setViewWithUrl, addToast } = useStore();

  const handleRead = (title) => {
    addToast(`Article: "${title}"`, 'info');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setViewWithUrl('home');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </a>

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Skincare Science & Advice
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
            The Radiance Journal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Expert dermatological advice, ingredient breakdowns, and nighttime routine guides.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map(post => (
            <div
              key={post.id}
              onClick={() => handleRead(post.title)}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-rose-600 group-hover:text-rose-700">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};


import React from 'react';
import { blogPosts } from '../../data/blogPosts';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BlogHighlights = () => {
  const { addToast } = useStore();

  const handleReadArticle = (title) => {
    addToast(`Opening article: "${title}"`, 'info');
  };

  return (
    <section id="skincare-guides" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Skincare Knowledge Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mt-1">
            Tips, Guides & Product Science
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Expert advice on nighttime routines, ingredients, and maintaining natural, lasting glow.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogPosts.map(post => (
          <div
            key={post.id}
            onClick={() => handleReadArticle(post.title)}
            className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
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

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-rose-600 group-hover:text-rose-700">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

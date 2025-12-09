import React from 'react';
import { Post } from '../types';

interface FeedItemProps {
  post: Post;
  isAdminView?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const FeedItem: React.FC<FeedItemProps> = ({ 
  post, 
  isAdminView = false, 
  onApprove, 
  onReject, 
  onDelete 
}) => {
  const isGuestbook = post.type === 'guestbook';
  
  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('nl-NL', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
  };

  // Styles for "Guestbook" entries (Krabbels)
  const guestbookStyle = "bg-white border-2 border-pink-400 rounded-tr-3xl rounded-bl-3xl rounded-tl-md rounded-br-md shadow-[4px_4px_0px_0px_rgba(236,72,153,1)]";
  
  // Styles for "Admin/CMS" text blocks (Blog)
  const adminBlockStyle = "bg-gradient-to-r from-yellow-100 to-yellow-50 border-4 border-dashed border-orange-400 rounded-xl shadow-lg";

  return (
    <div className={`mb-6 p-4 relative ${isGuestbook ? guestbookStyle : adminBlockStyle} transition-transform hover:scale-[1.01]`}>
      
      {/* Header Section */}
      <div className={`flex items-center justify-between border-b pb-2 mb-2 ${isGuestbook ? 'border-pink-200' : 'border-orange-200'}`}>
        <div className="flex items-center gap-3">
            {isGuestbook ? (
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border border-black">
                     <img 
                        src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${post.author}`} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <span className="text-2xl">👑</span>
            )}
            <div>
                <h3 className={`font-bold text-lg ${isGuestbook ? 'text-pink-600' : 'text-orange-600'}`}>
                {post.author}
                </h3>
                <span className="text-xs text-gray-500 font-mono">{formatDate(post.timestamp)}</span>
            </div>
        </div>
        {post.status === 'pending' && isAdminView && (
             <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold border border-black animate-pulse">
                NIEUW
             </span>
        )}
      </div>

      {/* Content Section */}
      <div className="prose prose-sm max-w-none text-black">
        {post.image && (
          <img 
            src={post.image} 
            alt="User uploaded" 
            className="max-h-60 rounded-lg border-2 border-black mb-3 block"
          />
        )}
        <div 
          className="whitespace-pre-wrap break-words font-comic"
          dangerouslySetInnerHTML={{ 
              // Basic sanitization/conversion for bold/italic would happen here in a real app
              // For now we just render text, or if it's admin, we assume safe HTML
              __html: post.type === 'admin' 
                ? post.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*(.*?)\*/g, '<i>$1</i>')
                : post.content 
            }} 
        />
      </div>

      {/* Admin Controls */}
      {isAdminView && (
        <div className="mt-4 pt-4 border-t border-gray-300 flex flex-wrap gap-2 justify-end bg-gray-50 -mx-4 -mb-4 p-4 rounded-b-lg">
           {post.ip && <span className="text-xs text-gray-400 mr-auto self-center">IP: {post.ip}</span>}
           
           {post.status === 'pending' && (
             <>
               <button 
                onClick={() => onApprove?.(post.id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-bold border-2 border-green-700"
               >
                 Goedkeuren
               </button>
               <button 
                 onClick={() => onReject?.(post.id)}
                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-bold border-2 border-red-700"
               >
                 Afwijzen
               </button>
             </>
           )}
           <button 
             onClick={() => onDelete?.(post.id)}
             className="text-red-500 underline text-xs hover:text-red-700 ml-2"
           >
             Verwijderen
           </button>
        </div>
      )}
    </div>
  );
};

export default FeedItem;

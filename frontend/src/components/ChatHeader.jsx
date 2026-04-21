import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;
  const isOnline = onlineUsers.includes(selectedUser._id);
  return (
    <div className="flex items-center justify-between bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
      {/* Left: User Info */}
      <div className="flex items-center gap-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-10 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm">{selectedUser.fullName}</h3>
          <p
            className={`text-xs ${isOnline ? "text-green-500" : "text-stone-100"}`}
          >
            {isOnline ? "online" : "offline"}
          </p>
        </div>
      </div>

      {/* Right: Close Button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="p-2 rounded-full hover:bg-base-200 transition"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ChatHeader;

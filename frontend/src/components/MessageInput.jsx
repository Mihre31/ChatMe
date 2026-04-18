import React, { useRef, useState } from "react";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const { playRandomkeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();
  const canSend = Boolean(text.trim() || imagePreview);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText && !imagePreview) return;

    await sendMessage({
      text: trimmedText,
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="border-t border-slate-700/50 p-4">
      {imagePreview && (
        <div className="mx-auto mb-3 flex max-w-3xl items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-20 rounded-lg border border-slate-700 object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="mx-auto flex max-w-3xl items-center space-x-4"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (isSoundEnabled) playRandomkeyStrokeSound();
          }}
          className="flex-1 rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-2"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-2 text-slate-200 transition hover:bg-slate-700"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        <button
          type="submit"
          disabled={!canSend}
          className={`rounded-lg p-2 text-white transition duration-200 ${
            canSend
              ? "bg-emerald-500 shadow-lg shadow-emerald-500/30 hover:bg-emerald-600"
              : "cursor-not-allowed bg-emerald-500/40 opacity-70 blur-[1px]"
          }`}
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

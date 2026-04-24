import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const notificationSound = new Audio("/sounds/notification.mp3");
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => {
    const authUserId = useAuthStore.getState().authUser?._id?.toString();
    const selectedUserId = selectedUser?._id?.toString();

    if (!selectedUser || !selectedUserId || selectedUserId === authUserId) {
      set({ selectedUser: null, messages: [] });
      return;
    }

    set({ selectedUser, messages: [] });
  },

  getAllcontacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser || !authUser) return;

    if (selectedUser._id?.toString() === authUser._id?.toString()) {
      toast.error("You cannot send a message to yourself.");
      return;
    }

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...get().messages, optimisticMessage] });
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );

      set({
        messages: get().messages.map((m) => (m._id === tempId ? res.data : m)),
      });
      get().getMessagesByUserId(selectedUser._id);
    } catch (error) {
      set({
        messages: get().messages.filter((m) => m._id !== tempId),
      });
      toast.error(error?.response?.data?.message ?? "Failed to send messages");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;

    if (!selectedUser || !socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const activeUserId = get().selectedUser?._id?.toString();
      const isMessageForOpenChat =
        newMessage.senderId?.toString() === activeUserId ||
        newMessage.receiverId?.toString() === activeUserId;

      if (!isMessageForOpenChat) return;

      if (!isMessageForOpenChat) return;

      get().getMessagesByUserId(activeUserId);

      if (get().isSoundEnabled) {
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed: ", e));
      }
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
  },
}));

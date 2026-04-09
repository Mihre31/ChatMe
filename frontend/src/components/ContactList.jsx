import React, { useEffect } from "react";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

import { useChatStore } from "../store/useChatStore";

function ContactList() {
  const { getAllcontacts, setSelectedUser, allContacts, isUsersLoading } =
    useChatStore();

  useEffect(() => {
    getAllcontacts();
  }, [getAllcontacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            {/*TODO: FIX THE ONLINE STATUS AND MAKE IT WORK WITH SOCKET */}
            <div className={`avatar online`}>
              <div className="size-12 rounded-full">
                <img
                  src={contact.profilePic || "avatar.png"}
                  alt={contact.fullName}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {contact.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
}

export default ContactList;

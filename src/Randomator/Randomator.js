import React, { useState, useEffect } from 'react';
import { addUserToRandomatorFirebase, saveGroupsToRandomatorFirebase, deleteUserFromFirebase, subscribeToUsers, getGroupsFromRandomatorFirebase } from '../../firebase';

import UserInput from './UserInput';
import GroupDisplay from './GroupDisplay';
import { motion, AnimatePresence } from 'framer-motion';

const Randomator = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [groupsLoaded, setGroupsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeUsers = subscribeToUsers((loadedUsers) => {
      setUsers(loadedUsers);
      setUsersLoaded(true);
    });

    const unsubscribeGroups = getGroupsFromRandomatorFirebase((loadedGroups) => {
      setGroups(loadedGroups);
      setGroupsLoaded(true);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeGroups();
    };
  }, []);

  useEffect(() => {
    if (usersLoaded && groupsLoaded) {
      setLoading(false);
    }
  }, [usersLoaded, groupsLoaded]);

  const addUser = async (nickname) => {
    await addUserToRandomatorFirebase(nickname);
  };

  const selectUser = (id) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]));
  };

  const divideIntoGroups = async () => {
    let selected;

    if (selectedUsers.length > 0 || groups.length > 0) {
      const selectedFromUI = users.filter((u) => selectedUsers.includes(u.id));
      const groupedUserIds = groups.flatMap((g) => g.users.map((u) => u.id));
      const groupedUsers = users.filter((u) => groupedUserIds.includes(u.id));
      selected = [...groupedUsers, ...selectedFromUI.filter((u) => !groupedUserIds.includes(u.id))];
    } else {
      alert('Nejprve označ hráče pro rozdělení do skupin.');
      return;
    }

    const shuffled = [...selected].sort(() => 0.5 - Math.random());

    const newGroups = [];
    let groupId = 1;
    const total = shuffled.length;

    if (total === 6) {
      for (let i = 0; i < 2; i++) {
        const groupUsers = shuffled.splice(0, 3).map((u) => ({ id: u.id }));
        newGroups.push({ groupId: groupId++, users: groupUsers });
      }
    } else {
      while (shuffled.length) {
        const groupUsers = shuffled
          .splice(0, 4)
          .filter((u) => u && u.id !== undefined)
          .map((u) => ({ id: u.id }));

        newGroups.push({
          groupId: groupId++,
          users: groupUsers,
        });
      }
    }

    await saveGroupsToRandomatorFirebase(newGroups);
    setSelectedUsers([]);
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUserFromFirebase(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Chyba při mazání uživatele:', err);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    const updatedGroups = groups
      .filter((group) => group.groupId !== groupId)
      .map((group) => {
        const validGroupId = group.groupId !== undefined ? group.groupId : Date.now();
        const validUsers = Array.isArray(group.users) ? group.users.filter((u) => u && typeof u.id === 'string' && u.id.trim() !== '').map((u) => ({ id: u.id })) : [];

        return {
          groupId: validGroupId,
          users: validUsers,
        };
      });

    setGroups(updatedGroups);
    saveGroupsToRandomatorFirebase(updatedGroups);
  };

  if (loading) return <div className="text-white p-4">Načítání dat...</div>;

  return (
    <div className="w-full min-h-screen bg-transparent text-gray-800">
      <div className="max-w-[1000px] mx-auto flex flex-col items-center pt-[100px]">
        <h1 className="text-3xl font-bold mb-6">Randomator</h1>
        <UserInput addUser={addUser} />
        <h2 className="text-2xl mb-4">Hráči</h2>

        <div className="grid grid-cols-2 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full px-4">
          <AnimatePresence>
            {users.map((user) => {
              const isInGroup = groups.some((g) => g.users.some((u) => u.id === user.id));
              const isSelected = selectedUsers.includes(user.id);

              let bgClass = 'hover:bg-gray-800';
              if (isInGroup) {
                bgClass = 'bg-[#FC3A1E] text-black';
              } else if (!isSelected) {
                bgClass = 'bg-[#9CFF99] text-black';
              }

              return (
                <motion.label
                  key={user.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-between border border-gray-600 rounded px-4 py-2 cursor-pointer transition ${bgClass}`}
                  htmlFor={`user-${user.id}`}>
                  <div className="flex items-center ">
                    <input id={`user-${user.id}`} type="checkbox" checked={isSelected || isInGroup} onChange={() => selectUser(user.id)} className="mr-3 cursor-pointer" />
                    <span className="text-sm md:text-lg">{user.nickname}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.confirm('Opravdu chceš smazat tohoto hráče?')) {
                        handleDeleteUser(user.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-xl"
                    title="Smazat hráče">
                    🗑️
                  </button>
                </motion.label>
              );
            })}
          </AnimatePresence>
        </div>

        <button onClick={divideIntoGroups} className="text-white border-2 w-64 group px-6 py-3 my-6 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600">
          Rozděl do skupiny
        </button>

        <GroupDisplay groups={groups} users={users} onDeleteGroup={handleDeleteGroup} />
      </div>
    </div>
  );
};

export default Randomator;

import React, { useState, useEffect } from 'react';
import { addUserToRandomatorFirebase, saveGroupsToRandomatorFirebase, deleteUserFromFirebase, subscribeToUsers, getGroupsFromRandomatorFirebase, renameUserInRandomatorFirebase } from '../../firebase';

import UserInput from './UserInput';
import GroupDisplay from './GroupDisplay';

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

        newGroups.push({ groupId: groupId++, users: groupUsers });
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
  const renameUser = async (id, newNickname) => {
    try {
      await renameUserInRandomatorFirebase(id, newNickname);
    } catch (err) {
      console.error('Chyba při přejmenování hráče:', err);
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

  const groupedUserIds = groups.flatMap((g) => g.users.map((u) => u.id));
  const ungroupedUsers = users.filter((u) => !groupedUserIds.includes(u.id));
  const selectedOnly = users.filter((u) => selectedUsers.includes(u.id) && !groupedUserIds.includes(u.id));
  const groupedUsers = users.filter((u) => groupedUserIds.includes(u.id));

  if (loading) return <div className="text-blue-600 p-4">Načítání dat...</div>;

  return (
    <div className="w-full min-h-screen bg-[#e9f0fb] text-gray-800 py-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Randomator</h1>
        <UserInput addUser={addUser} />

        <div className="w-full grid md:grid-cols-3 gap-6 mt-10">
          {/* Nepřiřazení hráči */}
          <div className="bg-green-100 border border-green-400 rounded-lg p-4 shadow">
            <h2 className="text-lg font-bold text-green-800 mb-2">Nepřiřazení hráči</h2>
            {ungroupedUsers.map((user) => (
              <div key={user.id} className={`flex items-center justify-between p-2 rounded hover:bg-green-200 ${selectedUsers.includes(user.id) ? 'bg-gray-300' : ''}`}>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => selectUser(user.id)} className="mr-2" />
                  <span>{user.nickname}</span>
                </label>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      const newName = prompt('Zadej nové jméno hráče:', user.nickname);
                      if (newName && newName.trim() !== '') renameUser(user.id, newName.trim());
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                    title="Přejmenovat hráče">
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Opravdu chceš smazat tohoto hráče?')) handleDeleteUser(user.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Smazat hráče">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Vybraní hráči */}
          <div className="bg-gray-100 border border-gray-400 rounded-lg p-4 shadow">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Vybraní hráči</h2>
            {selectedOnly.length > 0 ? (
              selectedOnly.map((user) => (
                <div key={user.id} className="p-2 bg-gray-200 rounded mb-1">
                  {user.nickname}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">Žádní vybraní hráči</p>
            )}
          </div>

          {/* Přiřazení hráči */}
          <div className="bg-red-100 border border-red-400 rounded-lg p-4 shadow">
            <h2 className="text-lg font-bold text-red-800 mb-2">Přiřazení hráči</h2>
            {groupedUsers.length > 0 ? (
              groupedUsers.map((user) => (
                <div key={user.id} className="p-2 bg-red-200 rounded mb-1 cursor-not-allowed opacity-70">
                  {user.nickname}
                </div>
              ))
            ) : (
              <p className="text-sm text-red-600">Žádní přiřazení hráči</p>
            )}
          </div>
        </div>

        <button onClick={divideIntoGroups} className="bg-indigo-100 text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-indigo-200 transition mt-10">
          Rozděl do skupiny
        </button>

        <GroupDisplay groups={groups} users={users} onDeleteGroup={handleDeleteGroup} />
      </div>
    </div>
  );
};

export default Randomator;

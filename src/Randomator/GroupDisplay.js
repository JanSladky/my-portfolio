import React from 'react';

const GroupDisplay = ({ groups, users, onDeleteGroup }) => {
  if (!users || users.length === 0) {
    return <div className="text-red-500">Žádní uživatelé nejsou k dispozici.</div>;
  }

  if (!groups || groups.length === 0) {
    return <div className="text-red-500">Žádné skupiny nejsou k dispozici.</div>;
  }

  return (
    <div className="mt-10">
      <h2 className="text-gray-300 text-2xl mb-4 text-center">Skupiny</h2>
      <div className="flex flex-wrap justify-center gap-2">
        {groups.map((group, index) => {
          const usersInGroup = Array.isArray(group.users) ? group.users : [];

          return (
            <div key={group.groupId || index} className="border border-gray-600 p-4 rounded mb-8 text-gray-300 w-64 relative">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Skupina {index + 1}</h3>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm('Opravdu chceš smazat tohoto hráče?')) onDeleteGroup(group.groupId || index);
                  }}
                  className="text-red-500 hover:text-red-700"
                  title="Smazat skupinu">
                  🗑️
                </button>
              </div>

              {usersInGroup.length === 0 ? (
                <div className="text-red-500">Skupina je prázdná nebo chybně načtená.</div>
              ) : (
                <ul className="list-disc list-inside">
                  {usersInGroup.map((user) => {
                    const matchedUser = users.find((u) => u.id === user.id);
                    return <li key={user.id}>{matchedUser ? matchedUser.nickname : <span className="text-red-500">Uživatel nenalezen</span>}</li>;
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupDisplay;

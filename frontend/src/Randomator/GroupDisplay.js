import React from 'react';

const GroupDisplay = ({ groups, users, onDeleteGroup }) => {
  if (!users || users.length === 0) {
    return <div className="text-red-500">Žádní uživatelé nejsou k dispozici.</div>;
  }

  if (!groups || groups.length === 0) {
    return <div className="text-red-500">Žádné skupiny nejsou k dispozici.</div>;
  }

  return (
    <div className="mt-20 w-full">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Skupiny</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {groups.map((group, index) => {
          const usersInGroup = Array.isArray(group.users) ? group.users : [];

          return (
            <div
              key={group.groupId || index}
              className="bg-white border border-gray-200 rounded-xl shadow-md w-64 p-4 relative"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-blue-600 font-bold text-md">Skupina {index + 1}</h3>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm('Opravdu chceš smazat tuto skupinu?')) {
                      onDeleteGroup(group.groupId || index);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                  title="Smazat skupinu"
                >
                  🗑️
                </button>
              </div>

              {usersInGroup.length === 0 ? (
                <div className="text-sm text-red-500">Skupina je prázdná nebo chybně načtená.</div>
              ) : (
                <ul className="space-y-1">
                  {usersInGroup.map((user) => {
                    const matchedUser = users.find((u) => u.id === user.id);
                    return (
                      <li
                        key={user.id}
                        className="bg-blue-50 text-blue-800 rounded px-2 py-1 text-sm font-medium"
                      >
                        {matchedUser ? matchedUser.nickname : (
                          <span className="text-red-500">Uživatel nenalezen</span>
                        )}
                      </li>
                    );
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
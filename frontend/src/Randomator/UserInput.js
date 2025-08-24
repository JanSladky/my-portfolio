import React, { useState } from 'react';

const UserInput = ({ addUser }) => {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      addUser(nickname.trim());
      setNickname('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center mb-8">
      <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Nickname" className="p-2 rounded h-10 mb-4 shadow-md w-64 text-center" />
      <button type="submit" className="bg-indigo-100 text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-indigo-200 transition">
        Přidat hráče
      </button>
    </form>
  );
};

export default UserInput;

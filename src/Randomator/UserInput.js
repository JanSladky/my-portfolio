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
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Nickname"
        className="p-2 rounded h-10 mb-4"
      />
      <button
        type="submit"
        className="text-white cursor-pointer border-2 w-64 group px-2 py-2 my-2 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600"
      >
        Přidat hráče
      </button>
    </form>
  );
};

export default UserInput;
// UserList.jsx
import React from 'react';

function UserList({ users, onUserClick, loading, error, search, addFriend, results }) {
  return (
    <div className='w-1/4 h-screen bg-blue-100 p-2 border-blue-300 border-r overflow-y-auto'>
      <div className='relative'>
        <input
          type="text"
          onChange={search}
          placeholder="Search for friends"
          className='p-2 w-10/12 rounded-lg shadow-sm'
        />
        <div className='absolute z-10'>
          {results.map((user) => (
            <div key={user.user_id} className='bg-blue-100 border-b border-blue-50 py-4 px-2'>
              {user.username}
              <button type="submit" onClick={() => addFriend(user.user_id)}>Add</button>
            </div>
          ))}
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        users.map((item) => (
          <div
            className='py-5 ps-5 my-2 rounded-lg bg-blue-300 border-b border-blue-50 shadow-sm flex'
            key={item.user_id}
            id={item.user_id}
            onClick={() => onUserClick(item.user_id)}
          >
            <img
              src={item.Profile !== '' ? `http://localhost:9999/${item.Profile}` : '/images/profile.jpeg'}
              alt=""
              className='w-10 h-10 rounded-full'
              onClick={(e) => e.stopPropagation()}
            />
            <div
              className='font-medium text-gray-800 ps-4 text-lg'
              onClick={(e) => e.stopPropagation()}
            >
              {item.username}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UserList;

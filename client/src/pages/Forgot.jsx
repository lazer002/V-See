import React, { useEffect } from 'react';

function Forgot() {


  return (
    <>
  <div>
        <input
          type="text"
          name="email"
          value={showUser.email }
          onChange={(e) => setShowUser({ ...showUser, email: e.target.value })}
        />
      </div>

      <button type="submit" onClick={updateDetails}>Save</button>
    </>
  );
}

export default Forgot;

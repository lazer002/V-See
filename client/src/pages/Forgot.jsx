import React, { useEffect, useState } from 'react';

function Forgot() {
const [showUser,setShowUser] = useState()


const updateDetails = (e)=>{
  console.log(e);
}

  return (
    <>
  <div>
        <input
          type="text"
          name="email"
          value={showUser }
          onChange={(e) => setShowUser({ ...showUser, email: e.target.value })}
        />
      </div>

      <button type="submit" onClick={updateDetails}>Save</button>
    </>
  );
}

export default Forgot;

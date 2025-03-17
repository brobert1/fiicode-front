import React, { useState } from 'react'
import SearchFriends from './SearchFriends'
import IdentitiesList from './IdentitiesList';

const AddFriendsList = () => {
  const [options, setOptions] = useState({});

  return (
    <div className="w-full px-2">
      <SearchFriends setOptions={setOptions} />
      <IdentitiesList options={options} />
    </div>
  );
}

export default AddFriendsList

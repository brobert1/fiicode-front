import { axios } from '@lib';

const confirm = async (hash) => {
  return await axios.post(`public/confirm/${hash}`);
};

export default confirm;

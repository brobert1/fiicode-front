import { classnames } from '@lib';
import { debounce, isFunction } from 'lodash';
import { useCallback, useRef } from 'react';

const Search = ({ value, onChange, extraClass, placeholder }) => {
  const ref = useRef();

  const request = debounce((value) => {
    if (isFunction(onChange)) {
      onChange(value);
    }
  }, 500);
  const debounceRequest = useCallback((value) => request(value), []);

  const handleChange = (event) => {
    return debounceRequest(event.target.value);
  };

  const handleKeyUp = (event) => {
    event.keyCode === 13 && ref.current.blur();
  };

  const resetInputValue = () => {
    ref.current.value = '';
    if (isFunction(onChange)) {
      onChange('');
    }
  };

  return (
    <div className={classnames('relative flex items-center', extraClass)}>
      <input
        className="w-full py-3 pl-10 pr-8 rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        defaultValue={value}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder={placeholder}
        ref={ref}
        type="text"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <i className="fas fa-search text-gray-400"></i>
      </div>
      {ref?.current?.value && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={resetInputValue}
          tabIndex="-1"
          type="button"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default Search;

import { format } from 'date-fns';

const DocumentCardHeader = ({ createdAt, showModal, tag, title }) => {
  const formattedDate = format(new Date(createdAt), 'MMMM d, yyyy');

  return (
    <div className="mb-4">
      <h3 onClick={showModal} className="text-xl font-bold text-gray-800 cursor-pointer mb-2">
        {title ?? formattedDate}
      </h3>
      <span className="bg-primary text-white rounded-full px-3 py-1 text-xs font-semibold">
        #{tag}
      </span>
    </div>
  );
};

export default DocumentCardHeader;

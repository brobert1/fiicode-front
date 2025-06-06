const DocumentCardBody = ({ text }) => {
  const truncatedText = text.length > 100 ? `${text.slice(0, 100)}...` : text;

  return (
    <div className="text-gray-600 text-sm mb-8">
      <p>{truncatedText}</p>
    </div>
  );
};

export default DocumentCardBody;

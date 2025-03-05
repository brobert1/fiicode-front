const PartnerCard = ({ partner }) => {
  //TODO: IMPLEMENT PARTNER DELETING
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center">
      <div className="w-32 h-32 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
        {partner.image ? (
          <img
            src={partner.image}
            alt={`${partner.name} logo`}
            className="w-full h-full object-contain rounded-full"
          />
        ) : (
          <div className="text-gray-300 text-4xl">
            <i className="fas fa-building"></i>
          </div>
        )}
      </div>
      <h3 className="font-bold text-xl text-center mb-2">{partner.name}</h3>
      <p className="text-gray-600 text-center mb-6">
        {partner.description || "No description available"}
      </p>
      <a
        href={partner.website || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors"
      >
        Visit Website
      </a>
    </div>
  );
};

export default PartnerCard;

import { useQuery, useFavoriteDirections } from "@hooks";
import { classnames } from "@lib";
import { isEmpty } from "lodash";

const EmptyState = () => (
  <div className="p-3 bg-gray-50 rounded-lg text-center">
    <p className="text-gray-500">You haven't saved any favorite places yet.</p>
    <p className="text-sm text-gray-400 mt-1">
      Search for places on the map and save them to see them here.
    </p>
  </div>
);

const FavouritePlaces = ({ onGetDirections, onMenuClose }) => {
  const { data: favoritePlaces, status } = useQuery("/client/favourite-places");

  const { isLoading, handleFavoriteDirections } = useFavoriteDirections({
    onGetDirections,
    onMenuClose,
  });

  const hasFavorites = !isEmpty(favoritePlaces);

  return (
    <div className="p-4 pt-0">
      <h3 className="text-lg font-semibold mb-2">Favorite Places</h3>
      <p className="text-gray-600 mb-4">Quick access to your favourite locations.</p>

      {status === "loading" && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {status === "error" && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
          <p>Unable to load your favorite places. Please try again later.</p>
        </div>
      )}
      {status === "success" && !hasFavorites && <EmptyState />}
      {status === "success" && hasFavorites && (
        <div className="overflow-x-auto hide-scrollbar pb-4">
          <div
            className="grid grid-cols-2 gap-3"
            style={{ minWidth: favoritePlaces.length > 2 ? "150%" : "100%" }}
          >
            {favoritePlaces.map((place) => (
              <div key={place._id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium truncate flex-1">{place.address}</h4>
                    <div className="text-red-500 ml-2 flex-shrink-0">
                      <i className="fas fa-heart"></i>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">
                      {place.latitude.toFixed(3)}, {place.longitude.toFixed(3)}
                    </span>
                    <button
                      onClick={() => handleFavoriteDirections(place)}
                      disabled={isLoading}
                      className={classnames(
                        "flex items-center justify-center px-2 py-1 text-xs rounded-md transition-colors flex-shrink-0",
                        isLoading
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      )}
                    >
                      {isLoading ? (
                        <>
                          <i className="fas fa-circle-notch fa-spin mr-1"></i>
                          Loading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-directions mr-1"></i>
                          Directions
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavouritePlaces;

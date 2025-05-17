import React from "react";

const PollutionInfoWindow = ({ data }) => {
  if (!data || !data.pollutants) return null;

  const { indexes, pollutants, healthRecommendations } = data;
  const hasCO = pollutants.some((p) => p.code === "co" || p.code === "co2");

  const index = indexes && indexes.length > 0 ? indexes[0] : null;
  const color =
    index && index.color
      ? `rgb(${(index.color.red || 0) * 255}, ${(index.color.green || 0) * 255}, ${
          (index.color.blue || 0) * 255
        })`
      : "#888";

  return (
    <div className="max-w-[300px] p-2.5">
      <h3 className="mt-0 text-gray-700 text-lg font-semibold">Air Quality Data</h3>

      {index && (
        <div className="font-bold mb-2 flex items-center">
          <span className="text-white py-[2px] px-2 rounded" style={{ backgroundColor: color }}>
            {index.aqiDisplay}
          </span>
          <span className="ml-2">{index.category}</span>
        </div>
      )}

      <div className="font-bold mt-3">Pollutant Concentrations:</div>
      <div className="max-h-[200px] overflow-y-auto">
        {pollutants.map((pollutant) => {
          const isHighlighted = pollutant.code === "co" || pollutant.code === "co2";
          return (
            <div
              key={pollutant.code}
              className={`my-2 p-2 border-b border-gray-200 ${isHighlighted ? "bg-[#f8f8d7]" : ""}`}
            >
              <div>
                <strong>
                  {pollutant.displayName} ({pollutant.fullName}):
                </strong>
              </div>
              <div>
                {pollutant.concentration?.value.toFixed(2)}{" "}
                {pollutant.concentration?.units === "MICROGRAMS_PER_CUBIC_METER" ? "µg/m³" : "ppb"}
              </div>
            </div>
          );
        })}
      </div>

      {healthRecommendations?.generalPopulation && (
        <div className="mt-3 italic text-sm">{healthRecommendations.generalPopulation}</div>
      )}

      {!hasCO && (
        <div className="mt-3 text-gray-600 text-sm">
          Note: CO₂ data is not directly available in this dataset, but other pollution indicators
          are shown.
        </div>
      )}
    </div>
  );
};

export default PollutionInfoWindow;

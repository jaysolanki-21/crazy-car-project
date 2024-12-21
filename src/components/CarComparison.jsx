import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SimpleImageSlider from "react-simple-image-slider"; // Importing the image slider

function CarComparison() {
  const [cars, setCars] = useState([]);  // State to hold all car data
  const [carId1, setCarId1] = useState(""); // Selected car 1 ID
  const [carId2, setCarId2] = useState(""); // Selected car 2 ID
  const [car1, setCar1] = useState(null); // Selected car 1 details
  const [car2, setCar2] = useState(null); // Selected car 2 details
  const [loading, setLoading] = useState(true); // Loading state
  const [showComparison, setShowComparison] = useState(false); // Show comparison after selection

  // Fetch all car data to populate the dropdowns
  useEffect(() => {
    const fetchCarData = async () => {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:5000/cardata");
        if (!response.ok) {
          throw new Error("Failed to fetch car data");
        }
        const data = await response.json();
        setCars(data); // Set the fetched car data to state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car data:", error);
        setLoading(false);
      }
    };

    fetchCarData();
  }, []);

  // Fetch car details for comparison
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!carId1 || !carId2) return; // Wait until both car IDs are selected

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/carinfo/${carId1}/${carId2}`);
        if (!response.ok) {
          throw new Error("Failed to fetch car comparison data");
        }
        const data = await response.json();
        setCar1(data.car1);
        setCar2(data.car2);
        setShowComparison(true); // Show comparison once data is fetched
      } catch (error) {
        console.error("Error fetching car comparison data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [carId1, carId2]);

  // Handle car selection changes
  const handleCarId1Change = (event) => setCarId1(event.target.value);
  const handleCarId2Change = (event) => setCarId2(event.target.value);

  // If loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "100px" }}>
      <div className="selectCarsContainer" style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Dropdown to select car 1 */}
        <div className="selectCar">
          {/* <label>Select Car 1:</label> */}
          <select value={carId1} onChange={handleCarId1Change} style={{ width: "500px",height: "50px",padding: "10px" }}>
            <option value="">Select a car</option>
            {cars.map((car) => (
              <option key={car._id} value={car._id}>
                {car.brand} {car.model}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown to select car 2 */}
        <div className="selectCar" style={{ marginBottom: "50px" }}>
          {/* <label>Select Car 2:</label> */}
          <select value={carId2} onChange={handleCarId2Change} style={{ width: "500px",height: "50px",padding: "10px" }}>
            <option value="">Select a car</option>
            {cars.map((car) => (
              <option key={car._id} value={car._id}>
                {car.brand} {car.model}
              </option>
            ))}
          </select>
        </div>

        {/* Compare Button */}
        {/* <button
          onClick={() => setShowComparison(true)}
          style={{
            backgroundColor: carId1 && carId2 ? "green" : "gray", // Only enable button if both cars are selected
            color: "white",
            padding: "10px 20px",
            borderRadius: "10px",
            cursor: carId1 && carId2 ? "pointer" : "not-allowed",
          }}
          disabled={!carId1 || !carId2} // Disable button if one or both cars are not selected
        >
          Compare Now
        </button> */}
      </div>

      {/* Show car details after comparison is triggered */}
      {showComparison && (
        <div className="carComparisonContainer" style={{ display: "flex", padding: "50px", border: "2px solid black", borderRadius: "20px" }}>
          {/* Car 1 Details */}
          {car1 && (
            <div className="carDetailsContainer" style={{ borderRadius: "50px", padding: "20px" }}>
              <div className="imageContainer">
                <SimpleImageSlider
                  width={500}
                  height={250}
                  images={car1.image.map((url) => ({ url }))}
                  showBullets={true}
                  showNavs={true}
                />
              </div>
              <div className="carInfo">
                <h2 style={{ textAlign: "center" }}>{car1.brand} {car1.model}</h2><br />
                <p style={{ textAlign: "center", fontSize: "20px" }}>Price: ₹ {car1.price}</p><br />
                <p>{car1.description}</p>
              </div>
              <div className="additionalInfoContainer">
                <div className="infoItem">
                  <strong>Fuel Type:</strong> <span>{car1.fuelType}</span>
                </div>
                <div className="infoItem">
                  <strong>Mileage:</strong> <span>{car1.mileage}</span>
                </div>
                <div className="infoItem">
                  <strong>Transmission:</strong> <span>{car1.transmission}</span>
                </div>
                <div className="infoItem">
                  <strong>Engine Capacity:</strong> <span>{car1.engineCapacity}</span>
                </div>
                <div className="infoItem">
                  <strong>Seating Capacity:</strong> <span>{car1.seatingCapacity} people</span>
                </div>
                <div className="infoItem">
                  <strong>Body Type:</strong> <span>{car1.bodyType}</span>
                </div>
                <div className="infoItem">
                  <strong>Safety Features:</strong> <span>{car1.safetyFeatures.join(", ")}</span>
                </div>
                <div className="infoItem">
                  <strong>Boot Space:</strong> <span>{car1.bootSpace} liters</span>
                </div>
                <div className="infoItem">
                  <strong>Additional Features:</strong> <span>{car1.features.join(", ")}</span>
                </div>
                <div className="infoItem">
                  <strong>Warranty:</strong> <span>{car1.warranty}</span>
                </div>
              </div>
            </div>
          )}

          {/* Car 2 Details */}
          {car2 && (
            <div className="carDetailsContainer" style={{ borderRadius: "20px", padding: "30px" }}>
              <div className="imageContainer">
                <SimpleImageSlider
                  width={500}
                  height={250}
                  images={car2.image.map((url) => ({ url }))}
                  showBullets={true}
                  showNavs={true}
                />
              </div>
              <div className="carInfo">
                <h2 style={{ textAlign: "center" }}>{car2.brand} {car2.model}</h2><br />
                <p style={{ textAlign: "center", fontSize: "20px" }}>Price: ₹ {car2.price}</p><br />
                <p>{car2.description}</p>
              </div>
              <div className="additionalInfoContainer">
                <div className="infoItem">
                  <strong>Fuel Type:</strong> <span>{car2.fuelType}</span>
                </div>
                <div className="infoItem">
                  <strong>Mileage:</strong> <span>{car2.mileage}</span>
                </div>
                <div className="infoItem">
                  <strong>Transmission:</strong> <span>{car2.transmission}</span>
                </div>
                <div className="infoItem">
                  <strong>Engine Capacity:</strong> <span>{car2.engineCapacity}</span>
                </div>
                <div className="infoItem">
                  <strong>Seating Capacity:</strong> <span>{car2.seatingCapacity} people</span>
                </div>
                <div className="infoItem">
                  <strong>Body Type:</strong> <span>{car2.bodyType}</span>
                </div>
                <div className="infoItem">
                  <strong>Safety Features:</strong> <span>{car2.safetyFeatures.join(", ")}</span>
                </div>
                <div className="infoItem">
                  <strong>Boot Space:</strong> <span>{car2.bootSpace} liters</span>
                </div>
                <div className="infoItem">
                  <strong>Additional Features:</strong> <span>{car2.features.join(", ")}</span>
                </div>
                <div className="infoItem">
                  <strong>Warranty:</strong> <span>{car2.warranty}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CarComparison;

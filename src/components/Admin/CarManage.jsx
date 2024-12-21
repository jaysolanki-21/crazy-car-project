import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Car from "../Car";
import { Pagination } from "@mui/material";

const CarManage = () => {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const carsPerPage = 10;
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/cardata/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Car Deleted Successfully");
        setCars(cars.filter((car) => car._id !== id));
      } else {
        console.error("Error deleting car data");
      }
    } catch (error) {
      console.error("Error deleting car data:", error);
    }
  };

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch("http://localhost:5000/cardataadmin");
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, []);

  // Calculate the cars to display based on the current page
  const startIndex = (page - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = cars.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          margin: "20px",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        {currentCars.map((car) => (
          <div
            key={car._id}
            style={{
              maxWidth: "300px",
              textAlign: "center",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Car
              id={car._id}
              image={car.image}
              title={`${car.brand} ${car.model}`}
              description={car.description}
              price={car.price}
              year={car.year}
              fuelType={car.fuelType}
              mileage={car.mileage}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "10px",
              }}
            >
              <button
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                onClick={() =>
                  navigate(`/update-car/${car._id}`, { replace: true })
                }
              >
                Update
              </button>
              <button
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                onClick={() => handleDelete(car._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Component */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Pagination
          count={Math.ceil(cars.length / carsPerPage)} 
          page={page}
          onChange={handlePageChange}
          size="large"
        />
      </div>
    </div>
  );
};

export default CarManage;

//------------------------------------------------------------------
// with apply filters button
// ----------------------------------------------------------------

import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  Pagination,
} from "@mui/material";
import Car from "./Car";

function Cars() {
  const [originalCarsData, setOriginalCarsData] = useState([]);
  const [carsData, setCarsData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 10;

  // Fetch car data on initial render
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch("http://localhost:5000/cardata");
        const data = await response.json();
        setOriginalCarsData(data);
        setCarsData(data);

        const uniqueBrands = Array.from(new Set(data.map((car) => car.brand)));
        setBrands(uniqueBrands);

        const uniqueModels = Array.from(new Set(data.map((car) => car.model)));
        setModels(uniqueModels);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };
    fetchCarData();
  }, []);

  // Filter models when a brand is selected
  useEffect(() => {
    if (selectedBrand) {
      const filteredModels = originalCarsData
        .filter((car) => car.brand === selectedBrand)
        .map((car) => car.model);
      setModels(Array.from(new Set(filteredModels)));
    } else {
      const uniqueModels = Array.from(
        new Set(originalCarsData.map((car) => car.model))
      );
      setModels(uniqueModels);
    }
  }, [selectedBrand, originalCarsData]);

  // Handle search/filter
  const handleSearch = () => {
    const filteredCars = originalCarsData.filter(
      (car) =>
        (selectedBrand ? car.brand === selectedBrand : true) &&
        (selectedModel ? car.model === selectedModel : true) &&
        (selectedFuelType ? car.fuelType === selectedFuelType : true)
    );
    setCarsData(filteredCars);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Handle Clear Filter
  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedFuelType("");
    setCarsData(originalCarsData);
  };

  // Pagination Logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = carsData.slice(indexOfFirstCar, indexOfLastCar);

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="carFirst">
        <div className="searchCar">
          <div className="carHeading">
            <h1>
              Buying your dream car? <br /> Check Now!
            </h1>
          </div>
          <div className="searchDetail">
            <Autocomplete
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              disableClearable
              className="searchTxt"
              disablePortal
              options={brands}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Select Brand" />
              )}
              value={selectedBrand}
              onChange={(e, newVal) => {
                setSelectedBrand(newVal);
                setSelectedModel("");
              }}
            />
            <Autocomplete
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              disableClearable
              className="searchTxt"
              disablePortal
              options={models}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Select Model" />
              )}
              value={selectedModel}
              onChange={(e, newVal) => setSelectedModel(newVal)}
            />
            <button className="Btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="carsFilter">
        <div className="byPrice">
          <select className="selectionList">
            <option hidden>Select Price Range</option>
            <option value="1-5">1 Lakh to 5 Lakh</option>
            <option value="5-10">5 Lakh to 10 Lakh</option>
            <option value="10-15">10 Lakh to 15 Lakh</option>
            <option value="15-20">15 Lakh to 20 Lakh</option>
            <option value="20-25">20 Lakh to 25 Lakh</option>
            <option value="below-25">Above 25 Lakh</option>
          </select>
        </div>  
      
        <div className="FualTypes">
          Fuel Types:
          <input
            type="radio"
            name="FuelType"
            id="Electric"
            value="Electric"
            checked={selectedFuelType === "Electric"}
            onChange={(e) => setSelectedFuelType(e.target.value)}
          />
          <label htmlFor="EV">EV</label>
          <br />
          <input
            type="radio"
            name="FuelType"
            id="Petrol"
            value="Petrol"
            checked={selectedFuelType === "Petrol"}
            onChange={(e) => setSelectedFuelType(e.target.value)}
          />
          <label htmlFor="Petrol">Petrol</label>
          <br />
          <input
            type="radio"
            name="FuelType"
            id="Diesel"
            value="Diesel"
            checked={selectedFuelType === "Diesel"}
            onChange={(e) => setSelectedFuelType(e.target.value)}
          />
          <label htmlFor="Diesel">Diesel</label>
        </div>
        <div className="filterBtns">
          <button className="Btn" onClick={handleSearch}>
            Apply Filter
          </button>
          <button className="ClearBtn" onClick={clearFilters}>
            Clear Filter
          </button>
        </div>
      </div>

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
        {carsData.length === 0 ? (
          <div className="Loading">
            <CircularProgress />
          </div>
        ) : (
          currentCars.map((car) => (
            <Car
              key={car._id}
              id={car._id}
              image={car.image}
              title={`${car.brand} ${car.model}`}
              price={`₹ ${car.price}`}
              year={car.year}
              fuelType={car.fuelType}
              mileage={car.mileage}
              description={car.description}
            />
          ))
        )}
      </div>

      <div className="pagination">
        <Pagination
          count={Math.ceil(carsData.length / carsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          size="large"
        />
      </div>
    </>
  );
}

export default Cars;

// ----------------------------------------------------------------
// without apply filters button
// ----------------------------------------------------------------

// Fuel type and select model without appy fileter buttons.

// import React, { useState, useEffect } from "react";
// import {
//   Autocomplete,
//   CircularProgress,
//   TextField,
//   Pagination,
// } from "@mui/material";
// import Car from "./Car";

// function Cars() {
//   const [originalCarsData, setOriginalCarsData] = useState([]);
//   const [carsData, setCarsData] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [models, setModels] = useState([]);
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [selectedFuelType, setSelectedFuelType] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const carsPerPage = 10;

//   // Fetch car data on initial render
//   useEffect(() => {
//     const fetchCarData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/cardata");
//         const data = await response.json();
//         setOriginalCarsData(data);
//         setCarsData(data);

//         const uniqueBrands = Array.from(new Set(data.map((car) => car.brand)));
//         setBrands(uniqueBrands);

//         const uniqueModels = Array.from(new Set(data.map((car) => car.model)));
//         setModels(uniqueModels);
//       } catch (error) {
//         console.error("Error fetching car data:", error);
//       }
//     };
//     fetchCarData();
//   }, []);

//   // Filter models when a brand is selected
//   useEffect(() => {
//     if (selectedBrand) {
//       const filteredModels = originalCarsData
//         .filter((car) => car.brand === selectedBrand)
//         .map((car) => car.model);
//       setModels(Array.from(new Set(filteredModels)));
//     } else {
//       const uniqueModels = Array.from(
//         new Set(originalCarsData.map((car) => car.model))
//       );
//       setModels(uniqueModels);
//     }
//   }, [selectedBrand, originalCarsData]);

//   // Handle search/filter whenever a filter value changes
//   useEffect(() => {
//     const filteredCars = originalCarsData.filter(
//       (car) =>
//         (selectedBrand ? car.brand === selectedBrand : true) &&
//         (selectedModel ? car.model === selectedModel : true) &&
//         (selectedFuelType ? car.fuelType === selectedFuelType : true)
//     );
//     setCarsData(filteredCars);
//     setCurrentPage(1); // Reset to first page after filtering
//   }, [selectedBrand, selectedModel, selectedFuelType, originalCarsData]);

//   // Handle Clear Filter
//   const clearFilters = () => {
//     setSelectedBrand("");
//     setSelectedModel("");
//     setSelectedFuelType("");
//     setCarsData(originalCarsData);
//   };

//   // Pagination Logic
//   const indexOfLastCar = currentPage * carsPerPage;
//   const indexOfFirstCar = indexOfLastCar - carsPerPage;
//   const currentCars = carsData.slice(indexOfFirstCar, indexOfLastCar);

//   const handlePageChange = (event, pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <>
//       <div className="carFirst">
//         <div className="searchCar">
//           <div className="carHeading">
//             <h1>
//               Buying your dream car? <br /> Check Now!
//             </h1>
//           </div>
//           <div className="searchDetail">
//             <Autocomplete
//               isOptionEqualToValue={(option, value) =>
//                 option.value === value.value
//               }
//               disableClearable
//               className="searchTxt"
//               disablePortal
//               options={brands}
//               sx={{ width: 300 }}
//               renderInput={(params) => (
//                 <TextField {...params} label="Select Brand" />
//               )}
//               value={selectedBrand}
//               onChange={(e, newVal) => {
//                 setSelectedBrand(newVal);
//                 setSelectedModel(""); // Reset model when brand changes
//               }}
//             />
//             <Autocomplete
//               isOptionEqualToValue={(option, value) =>
//                 option.value === value.value
//               }
//               disableClearable
//               className="searchTxt"
//               disablePortal
//               options={models}
//               sx={{ width: 300 }}
//               renderInput={(params) => (
//                 <TextField {...params} label="Select Model" />
//               )}
//               value={selectedModel}
//               onChange={(e, newVal) => setSelectedModel(newVal)}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="carsFilter">
//         <div className="FualTypes">
//           Fuel Types:
//           <input
//             type="radio"
//             name="FuelType"
//             id="Electric"
//             value="Electric"
//             checked={selectedFuelType === "Electric"}
//             onChange={(e) => setSelectedFuelType(e.target.value)}
//           />
//           <label htmlFor="EV">EV</label>
//           <br />
//           <input
//             type="radio"
//             name="FuelType"
//             id="Petrol"
//             value="Petrol"
//             checked={selectedFuelType === "Petrol"}
//             onChange={(e) => setSelectedFuelType(e.target.value)}
//           />
//           <label htmlFor="Petrol">Petrol</label>
//           <br />
//           <input
//             type="radio"
//             name="FuelType"
//             id="Diesel"
//             value="Diesel"
//             checked={selectedFuelType === "Diesel"}
//             onChange={(e) => setSelectedFuelType(e.target.value)}
//           />
//           <label htmlFor="Diesel">Diesel</label>
//         </div>
//         <div className="filterBtns">
//           <button className="ClearBtn" onClick={clearFilters}>
//             Clear Filter
//           </button>
//         </div>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           justifyContent: "center",
//           gap: "20px",
//           margin: "20px",
//           padding: "20px",
//           boxSizing: "border-box",
//         }}
//       >
//         {carsData.length === 0 ? (
//           <div className="Loading">
//             <CircularProgress />
//           </div>
//         ) : (
//           currentCars.map((car) => (
//             <Car
//               key={car._id}
//               id={car._id}
//               image={car.image}
//               title={`${car.brand} ${car.model}`}
//               price={`₹ ${car.price}`}
//               year={car.year}
//               fuelType={car.fuelType}
//               mileage={car.mileage}
//               description={car.description}
//             />
//           ))
//         )}
//       </div>

//       <div className="pagination">
//         <Pagination
//           count={Math.ceil(carsData.length / carsPerPage)}
//           page={currentPage}
//           onChange={handlePageChange}
//           size="large"
//         />
//       </div>
//     </>
//   );
// }

// export default Cars;

// import React, { useState, useEffect } from "react";
// import {
//   Autocomplete,
//   CircularProgress,
//   TextField,
//   Pagination,
// } from "@mui/material";
// import Car from "./Car";

// function Cars() {
//   const [originalCarsData, setOriginalCarsData] = useState([]);
//   const [carsData, setCarsData] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [models, setModels] = useState([]);
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [selectedFuelType, setSelectedFuelType] = useState("");
//   const [selectedPriceRange, setSelectedPriceRange] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const carsPerPage = 10;

//   // Function to extract numeric price value from the price string (e.g., "25 Lakhs" -> 2500000)
//   const parsePrice = (priceString) => {
//     const priceParts = priceString.split(" ");
//     const price = parseFloat(priceParts[0]);
//     if (priceParts[1]?.toLowerCase() === "lakh") {
//       return price * 100000; // Convert Lakh to numeric value
//     }
//     if (priceParts[1]?.toLowerCase() === "crore") {
//       return price * 10000000; // Convert Crore to numeric value
//     }
//     return price; // If no Lakh/Crore, return the value as is
//   };

//   // Fetch car data on initial render
//   useEffect(() => {
//     const fetchCarData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/cardata");
//         const data = await response.json();
//         setOriginalCarsData(data);
//         setCarsData(data);

//         const uniqueBrands = Array.from(new Set(data.map((car) => car.brand)));
//         setBrands(uniqueBrands);

//         const uniqueModels = Array.from(new Set(data.map((car) => car.model)));
//         setModels(uniqueModels);
//       } catch (error) {
//         console.error("Error fetching car data:", error);
//       }
//     };
//     fetchCarData();
//   }, []);

//   // Filter models when a brand is selected
//   useEffect(() => {
//     if (selectedBrand) {
//       const filteredModels = originalCarsData
//         .filter((car) => car.brand === selectedBrand)
//         .map((car) => car.model);
//       setModels(Array.from(new Set(filteredModels)));
//     } else {
//       const uniqueModels = Array.from(
//         new Set(originalCarsData.map((car) => car.model))
//       );
//       setModels(uniqueModels);
//     }
//   }, [selectedBrand, originalCarsData]);

//   // Handle search/filter
//   const handleSearch = () => {
//     const filteredCars = originalCarsData.filter((car) => {
//       const carPrice = parsePrice(car.price);
      
//       // Price range filter logic
//       let priceInRange = true;
//       if (selectedPriceRange) {
//         const [minPrice, maxPrice] = selectedPriceRange.split("-").map(Number);
//         priceInRange =
//           carPrice >= minPrice && (maxPrice ? carPrice <= maxPrice : true);
//       }

//       return (
//         priceInRange &&
//         (selectedBrand ? car.brand === selectedBrand : true) &&
//         (selectedModel ? car.model === selectedModel : true) &&
//         (selectedFuelType ? car.fuelType === selectedFuelType : true)
//       );
//     });

//     setCarsData(filteredCars);
//     setCurrentPage(1); // Reset to first page after filtering
//   };

//   // Handle Clear Filter
//   const clearFilters = () => {
//     setSelectedBrand("");
//     setSelectedModel("");
//     setSelectedFuelType("");
//     setSelectedPriceRange("");
//     setCarsData(originalCarsData);
//   };

//   // Pagination Logic
//   const indexOfLastCar = currentPage * carsPerPage;
//   const indexOfFirstCar = indexOfLastCar - carsPerPage;
//   const currentCars = carsData.slice(indexOfFirstCar, indexOfLastCar);

//   const handlePageChange = (event, pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <>
//       <div className="carFirst">
//         <div className="searchCar">
//           <div className="carHeading">
//             <h1>
//               Buying your dream car? <br /> Check Now!
//             </h1>
//           </div>
//           <div className="searchDetail">
//             <Autocomplete
//               isOptionEqualToValue={(option, value) =>
//                 option.value === value.value
//               }
//               disableClearable
//               className="searchTxt"
//               disablePortal
//               options={brands}
//               sx={{ width: 300 }}
//               renderInput={(params) => (
//                 <TextField {...params} label="Select Brand" />
//               )}
//               value={selectedBrand}
//               onChange={(e, newVal) => {
//                 setSelectedBrand(newVal);
//                 setSelectedModel("");
//               }}
//             />
//             <Autocomplete
//               isOptionEqualToValue={(option, value) =>
//                 option.value === value.value
//               }
//               disableClearable
//               className="searchTxt"
//               disablePortal
//               options={models}
//               sx={{ width: 300 }}
//               renderInput={(params) => (
//                 <TextField {...params} label="Select Model" />
//               )}
//               value={selectedModel}
//               onChange={(e, newVal) => setSelectedModel(newVal)}
//             />
//             <button className="Btn" onClick={handleSearch}>
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="carsFilter">
//         <div className="byPrice">
//           <select
//             className="selectionList"
//             value={selectedPriceRange}
//             onChange={(e) => setSelectedPriceRange(e.target.value)}
//           >
//             <option hidden>Select Price Range</option>
//             <option value="100000-500000">1 Lakh to 5 Lakh</option>
//             <option value="500000-1000000">5 Lakh to 10 Lakh</option>
//             <option value="1000000-1500000">10 Lakh to 15 Lakh</option>
//             <option value="1500000-2000000">15 Lakh to 20 Lakh</option>
//             <option value="2000000-2500000">20 Lakh to 25 Lakh</option>
//             <option value="2500000-10000000">Above 25 Lakh</option>
//           </select>
//         </div>

//         <div className="FualTypes">
//           Fuel Types:
//           <input
//             type="radio"
//             name="FuelType"
//             id="Electric"
//             value="Electric"
//             checked={selectedFuelType === "Electric"}
//             onChange={(e) => setSelectedFuelType(e.target.value)}
//           />
//           <label htmlFor="EV">EV</label>
//           <br />
//           <input
//             type="radio"
//             name="FuelType"
//             id="Petrol"
//             value="Petrol"
//             checked={selectedFuelType === "Petrol"}
//             onChange={(e) => setSelectedFuelType(e.target.value)}
//           />
//           <label htmlFor="Petrol">Petrol</label>
//           <br />
//           <input
//             type="radio"
//             name="FuelType"
//             id="Diesel"
//             value="Diesel"
//             checked={selectedFuelType === "Diesel"}
//             onChange={(e) => setSelectedFuelType(e.target.value)}
//           />
//           <label htmlFor="Diesel">Diesel</label>
//         </div>
//         <div className="filterBtns">
//           <button className="Btn" onClick={handleSearch}>
//             Apply Filter
//           </button>
//           <button className="ClearBtn" onClick={clearFilters}>
//             Clear Filter
//           </button>
//         </div>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           justifyContent: "center",
//           gap: "20px",
//           margin: "20px",
//           padding: "20px",
//           boxSizing: "border-box",
//         }}
//       >
//         {carsData.length === 0 ? (
//           <div className="Loading">
//             <CircularProgress />
//           </div>
//         ) : (
//           currentCars.map((car) => (
//             <Car
//               key={car._id}
//               id={car._id}
//               image={car.image}
//               title={`${car.brand} ${car.model}`}
//               price={`₹ ${car.price}`}
//               year={car.year}
//               fuelType={car.fuelType}
//               mileage={car.mileage}
//               description={car.description}
//             />
//           ))
//         )}
//       </div>

//       <div className="pagination">
//         <Pagination
//           count={Math.ceil(carsData.length / carsPerPage)}
//           page={currentPage}
//           onChange={handlePageChange}
//           size="large"
//         />
//       </div>
//     </>
//   );
// }

// export default Cars;


//----
//compare car
//---------------
// import React, { useState, useEffect } from "react";
// import {
//   Autocomplete,
//   CircularProgress,
//   TextField,
//   Pagination,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom"; // For navigation
// import Car from "./Car";

// function Cars() {
//   const [originalCarsData, setOriginalCarsData] = useState([]);
//   const [carsData, setCarsData] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [models, setModels] = useState([]);
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [selectedFuelType, setSelectedFuelType] = useState("");
//   const [selectedCar1, setSelectedCar1] = useState(null); // Selected car for comparison
//   const [selectedCar2, setSelectedCar2] = useState(null); // Selected car for comparison
//   const [currentPage, setCurrentPage] = useState(1);
//   const carsPerPage = 10;
//   const navigate = useNavigate(); // To navigate to the comparison page

//   // Fetch car data on initial render
//   useEffect(() => {
//     const fetchCarData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/cardata");
//         const data = await response.json();
//         setOriginalCarsData(data);
//         setCarsData(data);

//         const uniqueBrands = Array.from(new Set(data.map((car) => car.brand)));
//         setBrands(uniqueBrands);

//         const uniqueModels = Array.from(new Set(data.map((car) => car.model)));
//         setModels(uniqueModels);
//       } catch (error) {
//         console.error("Error fetching car data:", error);
//       }
//     };
//     fetchCarData();
//   }, []);

//   // Filter models when a brand is selected
//   useEffect(() => {
//     if (selectedBrand) {
//       const filteredModels = originalCarsData
//         .filter((car) => car.brand === selectedBrand)
//         .map((car) => car.model);
//       setModels(Array.from(new Set(filteredModels)));
//     } else {
//       const uniqueModels = Array.from(
//         new Set(originalCarsData.map((car) => car.model))
//       );
//       setModels(uniqueModels);
//     }
//   }, [selectedBrand, originalCarsData]);

//   // Handle search/filter
//   const handleSearch = () => {
//     const filteredCars = originalCarsData.filter(
//       (car) =>
//         (selectedBrand ? car.brand === selectedBrand : true) &&
//         (selectedModel ? car.model === selectedModel : true) &&
//         (selectedFuelType ? car.fuelType === selectedFuelType : true)
//     );
//     setCarsData(filteredCars);
//     setCurrentPage(1); // Reset to first page after filtering
//   };

//   // Handle Clear Filter
//   const clearFilters = () => {
//     setSelectedBrand("");
//     setSelectedModel("");
//     setSelectedFuelType("");
//     setCarsData(originalCarsData);
//   };

//   // Pagination Logic
//   const indexOfLastCar = currentPage * carsPerPage;
//   const indexOfFirstCar = indexOfLastCar - carsPerPage;
//   const currentCars = carsData.slice(indexOfFirstCar, indexOfLastCar);

//   const handlePageChange = (event, pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Handle comparison
//   const handleCompare = () => {
//     if (selectedCar1 && selectedCar2) {
//       navigate(`/carinfo/${selectedCar1._id}/${selectedCar2._id}`);
//     } else {
//       alert("Please select two cars to compare");
//     }
//   };

//   return (
//     <>
//       <div className="carFirst">
//         <div className="searchCar">
//           <div className="carHeading">
//             <h1>
//               Buying your dream car? <br /> Check Now!
//             </h1>
//           </div>
//           <div className="searchDetail">
//             <Autocomplete
//               isOptionEqualToValue={(option, value) =>
//                 option.value === value.value
//               }
//               disableClearable
//               className="searchTxt"
//               disablePortal
//               options={brands}
//               sx={{ width: 300 }}
//               renderInput={(params) => (
//                 <TextField {...params} label="Select Brand" />
//               )}
//               value={selectedBrand}
//               onChange={(e, newVal) => {
//                 setSelectedBrand(newVal);
//                 setSelectedModel("");
//               }}
//             />
//             <Autocomplete
//               isOptionEqualToValue={(option, value) =>
//                 option.value === value.value
//               }
//               disableClearable
//               className="searchTxt"
//               disablePortal
//               options={models}
//               sx={{ width: 300 }}
//               renderInput={(params) => (
//                 <TextField {...params} label="Select Model" />
//               )}
//               value={selectedModel}
//               onChange={(e, newVal) => setSelectedModel(newVal)}
//             />
//             <button className="Btn" onClick={handleSearch}>
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Comparison selectors */}
//       <div className="carComparison">
//         <h3>Select two cars to compare:</h3>
//         <div>
//           <Autocomplete
//             options={carsData}
//             getOptionLabel={(car) => `${car.brand} ${car.model}`}
//             onChange={(e, newVal) => setSelectedCar1(newVal)}
//             renderInput={(params) => (
//               <TextField {...params} label="Select Car 1" />
//             )}
//           />
//           <Autocomplete
//             options={carsData}
//             getOptionLabel={(car) => `${car.brand} ${car.model}`}
//             onChange={(e, newVal) => setSelectedCar2(newVal)}
//             renderInput={(params) => (
//               <TextField {...params} label="Select Car 2" />
//             )}
//           />
//         </div>
//         <button className="Btn" onClick={handleCompare}>
//           Compare Cars
//         </button>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           justifyContent: "center",
//           gap: "20px",
//           margin: "20px",
//           padding: "20px",
//           boxSizing: "border-box",
//         }}
//       >
//         {carsData.length === 0 ? (
//           <div className="Loading">
//             <CircularProgress />
//           </div>
//         ) : (
//           currentCars.map((car) => (
//             <Car
//               key={car._id}
//               id={car._id}
//               image={car.image}
//               title={`${car.brand} ${car.model}`}
//               price={`₹ ${car.price}`}
//               year={car.year}
//               fuelType={car.fuelType}
//               mileage={car.mileage}
//               description={car.description}
//             />
//           ))
//         )}
//       </div>

//       <div className="pagination">
//         <Pagination
//           count={Math.ceil(carsData.length / carsPerPage)}
//           page={currentPage}
//           onChange={handlePageChange}
//           size="large"
//         />
//       </div>
//     </>
//   );
// }

// export default Cars;
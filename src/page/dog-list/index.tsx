import { useEffect, useState } from "react";
import { useFetch } from "utility/hooks/apiHooks/useFetch";

const DogList = () => {
  const {getDogsBreed, dogsBreedData,
    getDogsSreach, dogsSreachData,
    getDogs, dogsData,
    getDogsMatch,
    loadingAll
  } = useFetch()
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [matchedDog, setMatchedDog] = useState(null);
  const [page, setPage] = useState(0);
  const [totalDogs, setTotalDogs] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [actionType, setActionType] = useState("regular");
  const pageSize = 12;

  useEffect(() => {
    getDogsBreed();
    fetchDogs();
  }, [selectedBreed, page, sortOrder]);

  useEffect(() => {
    if(dogsBreedData) {
      setBreeds(dogsBreedData.data);
    }
  }, [dogsBreedData])

  const fetchDogs = async () => {
    const params:any = {
      size: pageSize,
      from: page * pageSize,
      sort: `name:${sortOrder}`,
    }
    if (selectedBreed) {
      params.breeds = [selectedBreed];
    }

    setActionType("regular")
    setMatchedDog(null)
    getDogsSreach(params, response => {
      if(response.status === 200) {
        getDogs(response.data.resultIds)
      }
    })
  };

  useEffect(() => {
    if(dogsData) {
      if(actionType === "regular") {
        setDogs(dogsData.data)
        setTotalDogs(dogsSreachData.data.total)
      } else {
        setMatchedDog(dogsData.data[0])
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }, 500);
      }
    }
  }, [dogsData])

  const handleFavorite = (dogId) => {
    setFavorites((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const findMatch = async () => {
    if (favorites.length === 0) {
      alert("Please add at least one favorite dog!");
      return;
    }

    getDogsMatch(favorites, response => {
      if(response.status === 200) {
        setActionType("match")
        getDogs([response.data.match])
      }
    })
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🐶 Dog Adoption List</h1>

      {/* Sorting & Filtering */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="mb-2 md:mb-0">
          <label className="block font-medium">Filter by Breed:</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
          >
            <option value="">All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={toggleSortOrder}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
        >
          Sort: {sortOrder === "asc" ? "Ascending 🔼" : "Descending 🔽"}
        </button>
      </div>

      {/* Dog List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dogs.map((dog) => (
          <div key={dog.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={dog.img} alt={dog.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{dog.name}</h2>
              <p className="text-sm text-gray-600">Breed: {dog.breed}</p>
              <p className="text-sm text-gray-600">Age: {dog.age} years</p>
              <p className="text-sm text-gray-600">Zip Code: {dog.zip_code}</p>
              <button
                className={`mt-3 w-full px-4 py-2 rounded-md ${
                  favorites.includes(dog.id)
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
                onClick={() => handleFavorite(dog.id)}
              >
                {favorites.includes(dog.id) ? "❤️ Favorited" : "🤍 Add to Favorites"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Match Button */}
      <div className="sticky bottom-0 py-4 flex justify-center">
        <button
          onClick={findMatch}
          className="px-6 py-3 bg-green-500 shadow-lg text-white rounded-lg text-lg hover:bg-green-700 transition disabled:bg-gray-300"
          disabled={favorites.length <= 1}
        >
          🔥 Find Your Best Match
        </button>
      </div>

      {/* Display Matched Dog */}
      {matchedDog && (
        <div className="mt-8 p-6 bg-yellow-100 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold">🎉 Your Perfect Match 🎉</h2>
          <img src={matchedDog.img} alt={matchedDog.name} className="w-64 mx-auto rounded-md my-4" />
          <h3 className="text-xl font-semibold">{matchedDog.name}</h3>
          <p className="text-md text-gray-700">Breed: {matchedDog.breed}</p>
          <p className="text-md text-gray-700">Age: {matchedDog.age} years</p>
          <p className="text-md text-gray-700">Zip Code: {matchedDog.zip_code}</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          ⬅️ Previous
        </button>
        <span className="text-lg">Page {page + 1} / {Math.ceil(totalDogs / pageSize)}</span>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
          disabled={(page + 1) * pageSize >= totalDogs}
          onClick={() => setPage(page + 1)}
        >
          Next ➡️
        </button>
      </div>

      {/* Loading Overlay */}
      {loadingAll && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
            <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DogList;

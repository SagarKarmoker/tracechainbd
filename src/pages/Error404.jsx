import React from "react";

function Error404() {
  const goBack = () => { 
    window.history.back();
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600 mb-8">Oops! The page you're looking for could not be found.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={
            goBack
          }>
            Go Back
          </button>
        </div>
      </div>
    </>
  );
}

export default Error404;

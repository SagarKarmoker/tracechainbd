import React from 'react'

function UpdateProductPrice() {
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState('')

  const handleUpdateProduct = () => {

  }

  return (
    <>
      <div className='flex justify-center'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-4xl font-bold mb-5'>Update Product Price by Importer</h1>
          <input type="number" className='p-2 border rounded-lg' placeholder='Enter Product Id' value={productId} onChange={(e) => setProductId(e.target.value)} />

          <input type="number" className='p-2 border rounded-lg' placeholder='Enter updated price' value={price} onChange={(e) => setPrice(e.target.value)} />

          <div className='flex justify-center'>
            <button className='bg-blue-600 p-4 text-white rounded-xl w-[300px] font-bold' onClick={handleUpdateProduct}>Update Price</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateProductPrice
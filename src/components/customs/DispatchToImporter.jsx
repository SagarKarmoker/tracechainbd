import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'

// customs -> importer dispatch feature
function DispatchToImporter() {
  const toast = useToast();
  const [productId, setProductId] = useState("")
  const [isHidden, setIsHidden] = useState(true)
  const [hideGetBtn, setHideGetBtn] = useState(false)

  const handleDetails = () => {
    if (productId != '') {
      console.log("get from blockchain")
      setIsHidden(false)
      setHideGetBtn(true)
      setProductId('')
    } else {
      // show waring toast
      toast({

      })
    }
  }

  const handleDispatch = () =>{
    console.log("dispatch product")
  }

  return (
    <>
      <div>
        <h1 className='text-center font-bold text-4xl'>Customs Dispatch Dashbord</h1>
        <div className='flex justify-center mt-10'>
          <div className='flex flex-col gap-4 w-96'>
            <input type="number" className='p-3 border rounded-lg' placeholder='Enter product ID to get details' value={productId} onChange={(e) => setProductId(e.target.value)} required />

            {
              !hideGetBtn && <button onClick={handleDetails} className='bg-blue-600 p-3 text-white font-bold rounded-xl'>Get Details</button>
            }
          </div>
        </div>
        {/* hidden util get details */}
        <div className='flex justify-center mt-5'>
          {/* details of product got from blockchain */}
          {!isHidden ?
            <div className='flex flex-col'>
              <table className='border text-center p-2'>
                <thead>
                  <th>Product</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>ID</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>Dove</td>
                  </tr>
                  <tr>
                    <td>Desc</td>
                    <td>Body Soap</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>Toilaties</td>
                  </tr>
                  <tr>
                    <td>Country of Origin</td>
                    <td>INDIA (IN)</td>
                  </tr>
                  <tr>
                    <td>Manufacturer</td>
                    <td>Uniliver</td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td>100</td>
                  </tr>
                  <tr>
                    <td>Quantity</td>
                    <td>100</td>
                  </tr>
                  <tr>
                    <td>Imported Date</td>
                    <td>20/07/2024</td>
                  </tr>
                  <tr>
                    <td>Imported Date</td>
                    <td>20/07/2024</td>
                  </tr>
                  <tr>
                    <td>Imported Address</td>
                    <td>0x.......24</td>
                  </tr>
                  <tr>
                    <td>Customs Address</td>
                    <td>0x.......51</td>
                  </tr>
                </tbody>
              </table>

              <div className='mt-5'>
                <button onClick={handleDispatch} className='bg-blue-600 p-3 text-white font-bold rounded-xl'>Dispatch Product to Importer</button>
              </div>
            </div>
            :
            <p>
              
            </p>
          }

        </div>
      </div >
    </>
  )
}

export default DispatchToImporter
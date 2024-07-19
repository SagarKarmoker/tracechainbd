import { Divider, IconButton } from '@chakra-ui/react'
import { BsBack } from 'react-icons/bs'

function AcceptedApplications() {
  return (
    <>
      <div className='px-10 py-5'>
        <div className='flex justify-between'>
          <IconButton icon={<BsBack />} />
          <h1 className='text-center font-bold text-4xl'>Accepted Applications</h1>
          <p></p>
        </div>
        <Divider className='mt-5' />
        <div className='mt-5 border'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti dolores officia reprehenderit maxime id praesentium impedit dignissimos, beatae perspiciatis fuga corrupti ut quis nesciunt mollitia. Nemo quos dicta commodi in?
        </div>
      </div>
    </>
  )
}

export default AcceptedApplications
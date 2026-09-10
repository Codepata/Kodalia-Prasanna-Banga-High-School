import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import NotFoundPage from "../../public/404-error-page-with-cat.json"

export default function App() { 
  return (
    <div className='relative w-full h-screen overflow-hidden flex  items-center justify-center'>

        <DotLottieReact
          data={NotFoundPage}
          loop
          autoplay
          className=' object-cover object-center mx-8 block sm:p-10'
        />

    </div>
  );
}

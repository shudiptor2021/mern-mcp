'use client'
import ChatBox from './ChatBox';
import ProfileBox from './ProfileBox'
import { useAuthStore } from '@/store/authStore'

const HomePage = () => {
  const userInfo = useAuthStore((state) => state.user);
  // console.log(userInfo);
  return (
    <div className="flex flex-col h-screen w-full overflow-y-auto ">
      <div className="p-4 shadow sticky top-0 w-full flex justify-between items-center bg-white z-10">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        {userInfo && (
          <ProfileBox userInfo={{ ...userInfo, picture: userInfo.picture ?? '' }} />
        )}
        {/* <ProfileBox /> */}
      </div>
      <div className="w-full flex justify-center">
       {/* <ChatBox userId={userId} accessToken={accessToken}/> */}
       {userInfo && (
         <ChatBox userInfo={{ ...userInfo, picture: userInfo.picture ?? '' }} />
       )}
       </div>
    </div>
  )
}  

export default HomePage

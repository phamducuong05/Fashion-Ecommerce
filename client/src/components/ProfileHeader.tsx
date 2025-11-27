import { ImageWithFallback } from "./imagefallback";
import { Edit } from "lucide-react";

export function ProfileHeader() {
  const user = {
    name: "Emma Richardson",
    email: "emma.richardson@email.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    memberSince: "March 2023",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative">
          <ImageWithFallback
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">{user.name}</h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <p className="text-gray-500 text-sm mt-1">
                Member since {user.memberSince}
              </p>
            </div>

            <button className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors self-start sm:self-auto">
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

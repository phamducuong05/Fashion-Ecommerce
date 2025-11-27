import { ProfileHeader } from "../components/ProfileHeader";
import { AddressBook } from "../components/AddressBook";
import { PaymentMethods } from "../components/PaymentMethod";
import { OrderHistory } from "../components/OrderHistory";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <ProfileHeader />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AddressBook />
            <PaymentMethods />
          </div>

          <OrderHistory />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

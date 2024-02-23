import { UserDetail, UserDetailContainer } from "@components/staff/UserDetail";
import Button from "@components/atom/Button";
import UserImage from "@components/staff/download (1).jpeg";
import UserBanner from "../staff/UserBanner";
import { User } from "@/interface/user";
import { DateTime } from "luxon";

interface Props {
  data: User & {
    approvedPosts: number;
    cancelledPosts: number;
    totalPosts: number;
    planDuration: string;
    planName: string;
    managerName: string;
  };
}
const ProtectedSellerProfile = (props: Props) => {
  const planDuration = () => {
    // if(!props.data?.planDuration) return "No duration";
    if (Number(props.data?.planDuration) === 1) {
      return props.data?.planDuration + " month";
    }
    return props.data?.planDuration + " months";
  };

  const subDate = (date: string) => {
    return DateTime.fromISO(date).toFormat("dd LLL, yyyy");
  };

  return (
    <div className="sl:flex sl:gap-8">
      <div className="sl:basis-[70%]">
        <UserBanner
          name={props.data?.name || "No name"}
          imgSrc={props.data?.avatar || UserImage}
          btnText="Send Message to seller"
        />

        <UserDetailContainer heading="About">
          <div className="">
            <UserDetail
              hasGreyTitle
              title="Email"
              description={props.data?.email || "No email"}
            />
            <UserDetail hasGreyTitle title="Location" description="Lagos" />
            <UserDetail
              hasGreyTitle
              title="Phone"
              description={props.data?.phoneNumber || "No Phone number"}
            />
            <UserDetail
              hasGreyTitle
              title="Manager"
              description={props?.data?.managerName || "No manager"}
            />
          </div>
        </UserDetailContainer>

        <UserDetailContainer heading="Bio">
          <p className="font-normal text-grey6">
            {props.data?.aboutBusiness || "No bio"}
          </p>
        </UserDetailContainer>

        <UserDetailContainer heading="Address">
          <p className="font-normal text-grey6">
            {props.data?.address || "No address"}
          </p>
        </UserDetailContainer>
      </div>

      <div className="sl:basis-[30%]">
        <UserDetailContainer heading="Posts">
          <UserDetail
            hasGreyDescription
            title={Number(props.data?.approvedPosts)?.toLocaleString() || "0"}
            description="Approved post"
          />
          <UserDetail
            hasGreyDescription
            title={Number(props.data?.cancelledPosts)?.toLocaleString() || "0"}
            description="Cancelled post"
          />
          <UserDetail
            hasGreyDescription
            title={Number(props.data?.totalPosts)?.toLocaleString() || "0"}
            description="Total post"
          />
        </UserDetailContainer>

        <UserDetailContainer heading="Subscription">
          <UserDetail hasGreyDescription title="Premium" description="Plan" />
          <UserDetail
            hasGreyDescription
            title={planDuration() || "No duration"}
            description="Duration"
          />
          <UserDetail
            hasGreyDescription
            title={subDate(props?.data?.subscriptionPaidAt || "") || "-"}
            description="Activated date"
          />
          <UserDetail
            hasGreyDescription
            title={subDate(props.data?.subscriptionExpiryDate || "") || "-"}
            description="Expiry date"
          />
        </UserDetailContainer>

        <div className="mb-6 rounded-xl border border-grey2 p-6">
          <Button format="primary" className="mb-8 block w-full">
            Change Manager
          </Button>
          <Button format="secondary" className="mb-8 block w-full">
            Activate Subscription
          </Button>
          <Button format="secondary" className="mb-8 block w-full">
            Upload Product
          </Button>
          <Button format="secondary" className="mb-8 block w-full">
            Block User
          </Button>
          <Button format="danger" className="mb-8 block w-full">
            Delete Seller
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedSellerProfile;

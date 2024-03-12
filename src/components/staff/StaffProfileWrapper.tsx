import React from "react";
import UserBanner from "@components/staff/UserBanner";
import { UserDetail, UserDetailContainer } from "@components/staff/UserDetail";
import { getStaffApi } from "@/api/staff";
import StaffBtnActions from "@components/staff/StaffBtnActions";
import { staffPerformance } from "@/api/staff";
import Grades from "@components/staff/Grades";
import Bonuses from "@components/staff/Bonuses";
import StaffTopCards from "./StaffTopCards";

interface Props {
  staffId: string;
}

const StaffProfileWrapper = async ({ staffId }: Props) => {
  const staffResponse = await getStaffApi({ staffId });
  const staffPerf = await staffPerformance({ staffId });

  console.log('staffResponse', staffResponse)
  console.log('staffPerf', staffPerf)

  return (
    <div className="">
      <div className="max-sm:gap-8 sm:grid sm:grid-cols-3 sm:gap-2 sl:gap-8">
        <div className="col-span-2">
          <UserBanner
            imgSrc={staffResponse?.data?.avatar}
            btnText="Send Message"
            name={staffResponse?.data?.name}
            role={staffResponse?.data?.role}
          />

          <UserDetailContainer heading="About">
            <div className="sm:flex sm:items-center sm:justify-between">
              <UserDetail
                hasGreyTitle
                title="Email"
                description={staffResponse?.data?.email}
              />
              <UserDetail
                hasGreyTitle
                title="Sellers"
                description={
                  staffResponse?.totalSellers?.toLocaleString() || "O"
                }
              />
              <UserDetail
                hasGreyTitle
                title="Phone"
                description={
                  staffResponse?.data?.phoneNumber || "No Phone number"
                }
              />
              <UserDetail
                hasGreyTitle
                title="Admin"
                description={staffResponse?.admin?.name || "No Admin"}
              />
            </div>
          </UserDetailContainer>

          <UserDetailContainer heading="Address">
            <p className="font-normal text-grey6">
              {staffResponse?.data?.address || "No address"}
            </p>
          </UserDetailContainer>
        </div>
        <div className="col-span-1 mb-10 text-xl ">
          <UserDetailContainer
            heading="Bank account details"
            wrapperClass="p-6 tablet:p-3 sl:p-6"
          >
            <UserDetail
              hasGreyDescription
              title="Account number"
              description={
                staffResponse?.data?.bankAccount?.accountNumber || ""
              }
            />
            <UserDetail
              hasGreyDescription
              title="Bank name"
              description={staffResponse?.data?.bankAccount?.bankName || ""}
            />
            <UserDetail
              hasGreyDescription
              title="Account name"
              description={staffResponse?.data?.bankAccount?.accountName || ""}
            />
          </UserDetailContainer>
          <StaffBtnActions
            staffId={staffId}
            staffName={staffResponse?.data?.name}
          />
        </div>
      </div>
      <div>
        <h2 className="mb-6 font-semibold">Staff KPI</h2>
        <StaffTopCards data={staffPerf?.data} />
      </div>
      <div className="gap-3 xms:flex sm:block">
        <Grades
          wrapperClass="basis-[50%]"
          grades={staffPerf?.grades}
          sales={staffPerf?.data?.amount}
          gradePay={JSON.parse(staffPerf?.data?.gradeInformation)}
        />
        <Bonuses wrapperClass="basis-[50%]" bonuses={staffPerf?.bonuses} />
      </div>
    </div>
  );
};

export default StaffProfileWrapper;

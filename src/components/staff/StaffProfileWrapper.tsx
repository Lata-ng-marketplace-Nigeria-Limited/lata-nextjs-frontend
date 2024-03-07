import React from "react";
import UserBanner from "@components/staff/UserBanner";
import { UserDetail, UserDetailContainer } from "@components/staff/UserDetail";
import AnalyticsTopCardsHOC from "@components//analytics/AnalyticsTopCardsHOC";
import AnalyticsTopCards from "@components/analytics/AnalyticsTopCards";
import { getStaffApi } from "@/api/staff";
import StaffBtnActions from "@components/staff/StaffBtnActions";
import { monthlySales } from "@/api/grade";
import Grades from "@components/staff/Grades";
import Bonuses from "@components/staff/Bonuses";

interface Props {
  staffId: string;
}
const StaffProfileWrapper = async ({ staffId }: Props) => {
  const staffResponse = await getStaffApi({ staffId });
  const data = await monthlySales({ staffId });

  return (
    <div>
      <div className="sm:flex sm:gap-8">
        <div className="sm:basis-[70%]">
          <UserBanner
            imgSrc={staffResponse?.data?.avatar}
            btnText="Send Message"
            name={staffResponse?.data?.name}
            role={staffResponse?.data?.role}
          />

          <UserDetailContainer heading="About">
            <div className="sm:flex sm:items-center sm:gap-20">
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
        <div className="mb-10 text-xl sm:basis-[30%]">
          <UserDetailContainer heading="Bank account details">
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
        <AnalyticsTopCardsHOC>
          <AnalyticsTopCards
            isTotalViews
            title="Commission"
            description="20% of your total sales"
            isClickable
            number={"0"}
          />
          <AnalyticsTopCards
            title="Allowance"
            description="#5K for every three sales and above"
            isClickable
            number={"0"}
          />
          <AnalyticsTopCards
            title="Grade pay"
            description="Salary pay for meeting your grade point"
            isClickable
            number={"0"}
          />
          <AnalyticsTopCards
            title="Total sales"
            description="Total sales for the month of August"
            isClickable
            number={"0"}
          />
        </AnalyticsTopCardsHOC>
      </div>
      <Grades grades={data?.grades} sales={data?.monthlySales} />
      <Bonuses />
    </div>
  );
};

export default StaffProfileWrapper;

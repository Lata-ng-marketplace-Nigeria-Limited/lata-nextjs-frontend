import React from "react";
import UserBanner from "@components/staff/UserBanner";
import { UserDetail, UserDetailContainer } from "@components/staff/UserDetail";
import AnalyticsTopCardsHOC from "@components//analytics/AnalyticsTopCardsHOC";
import AnalyticsTopCards from "@components/analytics/AnalyticsTopCards";
import CheckBoxPurple from "@components/atom/icons/CheckBoxPurple";
import { getStaffApi } from "@/api/staff";
import StaffBtnActions from "@components/staff/StaffBtnActions";

interface Props {
  staffId: string;
}
const StaffProfileWrapper = async ({ staffId }: Props) => {
  const staffResponse = await getStaffApi({ staffId });

  const grades = [
    { grade: "Grade A", price: "500k" },
    { grade: "Grade B", price: "399k" },
    { grade: "Grade C", price: "250k" },
    { grade: "Grade D", price: "100k" },
    { grade: "Grade E", price: "50k" },
  ];

  const bonuses = [
    { interval: "Week", period: 1, amount: 1000 },
    { interval: "Week", period: 2, amount: 1000 },
    { interval: "Week", period: 3, amount: 1000 },
    { interval: "Year", period: 4, amount: 1000 },
  ];

  return (
    <div>
      <div className="sm:flex sm:gap-8">
        <div className="sm:basis-[70%]">
          <UserBanner
            imgSrc={staffResponse?.data?.avatar}
            btnText="Send Message"
            name={staffResponse?.data?.name}
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
      <UserDetailContainer heading="Grades">
        <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-4 lg:grid-cols-5 lg:gap-1">
          {grades?.map((grade, index) => (
            <div className="flex items-center gap-3" key={index}>
              <CheckBoxPurple />
              <p className="text-lg font-normal">
                Grade {grade?.grade}, {grade?.price}
              </p>
            </div>
          ))}
        </div>
      </UserDetailContainer>
      <UserDetailContainer heading="Grades">
        <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-4">
          {bonuses.map((bonus, index) => (
            <p className="text-lg font-normal" key={index}>
              {bonus.interval} {bonus.period} bonus = {bonus.amount}
            </p>
          ))}
        </div>
      </UserDetailContainer>
    </div>
  );
};

export default StaffProfileWrapper;

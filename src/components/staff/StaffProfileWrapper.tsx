import React from "react";
import UserBanner from "@components/staff/UserBanner";
import { UserDetail, UserDetailContainer } from "@components/staff/UserDetail";
import AnalyticsTopCardsHOC from "@components//analytics/AnalyticsTopCardsHOC";
import AnalyticsTopCards from "@components/analytics/AnalyticsTopCards";
import CheckBoxPurple from "@components/atom/icons/CheckBoxPurple";
import { getStaffApi } from "@/api/staff";
import StaffBtnActions from "@components/staff/StaffBtnActions";
import { User } from "@/interface/user";

interface Props {
  staffId: string;
  data: User;
  totalSellers?: number;
}
const StaffProfileWrapper = async ({ staffId, data, totalSellers }: Props) => {
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
            imgSrc={data?.avatar}
            btnText="Send Message"
            name={data?.name}
          />

          <UserDetailContainer heading="About">
            <div className="sm:flex sm:items-center sm:gap-20">
              <UserDetail
                hasGreyTitle
                title="Email"
                description={data?.email}
              />
              <UserDetail
                hasGreyTitle
                title="Sellers"
                description={totalSellers?.toLocaleString() || "O"}
              />
              <UserDetail
                hasGreyTitle
                title="Phone"
                description={data?.phoneNumber || "No Phone number"}
              />
              <UserDetail
                hasGreyTitle
                title="Admin"
                description={data?.meta?.manager?.name || "No Admin"}
              />
            </div>
          </UserDetailContainer>

          <UserDetailContainer heading="Address">
            <p className="font-normal text-grey6">
              {data?.address || "No address"}
            </p>
          </UserDetailContainer>
        </div>
        <div className="mb-10 text-xl sm:basis-[30%]">
          <UserDetailContainer heading="Bank account details">
            <UserDetail
              hasGreyDescription
              title="Account number"
              description={data?.bankAccount?.accountNumber || ""}
            />
            <UserDetail
              hasGreyDescription
              title="First Bank"
              description={data?.bankAccount?.accountNumber || ""}
            />
            <UserDetail
              hasGreyDescription
              title="Account name"
              description={data?.bankAccount?.accountName || ""}
            />
          </UserDetailContainer>
          <StaffBtnActions staffId={staffId} staffName={data?.name} />
        </div>
      </div>
      <div>
        <h2 className="mb-6 font-semibold">Staff KPI</h2>
        <AnalyticsTopCardsHOC>
          <AnalyticsTopCards
            isTotalViews
            title="Commission"
            description="25% of your total sales"
            isClickable
            number={"25,000"}
          />
          <AnalyticsTopCards
            title="Allowance"
            description="#5K for every two sales and above"
            isClickable
            number={"#5,000"}
          />
          <AnalyticsTopCards
            title="Grade pay"
            description="Salary pay for meeting your grade point"
            isClickable
            number={"#100,000"}
          />
          <AnalyticsTopCards
            title="Total sales"
            description="Total sales for the month of August"
            isClickable
            number={"#120k"}
          />
        </AnalyticsTopCardsHOC>
      </div>
      <UserDetailContainer heading="Grades">
        <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-4 lg:grid-cols-5 lg:gap-1">
          {grades.map(({ grade, price }, index) => (
            <div className="flex items-center gap-3" key={index}>
              <CheckBoxPurple />
              <p className="text-lg font-normal">
                {grade}, {price}
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

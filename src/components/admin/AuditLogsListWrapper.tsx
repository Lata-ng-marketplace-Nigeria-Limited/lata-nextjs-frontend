import { getAdminAuditLogsApi } from "@/api/audit";
import { AuditLogsList } from "./AuditLogsList";

interface Props {
  page: string;
  search: string;
  tab: string;
  activityType: string;
}

export const AuditLogsListWrapper = async ({ search, page, tab, activityType }: Props) => {
  const auditLogsData = await getAdminAuditLogsApi({
    page,
    search,
    tab,
    activityType,
  });

  return (
    <AuditLogsList
      auditLogs={auditLogsData?.data || []}
      meta={auditLogsData?.meta}
      stats={auditLogsData?.stats || { total: 0, admin: 0, staff: 0 }}
      page={page}
      urlSearch={search}
      urlActivityType={activityType}
    />
  );
};

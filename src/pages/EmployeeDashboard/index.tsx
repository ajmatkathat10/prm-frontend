import { Link } from 'react-router-dom';
import { STRINGS } from '@/constants/strings';
import { useGetMyResourceQuery } from '@/store/services/resourceApiSlice';
import { useGetTimesheetsQuery } from '@/store/services/timesheetApiSlice';
import { useGetAllAllocationsQuery } from '@/store/services/allocationApiSlice';
import { styles } from "./employeeDashboard.styles";

const employeeOptions = [
  {
    href: '/dashboard/employee/timesheet',
    label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_SUBMIT_TIMESHEET_LABEL,
    description: STRINGS.DASHBOARD.EMPLOYEE_OPTION_SUBMIT_TIMESHEET_DESC,
  },
  {
    href: '/dashboard/employee/timesheets',
    label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_TIMESHEETS_LABEL,
    description: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_TIMESHEETS_DESC,
  },
  {
    href: '/dashboard/employee/allocations',
    label: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_ALLOCATIONS_LABEL,
    description: STRINGS.DASHBOARD.EMPLOYEE_OPTION_MY_ALLOCATIONS_DESC,
  },
];

export default function EmployeeDashboard() {
  const { data: resource, isLoading: loadingResource } = useGetMyResourceQuery();
  const { data: timesheets, isLoading: loadingTimesheets } = useGetTimesheetsQuery(
    resource ? { resourceId: resource._id } : undefined,
    { skip: !resource }
  );
  const { data: allocations, isLoading: loadingAllocations } = useGetAllAllocationsQuery(
    resource ? { resourceId: resource._id } : undefined,
    { skip: !resource }
  );

  if (loadingResource || loadingTimesheets || loadingAllocations) {
    return <div>{STRINGS.DASHBOARD.LOADING}</div>;
  }

  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(date.setDate(diff));
    mon.setHours(0, 0, 0, 0);
    return mon;
  };

  const getLastMonday = (d: Date) => {
    const mon = getMonday(d);
    mon.setDate(mon.getDate() - 7);
    return mon;
  };

  const lastCompletedWeekMonday = getLastMonday(new Date());
  const lastCompletedWeekSunday = new Date(lastCompletedWeekMonday.getTime() + 6 * 24 * 60 * 60 * 1000);
  lastCompletedWeekSunday.setHours(23, 59, 59, 999);

  const hasAllocationsInLastCompletedWeek = allocations
    ? allocations.some((a) => {
        const from = new Date(a.fromDate);
        const to = new Date(a.toDate);
        return a.status === 'ACTIVE' && from <= lastCompletedWeekSunday && to >= lastCompletedWeekMonday;
      })
    : false;

  const lastCompletedWeekTimesheet = timesheets?.find((ts) => {
    const tsDate = new Date(ts.weekStart);
    tsDate.setHours(0, 0, 0, 0);
    return tsDate.getTime() === lastCompletedWeekMonday.getTime();
  });

  const showReminder =
    hasAllocationsInLastCompletedWeek &&
    (!lastCompletedWeekTimesheet || lastCompletedWeekTimesheet.status === 'MISSED');

  const getFormattedDate = (d: Date) => {
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div>
        <h1>{STRINGS.DASHBOARD.MY_WORKSPACE}</h1>
      </div>

      {showReminder && (
        <div style={styles.reminderBanner}>
          <strong style={styles.reminderTitle}>{STRINGS.DASHBOARD.TIMESHEET_REMINDER}</strong>
          <p style={styles.reminderDescription}>
            {STRINGS.DASHBOARD.TIMESHEET_REMINDER_PREFIX} <strong>{getFormattedDate(lastCompletedWeekMonday)}</strong> {STRINGS.DASHBOARD.TIMESHEET_REMINDER_SUFFIX}
          </p>
        </div>
      )}

      <div style={styles.optionsContainer}>
        {employeeOptions.map((option) => (
          <div key={option.label} className="card">
            <h2 style={styles.optionTitle}>
              <Link to={option.href}>{option.label}</Link>
            </h2>
            <p style={styles.optionDescription}>
              {option.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

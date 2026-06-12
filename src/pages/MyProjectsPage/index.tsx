import { useState } from 'react';
import { useGetProjectsQuery } from '@/store/services/projectApiSlice';
import { useGetAllAllocationsQuery } from '@/store/services/allocationApiSlice';
import { useGetTimesheetsQuery } from '@/store/services/timesheetApiSlice';
import type { Project, Milestone } from '@/types/project';
import { STRINGS } from '@/constants/strings';
import { useRiskSummaryMutation } from '@/store/services/aiApiSlice';
import { styles } from './myProjectsPage.styles';

export default function MyProjectsPage() {
  const { data: projects, isLoading: loadingProjects } = useGetProjectsQuery();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { data: allocations, isLoading: loadingAllocations } = useGetAllAllocationsQuery(
    selectedProjectId ? { projectId: selectedProjectId } : undefined,
    { skip: !selectedProjectId }
  );

  const { data: timesheets } = useGetTimesheetsQuery(
    undefined,
    { skip: !selectedProjectId }
  );

  const [riskSummary, { isLoading: generatingRisk }] = useRiskSummaryMutation();
  const [aiRiskSummaryText, setAiRiskSummaryText] = useState('');

  const handleGetAiRiskSummary = async () => {
    setAiRiskSummaryText('');
    try {
      if (selectedProjectId) {
        const res = await riskSummary({ projectId: selectedProjectId }).unwrap();
        setAiRiskSummaryText(res.summary);
      }
    } catch {
      setAiRiskSummaryText('Failed to generate AI Risk Summary.');
    }
  };

  if (loadingProjects) {
    return <div>{STRINGS.DASHBOARD.LOADING}</div>;
  }

  const selectedProject = projects?.find((p) => p._id === selectedProjectId);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getHealthColor = (flag: string) => {
    switch (flag) {
      case 'AT_RISK':
        return { bg: '#fee2e2', text: '#dc2626', dot: '#ef4444', label: '🔴 AT RISK' };
      case 'ATTENTION':
        return { bg: '#fef3c7', text: '#d97706', dot: '#f59e0b', label: '🟡 ATTENTION' };
      default:
        return { bg: '#d1fae5', text: '#059669', dot: '#10b981', label: '🟢 ON TRACK' };
    }
  };

  const getRiskFlags = (project: Project) => {
    const risks: { key: string; valid: boolean; text: string }[] = [];
    const today = new Date();

    const incompleteOverdue = project.milestones.filter(
      (m) => m.status !== 'DONE' && new Date(m.dueDate) < today
    );

    if (incompleteOverdue.length > 0) {
      risks.push({
        key: 'milestone',
        valid: false,
        text: `${incompleteOverdue[0].title} milestone is overdue`,
      });
    } else {
      risks.push({
        key: 'milestone',
        valid: true,
        text: 'All milestones are on schedule',
      });
    }

    if (allocations && timesheets && selectedProjectId) {
      const getMonday = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const mon = new Date(date.setDate(diff));
        mon.setHours(0, 0, 0, 0);
        return mon;
      };

      const lastMonday = new Date(getMonday(today));
      lastMonday.setDate(lastMonday.getDate() - 7);
      const lastSunday = new Date(lastMonday.getTime() + 6 * 24 * 60 * 60 * 1000);
      lastSunday.setHours(23, 59, 59, 999);

      const activeAllocs = allocations.filter((a) => {
        const from = new Date(a.fromDate);
        const to = new Date(a.toDate);
        return a.status === 'ACTIVE' && from <= lastSunday && to >= lastMonday;
      });

      let expectedHours = 0;
      activeAllocs.forEach((a) => {
        expectedHours += (a.utilisationPercent / 100) * 40;
      });

      let loggedHours = 0;
      const lastWeekTimesheets = timesheets.filter(
        (ts) => new Date(ts.weekStart).getTime() === lastMonday.getTime() && ts.status === 'SUBMITTED'
      );

      lastWeekTimesheets.forEach((ts) => {
        ts.entries.forEach((e) => {
          const entryProjId = typeof e.projectId === 'object' && e.projectId ? e.projectId._id : e.projectId;
          if (entryProjId === selectedProjectId) {
            loggedHours += e.hoursWorked;
          }
        });
      });

      if (expectedHours > 0 && loggedHours < 0.5 * expectedHours) {
        risks.push({
          key: 'effort',
          valid: false,
          text: `Logged efforts are low: logged ${loggedHours} hrs of expected ${expectedHours} hrs last week`,
        });
      } else {
        risks.push({
          key: 'effort',
          valid: true,
          text: 'Resource effort logs match target capacity levels',
        });
      }
    }

    if (allocations && allocations.length > 0) {
      risks.push({
        key: 'resource',
        valid: true,
        text: 'Resources are correctly allocated to the project',
      });
    } else {
      risks.push({
        key: 'resource',
        valid: false,
        text: 'No resources allocated to this project',
      });
    }

    return risks;
  };

  return (
    <div style={styles.container}>
      <h1>{STRINGS.DASHBOARD.MANAGER_OPTION_PROJECTS_LABEL}</h1>
      <p style={styles.headerSubtitle}>
        Track milestones progress, project health flags, and resource assignments.
      </p>

      {selectedProject ? (
        <div className="card">
          <button
            onClick={() => {
              setSelectedProjectId(null);
              setAiRiskSummaryText('');
            }}
            style={styles.backButton}
          >
            ← Back to Projects
          </button>

          <div style={styles.detailsHeader}>
            <h2>{selectedProject.name}</h2>
            <span
              style={styles.healthBadge(
                getHealthColor(selectedProject.healthFlag).bg,
                getHealthColor(selectedProject.healthFlag).text
              )}
            >
              {getHealthColor(selectedProject.healthFlag).label}
            </span>
          </div>

          <p style={styles.description}>{selectedProject.description || 'No description provided.'}</p>

          <div style={styles.section}>
            <h3>Project Scope & Timeline</h3>
            <div style={styles.scopeGrid}>
              <div>
                <span style={styles.metaLabel}>Date Range</span>
                <strong>
                  {formatDate(selectedProject.startDate)} to {formatDate(selectedProject.endDate)}
                </strong>
              </div>
              <div>
                <span style={styles.metaLabel}>Total Story Points</span>
                <strong>{selectedProject.totalStoryPoints} SP</strong>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3>Health & Risk Evaluation Flags</h3>
            <div style={styles.riskList}>
              {getRiskFlags(selectedProject).map((risk, idx) => (
                <div
                  key={idx}
                  style={styles.riskRow(risk.valid)}
                >
                  <strong style={styles.riskStatusSymbol}>{risk.valid ? '✓' : '✗'}</strong>
                  <span>{risk.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <h3>AI Project Risk Analysis</h3>
            <div style={styles.aiContainer}>
              <button
                onClick={handleGetAiRiskSummary}
                disabled={generatingRisk}
                style={styles.aiButton(generatingRisk)}
              >
                {generatingRisk ? 'Generating health analysis...' : 'Get AI Risk Summary'}
              </button>

              {aiRiskSummaryText && (
                <div
                  style={styles.aiResponseBox}
                >
                  "{aiRiskSummaryText}"
                </div>
              )}
            </div>
          </div>

          <div style={styles.section}>
            <h3>Milestone Checklist</h3>
            {selectedProject.milestones.length === 0 ? (
              <p style={styles.emptyMessage}>No milestones created for this project.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Due Date</th>
                    <th style={styles.th}>Story Points</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProject.milestones.map((m: Milestone) => {
                    const isOverdue = m.status !== 'DONE' && new Date(m.dueDate) < new Date();
                    return (
                      <tr key={m._id} style={styles.tableBodyRow}>
                        <td style={styles.tdTitle}>{m.title}</td>
                        <td style={styles.tdDate}>
                          {formatDate(m.dueDate)}
                          {isOverdue && (
                            <span style={styles.overdueText}>
                              ⚠ OVERDUE
                            </span>
                          )}
                        </td>
                        <td style={styles.tdStoryPoints}>{m.storyPoints} SP</td>
                        <td style={styles.tdStatus}>
                          <span
                            style={styles.statusBadge(m.status)}
                          >
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div>
            <h3>Allocated Project Team</h3>
            {loadingAllocations ? (
              <div>Loading allocated members...</div>
            ) : !allocations || allocations.filter(a => a.status === 'ACTIVE').length === 0 ? (
              <p style={styles.emptyMessage}>No team members allocated to this project.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Utilisation</th>
                    <th style={styles.th}>From</th>
                    <th style={styles.th}>To</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.filter(a => a.status === 'ACTIVE').map((alloc) => (
                    <tr key={alloc._id} style={styles.tableBodyRow}>
                      <td style={styles.tdTitle}>{alloc.resourceId.fullName}</td>
                      <td style={styles.tdDate}>{alloc.utilisationPercent}%</td>
                      <td style={styles.tdDate}>{formatDate(alloc.fromDate)}</td>
                      <td style={styles.tdDate}>{formatDate(alloc.toDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <h2>My Scoped Projects</h2>
          {projects?.length === 0 ? (
            <p style={styles.emptyMessageWithMargin}>No projects managed by you are found in the system.</p>
          ) : (
            <table style={styles.listTable}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.listTh}>Project Name</th>
                  <th style={styles.listTh}>End Date</th>
                  <th style={styles.listTh}>Health Status</th>
                  <th style={styles.listTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects?.map((proj) => (
                  <tr key={proj._id} style={styles.tableBodyRow}>
                    <td style={styles.listTdBold}>{proj.name}</td>
                    <td style={styles.listTd}>{formatDate(proj.endDate)}</td>
                    <td style={styles.listTd}>
                      <span
                        style={styles.listBadge(
                          getHealthColor(proj.healthFlag).bg,
                          getHealthColor(proj.healthFlag).text
                        )}
                      >
                        {getHealthColor(proj.healthFlag).label}
                      </span>
                    </td>
                    <td style={styles.listActionTd}>
                      <button
                        onClick={() => setSelectedProjectId(proj._id)}
                        style={styles.viewDetailsButton}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

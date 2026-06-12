import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProjectsQuery } from '@/store/services/projectApiSlice';
import {
  useSkillMatchMutation,
  useRiskSummaryMutation,
  useTeamMatchMutation
} from '@/store/services/aiApiSlice';
import { STRINGS } from '@/constants/strings';
import type { TeamRoleMatchResult } from '@/types/ai';
import { styles } from './aiAssistantPage.styles';

interface CandidateResult {
  resourceId: string;
  name: string;
  reason: string;
  suggestedAllocation?: number;
  isUnderManager?: boolean;
  designation?: string;
  skills?: string[];
  freeHours?: number;
  currentAllocations?: string[];
  recentActivityTags?: string[];
}

export default function AiAssistantPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading: loadingProjects } = useGetProjectsQuery();

  const [skillMatch, { isLoading: matching }] = useSkillMatchMutation();
  const [riskSummary, { isLoading: summarizing }] = useRiskSummaryMutation();
  const [teamMatch, { isLoading: teamMatching }] = useTeamMatchMutation();

  const [activeTab, setActiveTab] = useState<'match' | 'risk' | 'team'>('match');

  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [requirement, setRequirement] = useState('');
  const [matchResults, setMatchResults] = useState<CandidateResult[]>([]);
  const [matchSummary, setMatchSummary] = useState('');
  const [matchMessage, setMatchMessage] = useState('');
  const [matchError, setMatchError] = useState('');

  const [riskProjectId, setRiskProjectId] = useState('');
  const [summaryOutput, setSummaryOutput] = useState('');
  const [riskError, setRiskError] = useState('');

  const [teamProjectId, setTeamProjectId] = useState('');
  const [teamRequirement, setTeamRequirement] = useState('');
  const [teamResults, setTeamResults] = useState<TeamRoleMatchResult[]>([]);
  const [teamSummary, setTeamSummary] = useState('');
  const [teamError, setTeamError] = useState('');

  const [matchModelUsed, setMatchModelUsed] = useState('');
  const [riskModelUsed, setRiskModelUsed] = useState('');
  const [teamModelUsed, setTeamModelUsed] = useState('');

  const activeProjects = projects
    ? projects.filter((p) => p.status === 'ACTIVE' || p.status === 'PLANNED')
    : [];

  const handleSkillMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMatchError('');
    setMatchMessage('');
    setMatchResults([]);
    setMatchSummary('');
    setMatchModelUsed('');

    if (!requirement.trim()) {
      setMatchError('Please describe your requirement');
      return;
    }

    try {
      const response = await skillMatch({
        requirement,
        projectId: selectedProjectId || undefined
      }).unwrap();

      if (response.results) {
        setMatchResults(response.results);
      }
      if (response.summary) {
        setMatchSummary(response.summary);
      }
      if (response.message) {
        setMatchMessage(response.message);
      }
      if (response.modelUsed) {
        setMatchModelUsed(response.modelUsed);
      }
    } catch (err: unknown) {
      const errorPayload = err as { data?: { error?: string } };
      setMatchError(errorPayload?.data?.error || 'AI Skill Match request failed. Please check backend config.');
    }
  };

  const handleRiskSummarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRiskError('');
    setSummaryOutput('');
    setRiskModelUsed('');

    if (!riskProjectId) {
      setRiskError('Please select a project');
      return;
    }

    try {
      const response = await riskSummary({ projectId: riskProjectId }).unwrap();
      setSummaryOutput(response.summary);
      if (response.modelUsed) {
        setRiskModelUsed(response.modelUsed);
      }
    } catch (err: unknown) {
      const errorPayload = err as { data?: { error?: string } };
      setRiskError(errorPayload?.data?.error || 'AI Risk Summary request failed.');
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeamError('');
    setTeamResults([]);
    setTeamSummary('');
    setTeamModelUsed('');

    if (!teamRequirement.trim()) {
      setTeamError('Please describe your team requirements');
      return;
    }

    try {
      const response = await teamMatch({
        requirement: teamRequirement,
        projectId: teamProjectId || undefined
      }).unwrap();
      setTeamResults(response.assignments || []);
      if (response.summary) {
        setTeamSummary(response.summary);
      }
      if (response.modelUsed) {
        setTeamModelUsed(response.modelUsed);
      }
    } catch (err: unknown) {
      const errorPayload = err as { data?: { error?: string } };
      setTeamError(errorPayload?.data?.error || 'AI Team Builder request failed.');
    }
  };

  const handleGoToAllocate = (candidate: CandidateResult) => {
    navigate('/dashboard/manager/allocate', {
      state: {
        projectId: selectedProjectId,
        resourceId: candidate.resourceId,
      },
    });
  };

  const handleGoToAllocateTeam = (resourceId: string) => {
    navigate('/dashboard/manager/allocate', {
      state: {
        projectId: teamProjectId,
        resourceId
      }
    });
  };

  if (loadingProjects) {
    return <div>{STRINGS.DASHBOARD.LOADING}</div>;
  }

  return (
    <div style={styles.container}>
      <h1>AI Assistant</h1>
      <p style={styles.headerSubtitle}>
        Leverage machine intelligence to find matching resources, allocate teams, or evaluate project health.
      </p>

      <div style={styles.tabsRow}>
        <button
          onClick={() => setActiveTab('match')}
          style={styles.tabButton(activeTab === 'match')}
        >
          Skill Match Suggestions
        </button>
        <button
          onClick={() => setActiveTab('team')}
          style={styles.tabButton(activeTab === 'team')}
        >
          AI Team Builder
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          style={styles.tabButton(activeTab === 'risk')}
        >
          Project Risk Summary
        </button>
      </div>

      {activeTab === 'match' && (
        <div style={styles.layoutContainer}>
          <div className="card" style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
            <h2>Find Resources Using AI</h2>
            <div style={styles.promptTip}>
              <strong>Prompt Tip:</strong> Provide details in plain English:
              <ul style={styles.promptList}>
                <li>Requested role & core skills (e.g. "React developer with Redux")</li>
                <li>Required bandwidth (e.g. "for 15 hours a week")</li>
                <li>Target timeline (e.g. "from 2026-07-01 to 2026-09-30")</li>
                <li>Minimum proficiency level (e.g. "Advanced", "Intermediate")</li>
              </ul>
            </div>
            <form onSubmit={handleSkillMatchSubmit} style={styles.formContainer}>
              <div>
                <label style={styles.fieldLabel}>Select Project (Optional)</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  style={styles.selectInput}
                >
                  <option value="">-- Choose Project --</option>
                  {activeProjects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={styles.fieldLabel}>Describe Requirement in Plain English</label>
                <textarea
                  rows={4}
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="e.g. We need an Advanced React Developer with Redux experience for 20 hours a week from 2026-07-01 to 2026-08-31"
                  style={styles.textareaInput}
                  required
                />
              </div>

              {matchError && (
                <div style={styles.errorBanner}>
                  {matchError}
                </div>
              )}

              <button
                type="submit"
                disabled={matching}
                style={styles.submitButton(matching)}
              >
                {matching ? 'Analyzing prompt... (calling AI)' : 'Find Candidates'}
              </button>
            </form>
          </div>

          {(matching || matchResults.length > 0 || matchSummary || matchMessage) && (
            <div className="card" style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
              <div style={styles.resultsTitleRow}>
                <h2 style={styles.candidateName}>Matched Suggestions</h2>
                {matchModelUsed && (
                  <span style={styles.modelBadge}>
                    Active Model: {matchModelUsed}
                  </span>
                )}
              </div>
              {matching ? (
                <div style={styles.loadingText}>
                  AI is parsing your prompt, checking capacities, and matching skills...
                </div>
              ) : (
                <div style={styles.resultsContainer}>
                  {matchSummary && (
                    <div style={styles.matchAnalysisBanner}>
                      <strong>AI Match Analysis:</strong>
                      <p style={styles.analysisTitleText}>{matchSummary}</p>
                    </div>
                  )}

                  {matchResults.length === 0 ? (
                    <div style={styles.gapAnalysisBanner}>
                      <p style={styles.gapText}>
                        <strong>Gaps Analysis:</strong> {matchMessage || 'No candidates found matching requirements and availability constraints.'}
                      </p>
                    </div>
                  ) : (
                    matchResults.map((candidate, idx) => (
                      <div
                        key={candidate.resourceId}
                        style={styles.candidateCard}
                      >
                        <div style={styles.candidateHeaderRow}>
                          <h3 style={styles.candidateName}>
                            {idx + 1}. {candidate.name}
                          </h3>
                          {candidate.suggestedAllocation !== undefined && (
                            <span style={styles.suggestedAllocationBadge}>
                              Suggested Allocation: {candidate.suggestedAllocation}%
                            </span>
                          )}
                        </div>
                        <p style={styles.reasonText}>
                          <strong>Reason:</strong> {candidate.reason}
                        </p>
                        <div style={styles.candidateMetaGrid}>
                          <div>
                            <strong>Designation:</strong> {candidate.designation || 'N/A'}
                          </div>
                          <div>
                            <strong>Free Capacity:</strong> {candidate.freeHours !== undefined ? `${candidate.freeHours} hrs/week` : 'N/A'}
                          </div>
                          <div style={styles.spanTwoCols}>
                            <strong>Skills:</strong> {candidate.skills && candidate.skills.length > 0 ? candidate.skills.join(', ') : 'N/A'}
                          </div>
                          {candidate.currentAllocations && candidate.currentAllocations.length > 0 && (
                            <div style={styles.spanTwoCols}>
                              <strong>Current Allocations:</strong> {candidate.currentAllocations.join(', ')}
                            </div>
                          )}
                          {candidate.recentActivityTags && candidate.recentActivityTags.length > 0 && (
                            <div style={styles.spanTwoCols}>
                              <strong>Recent Activity Tags:</strong> {candidate.recentActivityTags.join(', ')}
                            </div>
                          )}
                        </div>
                        {selectedProjectId && candidate.isUnderManager && (
                          <button
                            onClick={() => handleGoToAllocate(candidate)}
                            style={styles.allocateButton}
                          >
                            Go to Allocate Resource
                          </button>
                        )}
                      </div>
                    ))
                  )}
                  <p style={styles.notesDisclaimer}>
                    Note: These are AI-generated suggestions. Always verify availability and skills with the employee before allocating.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'team' && (
        <div style={styles.layoutContainer}>
          <div className="card" style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
            <h2>AI Whole-Team Staffing Allocator</h2>
            <div style={styles.promptTip}>
              <strong>Prompt Tip:</strong> Provide details in plain English:
              <ul style={styles.promptList}>
                <li>Timelines for the team (e.g. "for project from 2026-07-01 to 2026-10-31")</li>
                <li>List of roles with details (e.g. "Need one React Dev for 20 hrs/wk at Advanced level and one DevOps Dev for 10 hrs/wk")</li>
              </ul>
            </div>
            <form onSubmit={handleTeamSubmit} style={styles.formContainer}>
              <div>
                <label style={styles.fieldLabel}>Select Project (Optional)</label>
                <select
                  value={teamProjectId}
                  onChange={(e) => setTeamProjectId(e.target.value)}
                  style={styles.selectInput}
                >
                  <option value="">-- Choose Project --</option>
                  {activeProjects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={styles.fieldLabel}>Describe Team Requirements in Plain English</label>
                <textarea
                  rows={6}
                  value={teamRequirement}
                  onChange={(e) => setTeamRequirement(e.target.value)}
                  placeholder="e.g. We are building a team from 2026-07-01 to 2026-09-30. We need one senior React developer for 30 hours a week and one DevOps developer for 10 hours a week."
                  style={styles.textareaInput}
                  required
                />
              </div>

              {teamError && (
                <div style={styles.errorBanner}>
                  {teamError}
                </div>
              )}

              <button
                type="submit"
                disabled={teamMatching}
                style={styles.submitButton(teamMatching)}
              >
                {teamMatching ? 'Evaluating team configurations...' : 'Find Best Team Fit'}
              </button>
            </form>
          </div>

          {(teamMatching || teamResults.length > 0 || teamSummary) && (
            <div className="card" style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
              <div style={styles.resultsTitleRow}>
                <h2 style={styles.candidateName}>Evaluated Team Assignment</h2>
                {teamModelUsed && (
                  <span style={styles.modelBadge}>
                    Active Model: {teamModelUsed}
                  </span>
                )}
              </div>
              {teamMatching ? (
                <div style={styles.loadingText}>
                  AI is parsing team roles, calculating allocations, and solving assignment constraints...
                </div>
              ) : (
                <div style={styles.resultsContainer}>
                  {teamSummary && (
                    <div style={styles.matchAnalysisBanner}>
                      <strong>AI Team Builder Analysis:</strong>
                      <p style={styles.analysisTitleText}>{teamSummary}</p>
                    </div>
                  )}

                  {teamResults.map((result, idx) => (
                    <div
                      key={idx}
                      style={styles.teamRoleCard(result.status === 'FILLED')}
                    >
                      <div style={styles.candidateHeaderRow}>
                        <h3 style={styles.candidateName}>
                          Role: {result.roleName}
                        </h3>
                        <span
                          style={styles.teamRoleStatusBadge(result.status === 'FILLED')}
                        >
                          {result.status}
                        </span>
                      </div>

                      {result.status === 'FILLED' && result.assignedResource ? (
                        <div>
                          <p style={styles.filledAssignedName}>
                            <strong>Assigned:</strong> {result.assignedResource.name}
                          </p>
                          <p style={styles.filledReason}>
                            <strong>Reason:</strong> {result.assignedResource.reason}
                          </p>
                          <div style={styles.filledDetailsWrapper}>
                            <div>
                              <strong>Designation:</strong> {result.assignedResource.designation || 'N/A'}
                            </div>
                            <div>
                              <strong>Free Capacity:</strong> {result.assignedResource.freeHours !== undefined ? `${result.assignedResource.freeHours} hrs/week` : 'N/A'}
                            </div>
                            <div style={styles.spanTwoCols}>
                              <strong>Skills:</strong> {result.assignedResource.skills && result.assignedResource.skills.length > 0 ? result.assignedResource.skills.join(', ') : 'N/A'}
                            </div>
                            {result.assignedResource.currentAllocations && result.assignedResource.currentAllocations.length > 0 && (
                              <div style={styles.spanTwoCols}>
                                <strong>Current Allocations:</strong> {result.assignedResource.currentAllocations.join(', ')}
                              </div>
                            )}
                          </div>
                          {teamProjectId && (
                            <button
                              onClick={() => handleGoToAllocateTeam(result.assignedResource!.resourceId)}
                              style={styles.teamAllocateButton}
                            >
                              Allocate Resource
                            </button>
                          )}
                        </div>
                      ) : (
                        <p style={styles.gapText}>
                          <strong>Gaps Analysis:</strong> {result.unfilledReason}
                        </p>
                      )}
                    </div>
                  ))}
                  <p style={styles.notesDisclaimer}>
                    Note: Team builder applies strict single-pass best match. A person is never assigned to two roles concurrently.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'risk' && (
        <div style={styles.layoutContainer}>
          <div className="card" style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
            <h2>Project Health Analysis</h2>
            <form onSubmit={handleRiskSummarySubmit} style={styles.formContainerWithMargin}>
              <div>
                <label style={styles.fieldLabel}>Select Project</label>
                <select
                  value={riskProjectId}
                  onChange={(e) => setRiskProjectId(e.target.value)}
                  style={styles.selectInput}
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {activeProjects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {riskError && (
                <div style={styles.errorBanner}>
                  {riskError}
                </div>
              )}

              <button
                type="submit"
                disabled={summarizing}
                style={styles.submitButton(summarizing)}
              >
                {summarizing ? 'Generating AI summary...' : 'Generate Risk Summary'}
              </button>
            </form>
          </div>

          {(summarizing || summaryOutput) && (
            <div className="card" style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
              <div style={styles.resultsTitleRow}>
                <h2 style={styles.candidateName}>AI Risk Summary Output</h2>
                {riskModelUsed && (
                  <span style={styles.modelBadge}>
                    Active Model: {riskModelUsed}
                  </span>
                )}
              </div>
              {summarizing ? (
                <div style={styles.loadingText}>
                  Reading milestones check status, active resource allocations, and timesheet log details...
                </div>
              ) : (
                <div style={styles.riskSummaryContainer}>
                  <div
                    style={styles.riskSummaryBox}
                  >
                    "{summaryOutput}"
                  </div>
                  <p style={styles.riskDisclaimer}>
                    Note: AI-generated from current milestone and timesheet data. Always use alongside normal project management judgment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

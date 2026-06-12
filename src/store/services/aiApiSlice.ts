import { apiSlice } from '../apiSlice';
import type {
  SkillMatchRequest,
  SkillMatchResponse,
  RiskSummaryRequest,
  RiskSummaryResponse,
  TeamMatchRequest,
  TeamMatchResponse
} from '@/types/ai';

export const aiApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    skillMatch: builder.mutation<SkillMatchResponse, SkillMatchRequest>({
      query: (body) => ({
        url: '/ai/skill-match',
        method: 'POST',
        body,
      }),
    }),
    riskSummary: builder.mutation<RiskSummaryResponse, RiskSummaryRequest>({
      query: (body) => ({
        url: '/ai/risk-summary',
        method: 'POST',
        body,
      }),
    }),
    teamMatch: builder.mutation<TeamMatchResponse, TeamMatchRequest>({
      query: (body) => ({
        url: '/ai/team-match',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSkillMatchMutation, useRiskSummaryMutation, useTeamMatchMutation } = aiApiSlice;

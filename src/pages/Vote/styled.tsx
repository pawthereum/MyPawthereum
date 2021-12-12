import styled, { DefaultTheme } from 'styled-components'
import { ProposalState } from '../../state/governance/hooks'

const handleColorType = (status: ProposalState, theme: DefaultTheme) => {
  switch (status) {
    case ProposalState.Pending:
    case ProposalState.Active:
      return theme.blue1
    case ProposalState.Succeeded:
    case ProposalState.Executed:
      return theme.green1
    case ProposalState.Defeated:
      return theme.red1
    case ProposalState.Queued:
    case ProposalState.Canceled:
    case ProposalState.Expired:
    default:
      return theme.text3
  }
}

export const ProposalStatus = styled.span<{ status: ProposalState }>`
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 8px;
  color: ${({ status, theme }) => handleColorType(status, theme)};
  border: 1px solid ${({ status, theme }) => handleColorType(status, theme)};
  width: fit-content;
  justify-self: flex-end;
  text-transform: uppercase;
`

const handleSnapshotColorType = (state: string, theme: DefaultTheme) => {
  switch (state) {
    case 'active':
      return theme.green1
    case 'pending':
      return theme.blue1
    case 'closed':
      return theme.text3
    default:
      return theme.text3
  }
}

export const SnapshotProposalStatus = styled.span<{ state: string }>`
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 8px;
  color: ${({ state, theme }) => handleSnapshotColorType(state, theme)};
  border: 1px solid ${({ state, theme }) => handleSnapshotColorType(state, theme)};
  width: fit-content;
  justify-self: flex-end;
  text-transform: uppercase;
`

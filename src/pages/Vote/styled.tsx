import styled, { DefaultTheme } from 'styled-components'
import { ProposalState, SnapshotProposalState } from '../../state/governance/hooks'

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

const handleSnapshotColorType = (status: SnapshotProposalState, theme: DefaultTheme) => {
  switch (status) {
    case SnapshotProposalState.active:
      return theme.blue1
    case SnapshotProposalState.closed:
      return theme.green1
    default:
      return theme.text3
  }
}

export const SnapshotProposalStatus = styled.span<{ status: SnapshotProposalState }>`
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 8px;
  color: ${({ status, theme }) => handleSnapshotColorType(status, theme)};
  border: 1px solid ${({ status, theme }) => handleSnapshotColorType(status, theme)};
  width: fit-content;
  justify-self: flex-end;
  text-transform: uppercase;
`

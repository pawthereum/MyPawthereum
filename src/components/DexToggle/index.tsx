import React from 'react'
import { ToggleElement, ToggleWrapper } from 'components/Toggle/MultiToggle'
import { useUserDexSwapSelection } from 'state/user/hooks'
import uniswap from '../../assets/images/uniswap.png'
import shibainu from '../../assets/images/shibainu.png'

export default function DexToggle({
  dexA,
  dexB,
  handleDexToggle,
}: {
  dexA: string
  dexB: string
  handleDexToggle: () => void
}) {
  
  const [userDexSwapSelection, setUserDexSwapSelection] = useUserDexSwapSelection()

  console.log(userDexSwapSelection == dexA )

  return dexA && dexB ? (
    <div style={{ width: 'fit-content', display: 'flex', alignItems: 'center' }}>
      <ToggleWrapper width="fit-content">
        <ToggleElement isActive={userDexSwapSelection == dexA} fontSize="12px" onClick={handleDexToggle}>
          <img src={uniswap} alt="Uniswap V2" style={{ width: '100%', maxWidth: '24px', height: 'auto' }} /> 
        </ToggleElement>
        <ToggleElement isActive={userDexSwapSelection == dexB} fontSize="12px" onClick={handleDexToggle}>
          <img src={shibainu} alt="ShibaSwap" style={{ width: '100%', maxWidth: '20px', height: 'auto' }} /> 
        </ToggleElement>
      </ToggleWrapper>
    </div>
  ) : null
}

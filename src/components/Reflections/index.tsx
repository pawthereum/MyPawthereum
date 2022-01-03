import React from 'react'
import { TYPE } from '../../theme'
import { AutoColumn } from '../../components/Column'
import { RowBetween, AutoRow } from '../../components/Row'
import styled from 'styled-components'
import { CurrencyAmount } from '@uniswap/sdk-core'
import { useUSDCValue } from '../../hooks/useUSDCPrice'


const PaddedAutoColumn = styled(AutoColumn)`
  padding: 12px;
  min-width: 33%;
`

interface ReflectionInteface {
  reflectionBalance: CurrencyAmount | null | undefined,
  pawthBalance: CurrencyAmount | null | undefined,
  totalIn: number | null | undefined,
  totalOut: number | null | undefined,
}

export default function Reflections(props:ReflectionInteface) {
  const reflectionBalanceUsd = useUSDCValue(props.reflectionBalance) || 0
  const reflectionsEarned = props.reflectionBalance ? parseFloat(props.reflectionBalance?.toFixed(0)).toLocaleString() : 0
  const totalIn = props.totalIn ? parseFloat(props.totalIn?.toFixed(0)).toLocaleString() : 0
  const totalOut = props.totalOut ? parseFloat(props.totalOut?.toFixed(0)).toLocaleString() : 0
  
  const balanceWithoutReflections = props.reflectionBalance && props.pawthBalance 
    ?
      (parseFloat(props.pawthBalance?.toFixed(0)) - parseFloat(props.reflectionBalance?.toFixed(0))).toLocaleString()
    : 
      0

  return (
    <AutoColumn gap="lg">
      <AutoRow justify="center">
        <PaddedAutoColumn gap="sm">
          <TYPE.body textAlign="center">Total $PAWTH In</TYPE.body>
          <TYPE.largeHeader textAlign="center">{totalIn}</TYPE.largeHeader>
        </PaddedAutoColumn>

        <PaddedAutoColumn gap="sm">
          <TYPE.body textAlign="center">Total $PAWTH Out</TYPE.body>
          <TYPE.largeHeader textAlign="center">{totalOut}</TYPE.largeHeader>
        </PaddedAutoColumn>
      </AutoRow>

      <AutoRow justify="center">
        <PaddedAutoColumn gap="sm">
          <TYPE.body textAlign="center">$PAWTH Reflections Earned</TYPE.body>
          <TYPE.largeHeader textAlign="center">{reflectionsEarned}</TYPE.largeHeader>
        </PaddedAutoColumn>
        <PaddedAutoColumn gap="sm">
          <TYPE.body textAlign="center">$PAWTH Reflections USD Value</TYPE.body>
          <TYPE.largeHeader textAlign="center">${ reflectionBalanceUsd ? reflectionBalanceUsd?.toFixed(0).toLocaleString() : 0 }</TYPE.largeHeader>
        </PaddedAutoColumn>
      </AutoRow>

      <AutoColumn gap="sm">
        <TYPE.body textAlign="center">$PAWTH Balance without Reflections</TYPE.body>
        <TYPE.largeHeader textAlign="center">
          {balanceWithoutReflections}
        </TYPE.largeHeader>
      </AutoColumn>
    </AutoColumn>
  )
}
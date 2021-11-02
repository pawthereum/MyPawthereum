import React, { useEffect, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { Widget } from '@typeform/embed-react'
import { isMobile } from 'react-device-detect'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 768px;
  width: 100%;
`


export default function Feedback () {
  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md" style={{ 
        width: isMobile ? '100%' : '768px',
        height: isMobile ? '550px' : '768px'
      }}>
        <Widget id="wrFn178G" style={{ width:"100%", height:"100%" }}/>
      </TopSection>
    </PageWrapper>
  )
}

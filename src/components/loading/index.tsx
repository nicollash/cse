import styled from '@emotion/styled'
import { FunctionComponent } from 'react'

import { PropagateLoader } from 'react-spinners'

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.7);
  background-filter: blur(8px);
`

export const Loading: FunctionComponent = () => (
  <LoadingWrapper>
    <PropagateLoader loading={true} color="white" />
  </LoadingWrapper>
)

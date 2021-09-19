import { css } from '@emotion/react'
import { mediaBreakpointDown } from 'react-grid'
import { theme } from '~/styles'

export const styles = {
  container: css`
    background-color: white;
    padding: 60px;

    ${mediaBreakpointDown('md')} {
      padding: 20px;
    }
  `,

  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
  `,

  footer: css`
    padding: 15px;
  `,

  body: css`
    color: ${theme.color.primary};
  `,

  description: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1em;
  `,

  closeBtn: css`
    cursor: pointer;
  `,
  marginBottom: (mb) => css`
    margin-bottom: ${mb};
  `,
}

export const customStyles = ({ width, zIndex}) => ({
  content: {
    position: 'relative',
    top: '50%',
    left: '50%',
    right: '50%',
    padding: '0',
    bottom: '50%',
    width,
    maxWidth: '80%',
    backgroundColor: 'transparent',
    border: 'none',
    overflow: 'visible',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    overflow: 'auto',
    zIndex: zIndex ? zIndex : 1000
  },
})

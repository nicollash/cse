import { css } from '@emotion/react'
import { theme } from '~/styles'

export const styles = {
  container: css`
    background-color: white;

    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  `,

  header: css`
    display: flex;
    overflow: hidden;
    justify-content: center;

    background-color: #f5f7f8;
  `,

  tab: css`
    border: none;
    padding: 0.5em 0;
    user-select: none;
    color: #151f26;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;

    font-weight: bold;
    font-size: 1.25em;
    opacity: 0.5;
    position: relative;

    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  `,

  active: css`
    background-color: white;
    box-shadow: 0px 10px 16px rgba(57, 57, 57, 0.22);
    z-index: 1;
    opacity: 1;
  `,

  activeBar: css`
    &:after {
      content: '';
      height: 5px;
      border-radius: 5px;
      background-color: ${theme.color.primary};
      position: absolute;
      bottom: 0;
      left: 1em;
      right: 1em;
      display: block;
    }
  `,

  centerHeader: css`
    flex: none;
    padding: 1em;
  `,

  content: css`
    position: relative;
    z-index: 1;
  `,

  closeIcon: css`
    margin-left: 10px;
    cursor: pointer;
  `,
}

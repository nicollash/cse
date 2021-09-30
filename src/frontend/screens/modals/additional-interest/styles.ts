import { css } from '@emotion/react'
import { mediaBreakpointDown } from 'react-grid'

export const styles = {
    form: css``,

    row: css`
    /*margin: 0 -50px 0;*/
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: column;

    ${mediaBreakpointDown('md')} {
      flex-direction: column;
    }
  `,

    formGroup: css`
    margin: 0 2rem;
    min-width: 200px;
    flex: 1;
  `,

    deleteButton: css`
    position: absolute;
    left: 0;
  `,

    subSelect: css`
    color: #000000;
    /*min-width: 300px;*/
  `,

    icon: css`
    font-size: 2em;
    font-weight: bold;
    cursor: pointer;

    transition: all 0.3s;
    `,
    addSection: css`
        flex-direction: row;
        justify-content: flex-end;
        display: flex;
        padding-bottom: 1rem;
    `,
    linearLines: css`
        display: flex !important;
        flex-wrap: wrap;
        flex-direction: row;    
    `,
    aiInformation: css`
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: center;
    `,
    newItemForm: css`
      align-items: flex-start;
      flex-direction: initial;
    `,   
    addContainer: css`
      border-top-left-radius 10px;
      border-top-right-radius 10px;
      background-color:#f5f7f8;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      padding-top: 1rem;
      margin-bottom: 2rem;
    `,         
    itemsContainer: css`
      margin-right: 0.5rem;
      margin-left: 0.5rem;
    `,
    listItem:css`
      list-style-type: none;
    `,    
    saveButton:css`
    width: 100%;
    display: flex !important;
    justify-content: center;
    margin-bottom: 1rem;
    `,
    linearLabelWithValidation: css`
    align-items: baseline;
    margin-top: 1rem;
    `,
    addressInputContainer: css`
    min-width: 50%;
    `,
    regionCd: css`
    max-width: 350px
    `,
    cityStateContainer:css`
    width: 100%;
    /*max-width: 50%;*/
    `,
    stateProvCd: css`
    width: 50%;
    `,
    city:css`
    width: 50%;
    `,
    cancelBottomContainer: css`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-right: 1rem;
    `,
    cancelBottom: css`
    color: #f5f7f8;
    `,
    firstLineContainer: css`
    min-width: 50%;
    `,
    formPadding: css`
    padding: 0 2rem;
    `,
    interestNameContainer: css`
    min-width:50%;
    `,
    interestNameArea: css`
    min-width:80%
    `
}
